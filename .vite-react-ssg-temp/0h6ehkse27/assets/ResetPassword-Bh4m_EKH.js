import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { l as useToast, w as westfieldLogo, B as Button, s as supabase } from "../main.mjs";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { EyeOff, Eye } from "lucide-react";
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
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Invalid or expired link",
          description: "Please request a new password reset link.",
          variant: "destructive"
        });
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate, toast]);
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive"
      });
      return;
    }
    if (password.length < 12) {
      toast({
        title: "Password too short",
        description: "Password must be at least 12 characters long.",
        variant: "destructive"
      });
      return;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      toast({
        title: "Weak password",
        description: "Password must include uppercase, lowercase, number, and special character.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      if (error) throw error;
      const { error: activateError } = await supabase.rpc("activate_client_on_login");
      if (activateError && false) {
        console.error("Error activating client:", activateError);
      }
      toast({
        title: "Password updated successfully",
        description: "You can now log in with your new password."
      });
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" }) }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-lg shadow-lg p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsx("a", { href: "/", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: westfieldLogo,
          alt: "Westfield Logo",
          className: "h-16 cursor-pointer hover:opacity-80 transition-opacity"
        }
      ) }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center mb-2", children: "Reset Your Password" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center mb-6", children: "Enter your new password below" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleResetPassword, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "New Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "password",
                type: showPassword ? "text" : "password",
                placeholder: "••••••••",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                required: true,
                disabled: loading,
                minLength: 12
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 18 }) : /* @__PURE__ */ jsx(Eye, { size: 18 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPassword", children: "Confirm New Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "confirmPassword",
                type: showConfirmPassword ? "text" : "password",
                placeholder: "••••••••",
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                required: true,
                disabled: loading,
                minLength: 12
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowConfirmPassword(!showConfirmPassword),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 18 }) : /* @__PURE__ */ jsx(Eye, { size: 18 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full",
            disabled: loading,
            children: loading ? "Updating Password..." : "Update Password"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "link",
          onClick: () => navigate("/login"),
          className: "text-sm",
          children: "Back to Login"
        }
      ) })
    ] }) }) })
  ] });
};
export {
  ResetPassword as default
};
