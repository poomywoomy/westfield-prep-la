import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Head } from "vite-react-ssg";
import { B as Button, S as StructuredData, H as Header, F as Footer, n as generateMetaTags } from "../main.mjs";
import { B as Breadcrumbs } from "./Breadcrumbs-CCWjaqDX.js";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Package, Scan, Camera, DollarSign, XCircle, Clock, ClipboardCheck, Database, ZoomIn, AlertCircle, ArrowRight } from "lucide-react";
import { C as Card, a as CardContent } from "./card-WfKgKW48.js";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
const ReceivingHero = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const inspectionSteps = [
    { icon: Package, label: "Shipment Arrives", status: "complete" },
    { icon: Scan, label: "Barcode Scanned", status: "complete" },
    { icon: Camera, label: "Photos Captured", status: "active" },
    { icon: CheckCircle, label: "QC Verified", status: "pending" }
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2e3);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-950 via-violet-900 to-slate-950" }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60",
        initial: { top: "20%" },
        animate: { top: ["20%", "80%", "20%"] },
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "container relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-5 gap-12 items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-3 text-left", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -30 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.6 },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-400 animate-pulse" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-purple-200", children: "Quality Checkpoint Active" })
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight", children: [
              "Every Unit Inspected.",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400", children: "Every Problem Caught." })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-xl text-purple-100/80 mb-8 leading-relaxed max-w-2xl", children: [
              "We photograph 100% of incoming inventory. When suppliers make mistakes, you'll have proof. When units arrive damaged, you'll see it before it hits shelves.",
              /* @__PURE__ */ jsx("span", { className: "text-purple-300 font-medium", children: " 99.8% accuracy. Same-day updates." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-400/20 mb-8 max-w-lg", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: "w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-red-300 font-medium", children: "Without proper QC:" }),
                /* @__PURE__ */ jsx("p", { className: "text-red-200/80 text-sm", children: "E-commerce sellers lose an average of $4,700/month to receiving errors they never catch." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "lg",
                  onClick: () => navigate("/contact"),
                  className: "bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-6 text-lg",
                  children: "Start Inspecting"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "lg",
                  variant: "outline",
                  onClick: () => navigate("/pricing"),
                  className: "border-2 border-purple-400/50 bg-purple-500/10 text-white hover:bg-purple-500/20 px-8 py-6 text-lg",
                  children: "View Pricing"
                }
              )
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "lg:col-span-2",
          initial: { opacity: 0, x: 30 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.6, delay: 0.3 },
          children: /* @__PURE__ */ jsxs("div", { className: "relative bg-slate-900/80 rounded-2xl border border-purple-400/30 p-6 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-red-500" }),
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-yellow-500" }),
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-green-500" }),
              /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-purple-300 font-mono", children: "LIVE INSPECTION" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: inspectionSteps.map((step, idx) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: `flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${idx <= activeStep ? "bg-purple-500/20 border border-purple-400/40" : "bg-slate-800/50 border border-slate-700/50"}`,
                animate: {
                  scale: idx === activeStep ? 1.02 : 1
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${idx <= activeStep ? "bg-purple-500" : "bg-slate-700"}`, children: /* @__PURE__ */ jsx(step.icon, { className: `w-5 h-5 ${idx <= activeStep ? "text-white" : "text-slate-400"}` }) }),
                  /* @__PURE__ */ jsx("span", { className: `font-medium ${idx <= activeStep ? "text-white" : "text-slate-400"}`, children: step.label }),
                  idx < activeStep && /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-green-400 ml-auto" }),
                  idx === activeStep && /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      className: "w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full ml-auto",
                      animate: { rotate: 360 },
                      transition: { duration: 1, repeat: Infinity, ease: "linear" }
                    }
                  )
                ]
              },
              idx
            )) }),
            activeStep === 2 && /* @__PURE__ */ jsx(
              motion.div,
              {
                className: "absolute inset-0 bg-white rounded-2xl",
                initial: { opacity: 0 },
                animate: { opacity: [0, 0.6, 0] },
                transition: { duration: 0.3, repeat: Infinity, repeatDelay: 1.7 }
              }
            )
          ] })
        }
      )
    ] }) })
  ] });
};
const ReceivingPainPoints = () => {
  const painPoints = [
    {
      icon: DollarSign,
      stat: "$4,700",
      label: "Average monthly loss from receiving errors",
      description: "Undetected shortages, supplier mistakes, and miscounts drain your profit margins silently.",
      color: "red"
    },
    {
      icon: XCircle,
      stat: "23%",
      label: "Of shipments have discrepancies",
      description: "Nearly 1 in 4 supplier shipments arrive with errors. Are you catching them?",
      color: "amber"
    },
    {
      icon: Clock,
      stat: "72hrs",
      label: "Average dispute window",
      description: "Without photo proof, you lose leverage with suppliers after 72 hours.",
      color: "orange"
    },
    {
      icon: AlertTriangle,
      stat: "40%",
      label: "Of damaged claims denied",
      description: "Without receiving photos, carriers deny nearly half of all damage claims.",
      color: "red"
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-gradient-to-b from-slate-950 to-slate-900", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: [
            "What Happens ",
            /* @__PURE__ */ jsx("span", { className: "text-red-400", children: "Without" }),
            " Proper QC"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-400 max-w-2xl mx-auto", children: "These numbers represent real losses happening to e-commerce sellers every month." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: painPoints.map((point, idx) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay: idx * 0.1 },
        className: `relative p-6 rounded-2xl border overflow-hidden ${point.color === "red" ? "bg-red-950/30 border-red-500/30" : point.color === "amber" ? "bg-amber-950/30 border-amber-500/30" : "bg-orange-950/30 border-orange-500/30"}`,
        children: [
          /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${point.color === "red" ? "bg-red-500/20" : point.color === "amber" ? "bg-amber-500/20" : "bg-orange-500/20"}`, children: /* @__PURE__ */ jsx(point.icon, { className: `w-6 h-6 ${point.color === "red" ? "text-red-400" : point.color === "amber" ? "text-amber-400" : "text-orange-400"}` }) }),
          /* @__PURE__ */ jsx("p", { className: `text-4xl font-bold mb-2 ${point.color === "red" ? "text-red-400" : point.color === "amber" ? "text-amber-400" : "text-orange-400"}`, children: point.stat }),
          /* @__PURE__ */ jsx("p", { className: "text-white font-medium mb-2", children: point.label }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: point.description })
        ]
      },
      idx
    )) })
  ] }) });
};
const ReceivingTimeline = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      icon: Package,
      title: "Shipment Arrival",
      time: "0 min",
      description: "Your shipment arrives at our dock. We log carrier, tracking, and condition on arrival.",
      details: ["Carrier ID recorded", "Condition noted", "Photos of packaging"]
    },
    {
      icon: Scan,
      title: "Barcode Verification",
      time: "5 min",
      description: "Every unit scanned against your ASN. Mismatches flagged immediately.",
      details: ["SKU verification", "Quantity count", "BOL cross-reference"]
    },
    {
      icon: Camera,
      title: "Photo Documentation",
      time: "15 min",
      description: "100% of units photographed. Damage, defects, and condition captured.",
      details: ["Individual unit photos", "Batch overview shots", "Defect close-ups"]
    },
    {
      icon: ClipboardCheck,
      title: "Quality Inspection",
      time: "25 min",
      description: "Physical inspection for damage, manufacturing defects, and compliance.",
      details: ["Physical condition check", "Label verification", "Compliance review"]
    },
    {
      icon: Database,
      title: "Inventory Update",
      time: "30 min",
      description: "Units added to your inventory with location, lot, and expiry tracking.",
      details: ["Real-time dashboard update", "Location assignment", "Alert if discrepancy"]
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-slate-900", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: [
            "5-Step ",
            /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: "Inspection" }),
            " Timeline"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-400", children: "From dock to dashboard in under 30 minutes" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative mb-12", children: [
      /* @__PURE__ */ jsx("div", { className: "hidden lg:block absolute top-12 left-0 right-0 h-1 bg-slate-700", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "h-full bg-purple-500",
          initial: { width: "0%" },
          animate: { width: `${activeStep / (steps.length - 1) * 100}%` },
          transition: { duration: 0.5 }
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6", children: steps.map((step, idx) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: idx * 0.1 },
          className: "relative",
          onMouseEnter: () => setActiveStep(idx),
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `relative z-10 w-24 h-24 mx-auto rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${idx <= activeStep ? "bg-purple-500 shadow-lg shadow-purple-500/30" : "bg-slate-800 border border-slate-700"}`,
                children: [
                  /* @__PURE__ */ jsx(step.icon, { className: `w-10 h-10 ${idx <= activeStep ? "text-white" : "text-slate-500"}` }),
                  idx < activeStep && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-white" }) })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsx("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-medium ${idx <= activeStep ? "bg-purple-500/20 text-purple-300" : "bg-slate-800 text-slate-500"}`, children: step.time }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center", children: [
              /* @__PURE__ */ jsx("h3", { className: `font-bold mb-2 ${idx <= activeStep ? "text-white" : "text-slate-500"}`, children: step.title }),
              /* @__PURE__ */ jsx("p", { className: `text-sm ${idx <= activeStep ? "text-slate-300" : "text-slate-600"}`, children: step.description })
            ] })
          ]
        },
        idx
      )) })
    ] }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        className: "max-w-2xl mx-auto p-6 rounded-2xl bg-purple-500/10 border border-purple-400/30",
        children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xl font-bold text-white mb-4", children: [
            steps[activeStep].title,
            " Details:"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: steps[activeStep].details.map((detail, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-purple-200", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-purple-400 flex-shrink-0" }),
            detail
          ] }, idx)) })
        ]
      },
      activeStep
    )
  ] }) });
};
const conditionDoc = "/assets/condition-documentation-DyMfqCdy.webp";
const damageDetection = "/assets/damage-detection-0B150dlM.webp";
const quantityVerification = "/assets/quantity-verification-zcwMjN_M.webp";
const labelCompliance = "/assets/label-compliance-9AyH9xCS.webp";
const discrepancyEvidence = "/assets/discrepancy-evidence-p1WopRqX.webp";
const storageLocation = "/assets/storage-location-DsEk8KWa.webp";
const ReceivingPhotoGallery = () => {
  const photoExamples = [
    {
      title: "Condition Documentation",
      description: "Every unit photographed on arrival showing packaging condition",
      status: "good",
      label: "VERIFIED",
      image: conditionDoc
    },
    {
      title: "Damage Detection",
      description: "Close-up photos of any damage for supplier claims",
      status: "issue",
      label: "DAMAGED",
      image: damageDetection
    },
    {
      title: "Quantity Verification",
      description: "Batch photos showing actual count vs. expected",
      status: "good",
      label: "COUNT: 248",
      image: quantityVerification
    },
    {
      title: "Label Compliance",
      description: "FNSKU and expiry labels verified and documented",
      status: "good",
      label: "COMPLIANT",
      image: labelCompliance
    },
    {
      title: "Discrepancy Evidence",
      description: "Proof for supplier disputes and carrier claims",
      status: "issue",
      label: "SHORTAGE",
      image: discrepancyEvidence
    },
    {
      title: "Storage Location",
      description: "Final location assignment documented",
      status: "good",
      label: "BIN: A-12-3",
      image: storageLocation
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-purple-950/30", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-purple-400 animate-pulse" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-purple-200", children: "30-Day Photo Retention" })
          ] }),
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: [
            "100% ",
            /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: "Photo Documentation" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-400 max-w-2xl mx-auto", children: "Every unit photographed, every issue documented. Your proof for supplier disputes and carrier claims." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: photoExamples.map((photo, idx) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay: idx * 0.1 },
        className: "group relative rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-400/50 transition-all duration-300",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "aspect-video relative overflow-hidden", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: photo.image,
                alt: `${photo.title} - Quality control documentation showing ${photo.description.toLowerCase()}`,
                className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: `absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${photo.status === "good" ? "bg-green-500/30 text-green-300 border border-green-400/40" : "bg-red-500/30 text-red-300 border border-red-400/40"}`, children: photo.label }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/40 transition-colors flex items-center justify-center", children: /* @__PURE__ */ jsx(ZoomIn, { className: "w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-slate-900/90", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            photo.status === "good" ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-white mb-1", children: photo.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: photo.description })
            ] })
          ] }) })
        ]
      },
      idx
    )) })
  ] }) });
};
const ReceivingFAQ = () => {
  const faqs = [
    {
      question: "What's included in your receiving service?",
      answer: "Full receiving includes shipment verification, unit counting, condition inspection, high-resolution photography, barcode scanning, and immediate inventory updates in your dashboard. We also flag and document any discrepancies with detailed notes and photos."
    },
    {
      question: "How fast are shipments processed after arrival?",
      answer: "Most shipments are fully processed within 4 hours of arrival. This includes counting, inspection, photography, and updating your inventory. Rush processing is available for time-sensitive shipments."
    },
    {
      question: "Do you provide photos of all items received?",
      answer: "Yes, 100% of items are photographed during receiving. Photos are uploaded to your dashboard and retained for 30 days. You'll see images of packaging condition, individual units, and any damage discovered."
    },
    {
      question: "What happens if there's a discrepancy between expected and actual quantities?",
      answer: "Discrepancies are immediately flagged with photo documentation and detailed notes. You receive a notification and can review the issue in your dashboard. We help you file claims with carriers or suppliers when needed."
    },
    {
      question: "Can I specify special handling instructions for my shipments?",
      answer: "Absolutely. You can add custom handling instructions to any ASN or configure default instructions for your account. We follow your specifications for fragile items, orientation requirements, and special inspection criteria."
    },
    {
      question: "How are damaged items handled during receiving?",
      answer: "Damaged items are photographed, documented, and moved to a separate damaged inventory location. You're notified immediately and can decide whether to dispose, return to sender, or attempt rework. Learn more about our returns processing for damaged goods."
    },
    {
      question: "Do you inspect all items or just sample?",
      answer: "We inspect 100% of units in every shipment. Unlike 3PLs that sample-check, we verify every single unit to catch all discrepancies. This protects you from discovering problems later when it's too late to file claims."
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Frequently Asked Questions" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Everything you need to know about our receiving and inspection services." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto space-y-4", children: faqs.map((faq, idx) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay: idx * 0.05 },
        children: /* @__PURE__ */ jsx(Card, { className: "transition-all duration-300 hover:shadow-lg", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-3 text-purple-900", children: faq.question }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: faq.answer })
        ] }) })
      },
      idx
    )) }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "text-center mt-12",
        children: /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
          "Have more questions?",
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/contact", className: "text-purple-600 hover:underline font-medium", children: "Contact our team" })
        ] })
      }
    )
  ] }) });
};
const ReceivingCTA = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-br from-purple-950 via-violet-900 to-slate-900 text-white", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      className: "max-w-4xl mx-auto text-center",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: "Ready for Professional QC Inspection?" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-purple-100/80 mb-8 max-w-2xl mx-auto", children: "Protect your inventory with meticulous inspection and documentation. Every unit verified, photographed, and ready for sale." }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-4 mb-10", children: ["100% Photo Coverage", "Same-Day Processing", "Discrepancy Protection"].map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-purple-200", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-purple-400" }),
          /* @__PURE__ */ jsx("span", { children: item })
        ] }, idx)) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "lg",
              onClick: () => navigate("/contact"),
              className: "bg-white text-purple-900 hover:bg-purple-100 px-8 py-6 text-lg group",
              children: [
                "Start Inspection Service",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "lg",
              variant: "outline",
              onClick: () => navigate("/pricing"),
              className: "border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg",
              children: "View Pricing"
            }
          )
        ] })
      ]
    }
  ) }) });
};
const ReceivingInspection = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const meta = generateMetaTags(
    "Receiving & QC Inspection | Los Angeles 3PL Prep Center",
    "Professional receiving and inspection at our LA prep center. 3PL services with photo documentation, damage detection, and same-day inventory updates.",
    "/receiving-inspection"
  );
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Receiving & Inspection Services",
    "description": "Quality control and receiving inspection with photo documentation",
    "provider": {
      "@type": "Organization",
      "name": "Westfield Prep Center"
    }
  };
  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What's included in receiving service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Full receiving includes shipment verification, unit counting, condition inspection, photography, and immediate inventory updates."
        }
      },
      {
        "@type": "Question",
        "name": "How fast are shipments processed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most shipments are processed within 4 hours of arrival. Same-day inventory updates are standard for all receiving."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide photos of all items?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we photograph 100% of received units. Photos are available in your dashboard for 30 days."
        }
      }
    ]
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: meta.title }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: meta.description }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "3pl los angeles, receiving inspection, prep center, quality control, qc inspection, amazon fba prep" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: meta.canonical })
    ] }),
    /* @__PURE__ */ jsx(StructuredData, { type: "service", data: serviceData }),
    /* @__PURE__ */ jsx(StructuredData, { type: "faq", data: faqSchemaData }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{ label: "Receiving & Inspection", path: "/receiving-inspection" }] }),
      /* @__PURE__ */ jsx(ReceivingHero, {}),
      /* @__PURE__ */ jsx(ReceivingPainPoints, {}),
      /* @__PURE__ */ jsx(ReceivingTimeline, {}),
      /* @__PURE__ */ jsx(ReceivingPhotoGallery, {}),
      /* @__PURE__ */ jsx(ReceivingFAQ, {}),
      /* @__PURE__ */ jsx(ReceivingCTA, {}),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
};
export {
  ReceivingInspection as default
};
