import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { o as useAuth, l as useToast, s as supabase, w as westfieldLogo, B as Button } from "../main.mjs";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-WfKgKW48.js";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { ArrowLeft } from "lucide-react";
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
const AdminSettings = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      navigate("/login");
    }
  }, [user, role, loading, navigate]);
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  const fetchProfile = async () => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
    if (!error && data) {
      setProfile(data);
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setCompanyName(data.company_name || "");
      setPhoneNumber(data.phone_number || "");
    }
  };
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const { error } = await supabase.from("profiles").update({
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      phone_number: phoneNumber,
      full_name: `${firstName} ${lastName}`.trim()
    }).eq("id", user?.id);
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
      fetchProfile();
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
  if (!user || role !== "admin") {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-card", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Link, { to: "/admin/dashboard", children: /* @__PURE__ */ jsx("img", { src: westfieldLogo, alt: "Westfield Logo", className: "h-10 cursor-pointer" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Settings" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => navigate("/admin/dashboard"), children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Back to Dashboard"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "container mx-auto px-4 py-8 max-w-2xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
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
            /* @__PURE__ */ jsx(Input, { value: user?.email || "", disabled: true })
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
      ] })
    ] }) })
  ] });
};
export {
  AdminSettings as default
};
