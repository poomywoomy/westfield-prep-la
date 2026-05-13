import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { l as useToast, o as useAuth, w as westfieldLogo, B as Button, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, g as DialogDescription, s as supabase } from "../main.mjs";
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
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role, loading: authLoading } = useAuth();
  useEffect(() => {
    if (!authLoading && user && role) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "client") {
        navigate("/client/dashboard");
      }
    }
  }, [user, role, authLoading, navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: rateLimitData, error: rateLimitError } = await supabase.functions.invoke(
        "check-rate-limit",
        {
          body: {
            key: `login_${email}`,
            maxAttempts: 5,
            windowMinutes: 30
          }
        }
      );
      if (rateLimitError) {
        toast({
          title: "Service unavailable",
          description: "Please try again in a moment.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      if (!rateLimitData?.allowed) {
        toast({
          title: "Too many login attempts",
          description: `Please wait ${rateLimitData?.retryAfter || 1800} seconds before trying again or reset your password.`,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        throw error;
      }
      const { data: clientData } = await supabase.from("clients").select("password_expires_at, status").eq("user_id", data.user.id).maybeSingle();
      if (clientData?.password_expires_at) {
        const expiresAt = new Date(clientData.password_expires_at);
        const now = /* @__PURE__ */ new Date();
        if (now > expiresAt) {
          await supabase.auth.signOut();
          toast({
            title: "Temporary Password Expired",
            description: "Your temporary password has expired. Please request a new password reset.",
            variant: "destructive"
          });
          setShowForgotPassword(true);
          setLoading(false);
          return;
        }
      }
      const { data: roleData, error: roleError } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).single();
      if (roleError) {
        await supabase.auth.signOut();
        throw new Error("Authentication failed. Please check your credentials.");
      }
      if (clientData?.password_expires_at && clientData?.status === "pending") {
        toast({
          title: "Login successful",
          description: "Please change your temporary password immediately in Settings.",
          variant: "default"
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });
      }
      if (roleData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (error) {
      try {
        const userAgentHash = Array.from(
          new Uint8Array(
            await crypto.subtle.digest("SHA-256", new TextEncoder().encode(navigator.userAgent))
          )
        ).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
        await supabase.from("audit_log").insert({
          action: "FAILED_LOGIN",
          table_name: "auth.users",
          new_data: {
            email,
            error_message: "Authentication failed",
            // Generic message to prevent info leakage
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            user_agent_hash: userAgentHash
            // Hashed instead of raw user agent
          }
        });
      } catch (logError) {
      }
      toast({
        title: "Login failed",
        description: "Authentication failed. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      const { data: rateLimitData, error: rateLimitError } = await supabase.functions.invoke(
        "check-rate-limit",
        {
          body: {
            key: `password_reset_${resetEmail}`,
            maxAttempts: 3,
            windowMinutes: 15
          }
        }
      );
      if (rateLimitError || !rateLimitData?.allowed) {
        toast({
          title: "Too many attempts",
          description: "Please wait 15 minutes before requesting another reset link.",
          variant: "destructive"
        });
        setResetLoading(false);
        return;
      }
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.functions.invoke("send-password-reset", {
        body: {
          email: resetEmail,
          redirectUrl
        }
      });
      if (error) throw error;
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link."
      });
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      toast({
        title: "Error sending reset email",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setResetLoading(false);
    }
  };
  if (authLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Loading..." }) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" }) }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-lg shadow-lg p-8", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsx("a", { href: "/", className: "cursor-pointer hover:opacity-80 transition-opacity", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: westfieldLogo,
            alt: "Westfield Logo",
            className: "h-16"
          }
        ) }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center mb-2", children: "Portal Login" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center mb-6", children: "Sign in to access your account" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                placeholder: "your@email.com",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                required: true,
                disabled: loading
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
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
                  disabled: loading
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
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "w-full",
              disabled: loading,
              children: loading ? "Signing in..." : "Sign In"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "link",
              onClick: () => setShowForgotPassword(true),
              className: "text-sm",
              children: "Forgot your password?"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Dialog, { open: showForgotPassword, onOpenChange: setShowForgotPassword, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsx(DialogTitle, { children: "Reset Your Password" }),
          /* @__PURE__ */ jsx(DialogDescription, { children: "Enter your email address and we'll send you a link to reset your password." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleForgotPassword, className: "space-y-4 mt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "resetEmail", children: "Email" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "resetEmail",
                type: "email",
                placeholder: "your@email.com",
                value: resetEmail,
                onChange: (e) => setResetEmail(e.target.value),
                required: true,
                disabled: resetLoading
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "w-full",
              disabled: resetLoading,
              children: resetLoading ? "Sending..." : "Send Reset Link"
            }
          )
        ] })
      ] }) })
    ] }) })
  ] });
};
export {
  Login as default
};
