import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { o as useAuth, l as useToast, s as supabase, w as westfieldLogo, B as Button } from "../main.mjs";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-WfKgKW48.js";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DOpNgkQL.js";
import { ArrowLeft, User } from "lucide-react";
import "vite-react-ssg";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "framer-motion";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
import "@radix-ui/react-tabs";
const ClientSettings = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientData, setClientData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [hasSetPassword, setHasSetPassword] = useState(true);
  useEffect(() => {
    if (!loading && (!user || role !== "client")) {
      navigate("/login");
    }
  }, [user, role, loading, navigate]);
  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);
  const fetchClientData = async () => {
    const { data, error } = await supabase.from("clients").select("id, first_name, last_name, company_name, email, phone_number, default_low_stock_threshold").eq("user_id", user?.id).single();
    if (!error && data) {
      setClientData(data);
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setCompanyName(data.company_name || "");
      setPhoneNumber(data.phone_number || "");
      setLowStockThreshold(data.default_low_stock_threshold || 10);
      setHasSetPassword(true);
    }
  };
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const { error } = await supabase.from("clients").update({
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      phone_number: phoneNumber,
      contact_name: `${firstName} ${lastName}`.trim(),
      default_low_stock_threshold: lowStockThreshold
    }).eq("user_id", user?.id);
    setIsSavingProfile(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      fetchClientData();
    }
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive"
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    if (newPassword.length < 12) {
      toast({
        title: "Error",
        description: "Password must be at least 12 characters",
        variant: "destructive"
      });
      return;
    }
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      toast({
        title: "Error",
        description: "Password must include uppercase, lowercase, number, and special character",
        variant: "destructive"
      });
      return;
    }
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke("change-password", {
        body: {
          currentPassword,
          newPassword
        }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({
        title: "Success",
        description: "Password updated successfully"
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setHasSetPassword(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Loading..." }) });
  }
  if (!user || role !== "client") {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-card", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Link, { to: "/client/dashboard", children: /* @__PURE__ */ jsx("img", { src: westfieldLogo, alt: "Westfield Logo", className: "h-10 cursor-pointer" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Settings" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => navigate("/client/dashboard"), children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Back to Dashboard"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "account", className: "space-y-6", children: [
      /* @__PURE__ */ jsx(TabsList, { className: "w-full max-w-2xl", children: /* @__PURE__ */ jsxs(TabsTrigger, { value: "account", children: [
        /* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }),
        "Account"
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "account", className: "max-w-2xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Account Information" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Update your basic account details" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleProfileUpdate, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "firstName", children: "First Name" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "firstName",
                  value: firstName,
                  onChange: (e) => setFirstName(e.target.value),
                  placeholder: "Enter first name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "lastName", children: "Last Name" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "lastName",
                  value: lastName,
                  onChange: (e) => setLastName(e.target.value),
                  placeholder: "Enter last name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "companyName", children: "Company Name" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "companyName",
                  value: companyName,
                  onChange: (e) => setCompanyName(e.target.value),
                  placeholder: "Enter company name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Email" }),
              /* @__PURE__ */ jsx(Input, { value: clientData?.email || "", disabled: true })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "phoneNumber", children: "Phone Number" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "phoneNumber",
                  value: phoneNumber,
                  onChange: (e) => setPhoneNumber(e.target.value),
                  placeholder: "Enter phone number"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "lowStockThreshold", children: "Default Low Stock Threshold" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "lowStockThreshold",
                  type: "number",
                  min: "0",
                  value: lowStockThreshold,
                  onChange: (e) => setLowStockThreshold(parseInt(e.target.value) || 0),
                  placeholder: "10"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Alert when inventory falls below this level" })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSavingProfile, children: isSavingProfile ? "Saving..." : "Save Changes" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Change Password" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Update your account password" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handlePasswordChange, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "currentPassword", children: "Current Password" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "currentPassword",
                  type: "password",
                  value: currentPassword,
                  onChange: (e) => setCurrentPassword(e.target.value),
                  placeholder: "Enter current password",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "newPassword", children: "New Password" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "newPassword",
                  type: "password",
                  value: newPassword,
                  onChange: (e) => setNewPassword(e.target.value),
                  placeholder: "Enter new password",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPassword", children: "Confirm Password" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "confirmPassword",
                  type: "password",
                  value: confirmPassword,
                  onChange: (e) => setConfirmPassword(e.target.value),
                  placeholder: "Confirm new password",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isUpdating, children: isUpdating ? "Updating..." : "Update Password" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-destructive", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-destructive", children: "Delete Account" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Permanently delete your client account and all associated data" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4 bg-destructive/10 border border-destructive/20 rounded-lg", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium mb-2", children: "⚠️ Warning: This action cannot be undone" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Deleting your account will permanently remove:" }),
              /* @__PURE__ */ jsxs("ul", { className: "text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1", children: [
                /* @__PURE__ */ jsx("li", { children: "All inventory records and history" }),
                /* @__PURE__ */ jsx("li", { children: "All shipments and orders" }),
                /* @__PURE__ */ jsx("li", { children: "All billing information" }),
                /* @__PURE__ */ jsx("li", { children: "All account settings and preferences" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "destructive",
                onClick: async () => {
                  if (!confirm("Are you absolutely sure you want to delete your account? This cannot be undone.")) {
                    return;
                  }
                  if (!confirm("Last chance: Delete all account data permanently?")) {
                    return;
                  }
                  try {
                    const { data, error } = await supabase.rpc("delete_own_client_account");
                    if (error) throw error;
                    toast({
                      title: "Account Deleted",
                      description: "Your account has been permanently deleted. You will be logged out."
                    });
                    setTimeout(async () => {
                      await supabase.auth.signOut();
                      navigate("/");
                    }, 2e3);
                  } catch (error) {
                    toast({
                      title: "Deletion Failed",
                      description: error.message || "Failed to delete account",
                      variant: "destructive"
                    });
                  }
                },
                children: "Delete Account Permanently"
              }
            )
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
};
export {
  ClientSettings as default
};
