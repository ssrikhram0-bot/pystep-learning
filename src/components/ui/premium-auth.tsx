"use client";

import React, { useState, useEffect, useId } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthMode = "signin" | "signup";

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  autoComplete?: string;
}

interface AuthFormProps {
  /** Initial mode: 'signin' or 'signup'. Defaults to 'signin'. */
  defaultMode?: AuthMode;
  /** Called when the form is submitted with valid data. */
  onSubmit?: (data: Record<string, string>, mode: AuthMode) => Promise<void> | void;
  /** Custom class names applied to the root wrapper. */
  className?: string;
}

// ─── InputField ───────────────────────────────────────────────────────────────

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showPasswordToggle?: boolean;
}

function InputField({
  id,
  label,
  type,
  placeholder,
  icon,
  autoComplete,
  value,
  onChange,
  error,
  showPasswordToggle,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType =
    showPasswordToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative group">
        {/* Left icon */}
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200">
          {icon}
        </span>

        <input
          id={id}
          name={id}
          type={resolvedType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full bg-gray-50 border rounded-xl py-3 pl-11 pr-11",
            "text-sm text-gray-900 placeholder:text-gray-400",
            "outline-none transition-all duration-200",
            "focus:ring-2 focus:ring-black/10 focus:border-gray-400 focus:bg-white",
            "hover:border-gray-300",
            error
              ? "border-red-400 bg-red-50 focus:ring-red-100 focus:border-red-400"
              : "border-gray-200"
          )}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
        />

        {/* Password toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {/* Inline error */}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

/**
 * PremiumAuthForm — clean light-mode sign-in / sign-up card.
 *
 * Features:
 * - Tab-based mode switching (Sign In ↔ Sign Up)
 * - Password visibility toggle
 * - Per-field validation with accessible error messages
 * - Loading state with spinner
 * - Minimal, modern light design
 */
export function PremiumAuthForm({
  defaultMode = "signin",
  onSubmit,
  className,
}: AuthFormProps) {
  const uid = useId();
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ── Field definitions ──────────────────────────────────────────────────────

  const signInFields: FormField[] = [
    {
      id: `${uid}-email`,
      label: "Email address",
      type: "email",
      placeholder: "you@example.com",
      icon: <Mail size={16} />,
      autoComplete: "email",
    },
    {
      id: `${uid}-password`,
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      icon: <Lock size={16} />,
      autoComplete: "current-password",
    },
  ];

  const signUpFields: FormField[] = [
    {
      id: `${uid}-name`,
      label: "Full name",
      type: "text",
      placeholder: "Jane Doe",
      icon: <User size={16} />,
      autoComplete: "name",
    },
    ...signInFields.map((f) =>
      f.id.endsWith("password")
        ? { ...f, id: `${uid}-new-password`, autoComplete: "new-password" }
        : f
    ),
    {
      id: `${uid}-confirm`,
      label: "Confirm password",
      type: "password",
      placeholder: "••••••••",
      icon: <Lock size={16} />,
      autoComplete: "new-password",
    },
  ];

  const activeFields = mode === "signin" ? signInFields : signUpFields;

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleChange(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
    if (globalError) setGlobalError(null);
  }

  function validate(): boolean {
    const next: Record<string, string> = {};

    for (const field of activeFields) {
      const val = (values[field.id] ?? "").trim();
      if (!val) {
        next[field.id] = `${field.label} is required.`;
        continue;
      }
      if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        next[field.id] = "Enter a valid email address.";
      }
      if (
        (field.id.includes("password") || field.id.includes("new-password")) &&
        val.length < 8
      ) {
        next[field.id] = "Password must be at least 8 characters.";
      }
    }

    if (mode === "signup") {
      const pw = values[`${uid}-new-password`] ?? "";
      const cp = values[`${uid}-confirm`] ?? "";
      if (pw && cp && pw !== cp) {
        next[`${uid}-confirm`] = "Passwords do not match.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGlobalError(null);
    try {
      await onSubmit?.(values, mode);
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setGlobalError(message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next: AuthMode) {
    setMode(next);
    setValues({});
    setErrors({});
    setGlobalError(null);
    setSuccess(false);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">

          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-gray-500">
              {mode === "signin"
                ? "Sign in to continue to your workspace"
                : "Start your journey — it's free forever"}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            role="tablist"
            aria-label="Authentication mode"
            className="flex bg-gray-100 rounded-xl p-1 gap-1"
          >
            {(["signin", "signup"] as AuthMode[]).map((m) => (
              <button
                key={m}
                role="tab"
                id={`${uid}-tab-${m}`}
                aria-selected={mode === m}
                aria-controls={`${uid}-panel`}
                type="button"
                onClick={() => switchMode(m)}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                  mode === m
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            id={`${uid}-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${mode}`}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {/* Fields */}
            {activeFields.map((field) => (
              <InputField
                key={field.id}
                {...field}
                value={values[field.id] ?? ""}
                onChange={(v) => handleChange(field.id, v)}
                error={errors[field.id]}
                showPasswordToggle={field.type === "password"}
              />
            ))}

            {/* Forgot password (sign-in only) */}
            {mode === "signin" && (
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-800 transition-colors focus:outline-none focus-visible:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Global error */}
            {globalError && (
              <div
                role="alert"
                className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600"
              >
                <span className="shrink-0">⚠</span>
                {globalError}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                role="status"
                className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700"
              >
                <span className="shrink-0">✓</span>
                {mode === "signin"
                  ? "Signed in successfully!"
                  : "Account created! Welcome aboard."}
              </div>
            )}

            {/* Submit */}
            <button
              id={`${uid}-submit`}
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl mt-2",
                "text-sm font-semibold text-white bg-black",
                "hover:bg-black/90 active:scale-[0.98]",
                "transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              )}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {mode === "signin" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400">
            By continuing, you agree to our{" "}
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </button>
            .
          </p>

        </div>
      </div>
    </div>
  );
}
