import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { l as useToast, T as TranslatedText, m as cn, B as Button, s as supabase, t as trackEvent } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Textarea } from "./select-Cb0hy2VC.js";
import { C as Checkbox } from "./checkbox-B9ll9gww.js";
import { z } from "zod";
import { L as LAUNCHPAD_SERVICES } from "./launchpadServices-DTpLXarh.js";
const contactSchema = z.object({
  serviceType: z.enum(["3pl", "launchpad", "both"]),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  business: z.string().trim().min(1, "Business name is required").max(100),
  unitsPerMonth: z.string().optional(),
  skuCount: z.string().optional(),
  marketplaces: z.array(z.string()).optional(),
  otherMarketplace: z.string().trim().max(200).optional(),
  receivingMethod: z.enum(["cartons", "pallets", "both"]).optional(),
  packagingRequirements: z.enum(["unbranded", "custom", "own"]).optional(),
  timeline: z.string().optional(),
  comments: z.string().trim().min(10, "Please share at least a brief description (10+ characters)").max(1e3)
}).superRefine((data, ctx) => {
  if (data.serviceType !== "launchpad") {
    if (!data.unitsPerMonth) ctx.addIssue({ code: "custom", path: ["unitsPerMonth"], message: "Units sold per month is required" });
    if (!data.skuCount) ctx.addIssue({ code: "custom", path: ["skuCount"], message: "SKU count is required" });
    if (!data.marketplaces || data.marketplaces.length === 0) ctx.addIssue({ code: "custom", path: ["marketplaces"], message: "Select at least one marketplace" });
    if (!data.receivingMethod) ctx.addIssue({ code: "custom", path: ["receivingMethod"], message: "Receiving method is required" });
    if (!data.packagingRequirements) ctx.addIssue({ code: "custom", path: ["packagingRequirements"], message: "Packaging requirements is required" });
    if (!data.timeline) ctx.addIssue({ code: "custom", path: ["timeline"], message: "Timeline is required" });
  }
});
const ContactForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialService = (() => {
    const s = searchParams.get("service");
    return s === "launchpad" || s === "3pl" || s === "both" ? s : "3pl";
  })();
  const focus = searchParams.get("focus");
  const initialLaunchpadServices = focus ? focus.split(",").filter((slug) => LAUNCHPAD_SERVICES.some((s) => s.slug === slug)) : [];
  const [formData, setFormData] = useState({
    serviceType: initialService,
    name: "",
    email: "",
    phone: "",
    business: "",
    unitsPerMonth: "",
    skuCount: "",
    marketplaces: [],
    otherMarketplace: "",
    receivingMethod: "",
    packagingRequirements: "",
    timeline: "",
    launchpadServices: initialLaunchpadServices,
    comments: "",
    honeypot: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (initialService !== "3pl" || focus) {
      const el = document.getElementById("contact");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleServiceTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, serviceType: value }));
    setErrors({});
  };
  const handleMarketplaceToggle = (marketplace) => {
    setFormData((prev) => {
      const marketplaces = prev.marketplaces.includes(marketplace) ? prev.marketplaces.filter((m) => m !== marketplace) : [...prev.marketplaces, marketplace];
      const otherMarketplace = marketplaces.includes("Other") ? prev.otherMarketplace : "";
      return { ...prev, marketplaces, otherMarketplace };
    });
    if (errors.marketplaces) setErrors((prev) => ({ ...prev, marketplaces: "" }));
  };
  const handleLaunchpadServiceToggle = (slug) => {
    setFormData((prev) => ({
      ...prev,
      launchpadServices: prev.launchpadServices.includes(slug) ? prev.launchpadServices.filter((s) => s !== slug) : [...prev.launchpadServices, slug]
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData.honeypot) return;
      const { honeypot, launchpadServices, ...rest } = formData;
      let comments = rest.comments;
      if ((rest.serviceType === "launchpad" || rest.serviceType === "both") && launchpadServices.length > 0) {
        const names = launchpadServices.map((slug) => LAUNCHPAD_SERVICES.find((s) => s.slug === slug)?.name || slug).join(", ");
        comments = `Requested Launchpad services: ${names}

${comments}`.trim();
      }
      const submitData = { ...rest, comments };
      const validatedData = contactSchema.parse(submitData);
      const { data: rateLimitData, error: rateLimitError } = await supabase.functions.invoke(
        "check-rate-limit",
        { body: { key: `contact_form_${validatedData.email}`, maxAttempts: 3, windowMinutes: 5 } }
      );
      if (rateLimitError) {
        toast({ title: "Service unavailable", description: "Please try again in a moment.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      if (!rateLimitData?.allowed) {
        toast({
          title: "Too many attempts",
          description: `Please wait ${rateLimitData?.retryAfter || 300} seconds before submitting again.`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: validatedData
      });
      if (error) {
        toast({ title: "Error", description: "Failed to send your message. Please try again.", variant: "destructive" });
        return;
      }
      trackEvent("form_submit", {
        form_type: "quote_request",
        service_type: validatedData.serviceType,
        marketplaces: (validatedData.marketplaces || []).join(","),
        units_per_month: validatedData.unitsPerMonth || ""
      });
      toast({ title: "Success!", description: "Your message has been sent. We'll get back to you soon!" });
      setTimeout(() => navigate("/thank-you"), 1500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
        });
        setErrors(newErrors);
      } else {
        toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const showOtherInput = formData.marketplaces.includes("Other");
  const show3PLFields = formData.serviceType !== "launchpad";
  const commentsLabel = formData.serviceType === "launchpad" ? "Tell us what you need help with *" : formData.serviceType === "both" ? "Comments — for both 3PL & Launchpad *" : "Comments or Additional Requirements *";
  const commentsPlaceholder = formData.serviceType === "launchpad" ? "e.g. Shopify dashboard setup, Amazon seller account, A+ content / storefront, product 3D imaging, model photoshoot, social media content..." : formData.serviceType === "both" ? "Share your fulfillment needs and any brand-build help you need (Shopify dashboard, Amazon storefront, A+ content, 3D imaging, photoshoots, etc.)" : "Tell us about any special requirements, product types, or questions...";
  const serviceOptions = [
    { value: "3pl", label: "3PL Services" },
    { value: "launchpad", label: "Launchpad" },
    { value: "both", label: "Both" }
  ];
  return /* @__PURE__ */ jsx("section", { id: "contact", className: "py-12 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-primary mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Get Your Quote" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Tell us what you need — 3PL fulfillment, Launchpad brand services, or both." }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 bg-card p-8 rounded-lg shadow-lg border border-border", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Label, { className: "mb-3 block", children: [
          /* @__PURE__ */ jsx(TranslatedText, { children: "What do you need?" }),
          " *"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg", children: serviceOptions.map((opt) => {
          const active = formData.serviceType === opt.value;
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => handleServiceTypeChange(opt.value),
              className: cn(
                "py-3 px-4 rounded-md text-sm font-semibold transition-all",
                active ? "bg-primary text-primary-foreground shadow-md" : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-background/60"
              ),
              "aria-pressed": active,
              children: /* @__PURE__ */ jsx(TranslatedText, { children: opt.label })
            },
            opt.value
          );
        }) })
      ] }),
      (formData.serviceType === "launchpad" || formData.serviceType === "both") && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-5", children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1 block", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Which Launchpad services do you need?" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-4", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Check all that apply. We'll tailor the quote to exactly these." }) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: LAUNCHPAD_SERVICES.map((s) => {
          const checked = formData.launchpadServices.includes(s.slug);
          return /* @__PURE__ */ jsxs(
            "label",
            {
              htmlFor: `lp-${s.slug}`,
              className: cn(
                "flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors",
                checked ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-muted/50"
              ),
              children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    id: `lp-${s.slug}`,
                    checked,
                    onCheckedChange: () => handleLaunchpadServiceToggle(s.slug),
                    className: "mt-0.5"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-foreground leading-tight", children: s.name }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: s.summary })
                ] })
              ]
            },
            s.slug
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "name", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Full Name" }),
            " *"
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              name: "name",
              value: formData.name,
              onChange: handleChange,
              className: errors.name ? "border-destructive" : "",
              placeholder: "John Doe"
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "email", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Email Address" }),
            " *"
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              name: "email",
              type: "email",
              value: formData.email,
              onChange: handleChange,
              className: errors.email ? "border-destructive" : "",
              placeholder: "john@example.com"
            }
          ),
          errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "phone", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Phone Number" }),
            " *"
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "phone",
              name: "phone",
              type: "tel",
              value: formData.phone,
              onChange: handleChange,
              className: errors.phone ? "border-destructive" : "",
              placeholder: "(555) 123-4567"
            }
          ),
          errors.phone && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.phone })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "business", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Business Name" }),
            " *"
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "business",
              name: "business",
              value: formData.business,
              onChange: handleChange,
              className: errors.business ? "border-destructive" : "",
              placeholder: "Your Company LLC"
            }
          ),
          errors.business && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.business })
        ] })
      ] }),
      show3PLFields && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "unitsPerMonth", children: [
              /* @__PURE__ */ jsx(TranslatedText, { children: "Units Sold per Month" }),
              " *"
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: formData.unitsPerMonth, onValueChange: (v) => handleSelectChange("unitsPerMonth", v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: errors.unitsPerMonth ? "border-destructive" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select monthly units" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { className: "bg-background border border-border z-50", children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "just-starting", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Just Starting" }) }),
                /* @__PURE__ */ jsx(SelectItem, { value: "0-1000", children: "0 – 1,000" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "1001-5000", children: "1,001 – 5,000" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "5001-10000", children: "5,001 – 10,000" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "10000+", children: "10,000+" })
              ] })
            ] }),
            errors.unitsPerMonth && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.unitsPerMonth })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "skuCount", children: [
              /* @__PURE__ */ jsx(TranslatedText, { children: "SKU Count" }),
              " *"
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: formData.skuCount, onValueChange: (v) => handleSelectChange("skuCount", v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: errors.skuCount ? "border-destructive" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select SKU count" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { className: "bg-background border border-border z-50", children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "0-10", children: "0 - 10" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "11-25", children: "11 - 25" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "25-50", children: "25 - 50" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "50+", children: "50+" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "unsure", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Unsure" }) })
              ] })
            ] }),
            errors.skuCount && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.skuCount })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Label, { children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "Marketplaces" }),
            " *"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mt-2", children: ["Shopify", "Amazon", "Walmart", "TikTok Shop", "Other"].map((m) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: `marketplace-${m}`,
                checked: formData.marketplaces.includes(m),
                onCheckedChange: () => handleMarketplaceToggle(m)
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: `marketplace-${m}`, className: "text-sm font-medium leading-none cursor-pointer", children: /* @__PURE__ */ jsx(TranslatedText, { children: m }) })
          ] }, m)) }),
          showOtherInput && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
            Input,
            {
              id: "otherMarketplace",
              name: "otherMarketplace",
              value: formData.otherMarketplace,
              onChange: handleChange,
              placeholder: "Please specify marketplace(s)",
              className: "max-w-md"
            }
          ) }),
          errors.marketplaces && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.marketplaces })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "receivingMethod", children: [
              /* @__PURE__ */ jsx(TranslatedText, { children: "Receiving Method" }),
              " *"
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: formData.receivingMethod, onValueChange: (v) => handleSelectChange("receivingMethod", v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: errors.receivingMethod ? "border-destructive" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select receiving method" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { className: "bg-background border border-border z-50", children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "cartons", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Cartons" }) }),
                /* @__PURE__ */ jsx(SelectItem, { value: "pallets", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Pallets" }) }),
                /* @__PURE__ */ jsx(SelectItem, { value: "both", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Both" }) })
              ] })
            ] }),
            errors.receivingMethod && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.receivingMethod })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "packagingRequirements", children: [
              /* @__PURE__ */ jsx(TranslatedText, { children: "Packaging Requirements" }),
              " *"
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: formData.packagingRequirements, onValueChange: (v) => handleSelectChange("packagingRequirements", v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: errors.packagingRequirements ? "border-destructive" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select packaging" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { className: "bg-background border border-border z-50", children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "unbranded", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Unbranded packaging" }) }),
                /* @__PURE__ */ jsx(SelectItem, { value: "custom", children: /* @__PURE__ */ jsx(TranslatedText, { children: "Custom packaging" }) }),
                /* @__PURE__ */ jsx(SelectItem, { value: "own", children: /* @__PURE__ */ jsx(TranslatedText, { children: "I will provide my own packaging" }) })
              ] })
            ] }),
            errors.packagingRequirements && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.packagingRequirements })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "timeline", children: [
            /* @__PURE__ */ jsx(TranslatedText, { children: "When would you like to start?" }),
            " *"
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: formData.timeline, onValueChange: (v) => handleSelectChange("timeline", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: errors.timeline ? "border-destructive" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select timeline" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { className: "bg-background border border-border z-50", children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "asap", children: /* @__PURE__ */ jsx(TranslatedText, { children: "ASAP" }) }),
              /* @__PURE__ */ jsx(SelectItem, { value: "1-3-months", children: /* @__PURE__ */ jsx(TranslatedText, { children: "1–3 months" }) }),
              /* @__PURE__ */ jsx(SelectItem, { value: "3-6-months", children: /* @__PURE__ */ jsx(TranslatedText, { children: "3–6 months" }) }),
              /* @__PURE__ */ jsx(SelectItem, { value: "6-12-months", children: /* @__PURE__ */ jsx(TranslatedText, { children: "6–12 months" }) }),
              /* @__PURE__ */ jsx(SelectItem, { value: "12-months-plus", children: /* @__PURE__ */ jsx(TranslatedText, { children: "12 months+" }) })
            ] })
          ] }),
          errors.timeline && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.timeline })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "comments", children: /* @__PURE__ */ jsx(TranslatedText, { children: commentsLabel }) }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "comments",
            name: "comments",
            value: formData.comments,
            onChange: handleChange,
            className: errors.comments ? "border-destructive" : "",
            placeholder: commentsPlaceholder,
            rows: 5
          }
        ),
        errors.comments && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive mt-1", children: errors.comments })
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          name: "honeypot",
          value: formData.honeypot,
          onChange: handleChange,
          style: { display: "none" },
          tabIndex: -1,
          autoComplete: "off"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          disabled: isSubmitting,
          className: "w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg py-6",
          children: isSubmitting ? /* @__PURE__ */ jsx(TranslatedText, { children: "Submitting..." }) : /* @__PURE__ */ jsx(TranslatedText, { children: "Get Quote" })
        }
      )
    ] }) })
  ] }) });
};
export {
  ContactForm as C
};
