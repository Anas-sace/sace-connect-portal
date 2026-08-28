import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, GraduationCap, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AdminLoginModal } from "@/components/sace/AdminLoginModal";
import { SaceLogo } from "@/components/sace/SaceLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROGRAMS, SACE_SUBLINE, SACE_TAGLINE } from "@/lib/sace";
import { submissionSchema, submitResponse } from "@/lib/responses.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SACE Student Enquiry — Internship & Immersion Programs" },
      {
        name: "description",
        content:
          "Register your interest in the South Australian College of English Internship and Immersion Programs. Takes under a minute on your phone.",
      },
      { property: "og:title", content: "SACE Student Enquiry — Internship & Immersion Programs" },
      {
        property: "og:description",
        content:
          "Scan, select your program and share your details with the South Australian College of English.",
      },
    ],
  }),
  component: PublicFormPage,
});

type FieldErrors = Partial<Record<"name" | "phone_whatsapp" | "email" | "college", string>>;

function PublicFormPage() {
  const submit = useServerFn(submitResponse);

  const [program, setProgram] = useState("");
  const [form, setForm] = useState({ name: "", phone_whatsapp: "", email: "", college: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const clicks = useRef<number[]>([]);

  function handleLogoTap() {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 3000), now];
    if (clicks.current.length >= 5) {
      clicks.current = [];
      setLoginOpen(true);
    }
  }

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const parsed = submissionSchema.safeParse({ ...form, program_type: program });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      if (!program) toast.error("Please choose what you are looking for.");
      return;
    }

    setSubmitting(true);
    try {
      await submit({ data: parsed.data });
      setDone(true);
      toast.success("Response submitted to SACE");
    } catch {
      toast.error("We couldn't submit your response. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setForm({ name: "", phone_whatsapp: "", email: "", college: "" });
    setProgram("");
    setErrors({});
    setDone(false);
  }

  return (
    <main className="page-glow min-h-screen px-4 py-8 sm:py-14">
      <div className="mx-auto w-full max-w-xl">
        <header className="flex flex-col items-center text-center">
          <SaceLogo interactive onClick={handleLogoTap} className="h-11 sm:h-14" />
          <p className="mt-4 text-sm font-medium text-primary sm:text-base">{SACE_TAGLINE}</p>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{SACE_SUBLINE}</p>
        </header>

        {done ? (
          <section className="surface-card mt-8 px-6 py-12 text-center animate-in fade-in duration-500">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-9 text-success" aria-hidden />
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-primary">Thank You!</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your response has been successfully submitted to SACE.
              <br />
              We will get in touch with you shortly.
            </p>
            <Button className="mt-8 w-full sm:w-auto" onClick={resetAll}>
              Submit Another Response
            </Button>
          </section>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <section className="surface-card p-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  <Sparkles className="size-4 text-accent-foreground" aria-hidden />
                </span>
                <div>
                  <h1 className="text-lg font-semibold text-foreground sm:text-xl">
                    What are you looking for?
                  </h1>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose a program to continue.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select value={program} onValueChange={setProgram}>
                  <SelectTrigger id="program" className="h-12 w-full rounded-xl">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {program ? (
                  <p className="pt-1 text-xs text-muted-foreground">
                    {PROGRAMS.find((p) => p.value === program)?.description}
                  </p>
                ) : null}
              </div>
            </section>

            {program ? (
              <section className="surface-card p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <GraduationCap className="size-4 text-primary" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Tell us about yourself</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Applying for the {program}.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <Field
                    id="name"
                    label="Name"
                    value={form.name}
                    error={errors.name}
                    autoComplete="name"
                    placeholder="Your full name"
                    onChange={(v) => update("name", v)}
                  />
                  <Field
                    id="phone"
                    label="Phone Number (WhatsApp)"
                    type="tel"
                    inputMode="tel"
                    value={form.phone_whatsapp}
                    error={errors.phone_whatsapp}
                    autoComplete="tel"
                    placeholder="+61 400 000 000"
                    onChange={(v) => update("phone_whatsapp", v)}
                  />
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    inputMode="email"
                    value={form.email}
                    error={errors.email}
                    autoComplete="email"
                    placeholder="you@example.com"
                    onChange={(v) => update("email", v)}
                  />
                  <Field
                    id="college"
                    label="College"
                    value={form.college}
                    error={errors.college}
                    autoComplete="organization"
                    placeholder="Your college or university"
                    onChange={(v) => update("college", v)}
                  />
                </div>

                <Button type="submit" disabled={submitting} className="mt-7 h-12 w-full text-base">
                  {submitting ? (
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  ) : null}
                  {submitting ? "Submitting…" : "Submit Response"}
                </Button>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5" aria-hidden />
                  Your details are shared only with the SACE admissions team.
                </p>
              </section>
            ) : null}
          </form>
        )}
      </div>

      <AdminLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </main>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  error?: string | undefined;
  type?: string;
  inputMode?: "tel" | "email" | "text";
  placeholder?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
}

function Field({
  id,
  label,
  value,
  error,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
  onChange,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl"
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
