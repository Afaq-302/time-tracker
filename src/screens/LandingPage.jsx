"use client";

import Link from "next/link";
import {
  Timer,
  Clock,
  FolderKanban,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  Zap,
  Download,
  Layers3,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

const features = [
  {
    icon: Timer,
    title: "Real-time Timer",
    description:
      "Start, pause, and stop your timer with one click. Your progress is saved automatically.",
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Organize your work into projects. Track billable hours and client work separately.",
  },
  {
    icon: BarChart3,
    title: "Detailed Reports",
    description:
      "See where your time goes with beautiful reports. Export data to CSV anytime.",
  },
  {
    icon: Clock,
    title: "Manual Entry",
    description:
      "Forgot to start the timer? Add entries manually with full date and time control.",
  },
];

const benefits = [
  "Track time across unlimited projects",
  "Export detailed reports to CSV",
  "Dark mode support",
  "Works offline with local storage",
  "100% free, no signup required",
];

// ✅ New: simple, relevant trust stats (no logic changes, just UI)
const stats = [
  { label: "Average setup time", value: "30s", icon: Zap },
  { label: "Export formats", value: "CSV", icon: Download },
  { label: "Privacy-first", value: "Local", icon: ShieldCheck },
];

// ✅ New: lightweight “How it works” section content
const steps = [
  {
    title: "Create a project",
    desc: "Group tasks by client, team, or personal goals.",
    icon: Layers3,
  },
  {
    title: "Track time effortlessly",
    desc: "One click to start. Pause anytime. Manual entry when needed.",
    icon: Timer,
  },
  {
    title: "Review & export",
    desc: "Understand patterns with reports and export to CSV in seconds.",
    icon: BarChart3,
  },
];

// ✅ New: relevant “Testimonials” section content
const testimonials = [
  {
    name: "Ayesha",
    role: "Freelance Designer",
    quote:
      "Clean UI, no distractions. I finally know where my week goes—and invoicing is faster.",
  },
  {
    name: "Hassan",
    role: "Product Engineer",
    quote:
      "The reports are just right. Simple enough daily, detailed enough for retros.",
  },
  {
    name: "Sara",
    role: "Agency PM",
    quote:
      "Projects + exports makes client billing painless. Offline mode is a huge win.",
  },
];
const faqs = [
  {
    q: "Do I need to create an account?",
    a: "You can try basic tracking without an account, but to unlock full access (Dashboard, project organization, reports, exports, and syncing), you’ll need to log in. Signing up is quick and free.",
  },
  {
    q: "What do I get after logging in?",
    a: "Full access to the app: Dashboard, saved history, projects, detailed reports, CSV export, and (when enabled) syncing across devices.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your data is kept private, and the app is designed to be privacy-first. Basic tracking can work offline using local storage by default.",
  },
  {
    q: "Can I export my time logs?",
    a: "Yes—CSV export is available with full access after you log in, so you can download detailed reports anytime.",
  },
];


export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ✅ Minor: page-wide subtle background accents (no heavy DOM, pure CSS) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-6rem] h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* ✅ Improved: brand mark with ring + hover */}
            <div className="relative">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm ring-1 ring-border/60 transition-transform duration-200 ease-out hover:scale-[1.03]">
                <Timer className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <span className="font-semibold text-lg tracking-tight">
              TimeTrack
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Simple & fast
            </span>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {isAuthenticated ? (
              <Button asChild className="transition-transform active:scale-[0.98]">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="hidden sm:inline-flex focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Link href="/auth/login">Log in</Link>
                </Button>

                {/* ✅ Strong primary: gradient, press feel, glow, focus ring */}
                <Button
                  asChild
                  className="relative overflow-hidden px-5 transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Link href="/auth/signup">
                    <span className="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-primary/70" />
                    <span className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-200 hover:opacity-100 bg-gradient-to-r from-primary/90 to-primary" />
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* ✅ Live colorful background (CSS-only) + flying icon chips */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* colorful wash */}
          <div className="absolute inset-0 hero-rainbow opacity-[0.55]" />
          {/* subtle grid */}
          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />
          {/* big soft blobs */}
          <div className="absolute -top-28 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,.35),rgba(16,185,129,.28),rgba(236,72,153,.28),rgba(59,130,246,.32),rgba(99,102,241,.35))] blur-3xl hero-float-slow" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,.38),transparent_60%)] blur-3xl hero-float" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(250,204,21,.35),transparent_60%)] blur-3xl hero-float-rev" />

          {/* ✅ Flying icon chips (decorative) */}
          <div className="absolute left-[6%] top-[8%] hero-orbit">
            <div className="hero-icon hero-icon-a">
              <Clock className="h-5 w-5 text-white/90" />
            </div>
          </div>
          <div className="absolute right-[8%] top-[22%] hero-orbit2">
            <div className="hero-icon hero-icon-b">
              <BarChart3 className="h-5 w-5 text-white/90" />
            </div>
          </div>
          <div className="absolute left-[14%] bottom-[20%] hero-orbit3">
            <div className="hero-icon hero-icon-c">
              <FolderKanban className="h-5 w-5 text-white/90" />
            </div>
          </div>
          <div className="absolute right-[18%] bottom-[18%] hero-orbit4">
            <div className="hero-icon hero-icon-d">
              <Timer className="h-5 w-5 text-white/90" />
            </div>
          </div>
          <div className="absolute left-1/2 top-[10%] -translate-x-1/2 hero-orbit5 hidden sm:block">
            <div className="hero-icon hero-icon-e">
              <Sparkles className="h-5 w-5 text-white/90" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            {/* ✅ nicer pill + backdrop blur */}
            <div className="inline-flex items-center gap-2 bg-background/60 text-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in shadow-sm ring-1 ring-border/60 backdrop-blur">
              <Clock className="h-4 w-4 text-primary" />
              Simple time tracking for productive people
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Track your time,
              <br />
              {/* ✅ colorful gradient headline */}
              <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
                boost your productivity
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              A beautiful, simple time tracker that helps you understand where your
              hours go. Track projects, generate reports, and export your data.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              {/* ✅ Primary: colorful gradient + hover sheen + press + focus ring */}
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-2xl px-8 transition-transform duration-200 ease-out active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                asChild
              >
                <Link href={isAuthenticated ? "/dashboard" : "/auth/signup"}>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-fuchsia-500 to-emerald-500"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-r from-primary to-primary/70"
                  />
                  {/* sheen */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-white/20 opacity-0 blur-sm transition-all duration-300 ease-out group-hover:translate-x-[180%] group-hover:opacity-100"
                  />
                  <span aria-hidden="true" className="absolute -inset-24 -z-10 opacity-35 blur-2xl bg-primary/30" />
                  Start Tracking
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </Button>

              {/* ✅ Secondary: glassy + hover lift */}
              <Button
                size="lg"
                variant="outline"
                className="group rounded-2xl px-8 bg-background/60 backdrop-blur transition-all duration-200 ease-out hover:bg-muted/50 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                asChild
              >
                <Link href="/auth/login">
                  View Demo
                  <Globe2 className="ml-2 h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:scale-[1.03]" />
                </Link>
              </Button>
            </div>

            {/* Stats strip (kept, improved hover) */}
            <div
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="group rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 text-left shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    {/* ✅ colorful icon bubble */}
                    <div className="h-10 w-10 rounded-xl bg-[linear-gradient(135deg,rgba(99,102,241,.22),rgba(236,72,153,.16),rgba(16,185,129,.16))] flex items-center justify-center ring-1 ring-border/60 transition-transform duration-200 ease-out group-hover:scale-[1.03]">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg font-semibold leading-none">
                        {s.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{s.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Tip: Press <span className="font-medium">Tab</span> to see keyboard focus
              styles.
            </p>
          </div>
        </div>

        {/* ✅ Hero-only CSS (paste-safe, no libs) */}

      </section>


      {/* Features */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple but powerful features to help you track time effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group bg-card/70 backdrop-blur-sm rounded-2xl p-6 border border-border/60 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md animate-fade-in focus-within:ring-2 focus-within:ring-primary/60"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-border/60 transition-transform duration-200 ease-out group-hover:scale-[1.03]">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ New Section 2: How it works (relevant) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                How it works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A quick flow from tracking to insights—no learning curve.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 ring-1 ring-border/60 flex items-center justify-center shrink-0">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Step {i + 1}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span className="text-xs font-medium text-muted-foreground">
                          ~1 min
                        </span>
                      </div>
                      <h3 className="mt-1 font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* subtle corner accent */}
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl"
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                className="group relative overflow-hidden transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                asChild
              >
                <Link href={isAuthenticated ? "/dashboard" : "/auth/signup"}>
                  <span className="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-primary/70" />
                  Try it now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="bg-background/60 hover:bg-muted/50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                asChild
              >
                <Link href="/auth/login">
                  See demo
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                Why TimeTrack?
              </h2>
              <p className="text-muted-foreground">Built for simplicity and efficiency</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, i) => (
                <div
                  key={benefit}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md animate-fade-in"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 ring-1 ring-border/60 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ New Section 3: Testimonials + FAQ (still light DOM) */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            {/* Testimonials */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight mb-3">
                  Loved by focused teams
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  A calm interface that gets out of your way—built for daily use.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {testimonials.map((t, i) => (
                  <figure
                    key={t.name}
                    className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md animate-fade-in"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 ring-1 ring-border/60 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <figcaption className="font-semibold leading-none">
                            {t.name}
                          </figcaption>
                          <div className="text-xs text-muted-foreground mt-1">
                            {t.role}
                          </div>
                        </div>
                      </div>
                    </div>
                    <blockquote className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      “{t.quote}”
                    </blockquote>
                  </figure>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Privacy-first by design.</span>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight mb-3">
                  FAQ
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  Quick answers to help you decide.
                </p>
              </div>

              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <details
                    key={f.q}
                    className="group rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 shadow-sm transition-all duration-200 ease-out hover:shadow-md animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {/* ✅ Accessible: native details/summary */}
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold tracking-tight">
                          {f.q}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-90" />
                      </div>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        {/* ✅ Soft decorative shapes */}
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="absolute -bottom-24 right-[-3rem] h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground/90 ring-1 ring-primary-foreground/15">
            <Zap className="h-4 w-4" />
            Start in seconds • No credit card
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground mb-4 mt-6">
            Ready to get started?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Start tracking your time in seconds. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              className="group relative overflow-hidden transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              asChild
            >
              <Link href={isAuthenticated ? "/dashboard" : "/auth/signup"}>
                <span className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary-foreground/10" />
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              asChild
            >
              <Link href="/auth/login">
                View Demo
                <Globe2 className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-primary-foreground/80">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 ring-1 ring-primary-foreground/15">
              <ShieldCheck className="h-4 w-4" />
              Local storage
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 ring-1 ring-primary-foreground/15">
              <Download className="h-4 w-4" />
              CSV export
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 ring-1 ring-primary-foreground/15">
              <Sparkles className="h-4 w-4" />
              Clean UI
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm ring-1 ring-border/60">
                <Timer className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-foreground leading-none">
                  TimeTrack
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Built with simplicity in mind.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Privacy-first
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1">
                <Download className="h-3.5 w-3.5 text-primary" />
                Export anytime
              </span>
            </div>
          </div>

          <div className="mt-6 text-center text-muted-foreground text-sm">
            <p>© 2026 TimeTrack. Built with simplicity in mind.</p>
          </div>
        </div>
      </footer>
      <style jsx global>{`
    @keyframes rainbowShift {
      0% {
        filter: hue-rotate(0deg);
        transform: translate3d(0, 0, 0) scale(1);
      }
      50% {
        filter: hue-rotate(22deg);
        transform: translate3d(0, -6px, 0) scale(1.02);
      }
      100% {
        filter: hue-rotate(0deg);
        transform: translate3d(0, 0, 0) scale(1);
      }
    }
    .hero-rainbow {
      background: radial-gradient(
          1200px 520px at 50% 10%,
          rgba(99, 102, 241, 0.25),
          transparent 60%
        ),
        radial-gradient(
          900px 520px at 15% 60%,
          rgba(16, 185, 129, 0.22),
          transparent 60%
        ),
        radial-gradient(
          900px 520px at 85% 60%,
          rgba(236, 72, 153, 0.22),
          transparent 60%
        );
      animation: rainbowShift 10s ease-in-out infinite;
    }

    @keyframes floaty {
      0% {
        transform: translate3d(0, 0, 0);
      }
      50% {
        transform: translate3d(0, -10px, 0);
      }
      100% {
        transform: translate3d(0, 0, 0);
      }
    }
    @keyframes floatyRev {
      0% {
        transform: translate3d(0, 0, 0);
      }
      50% {
        transform: translate3d(0, 12px, 0);
      }
      100% {
        transform: translate3d(0, 0, 0);
      }
    }
    .hero-float {
      animation: floaty 8s ease-in-out infinite;
    }
    .hero-float-rev {
      animation: floatyRev 9s ease-in-out infinite;
    }
    .hero-float-slow {
      animation: floaty 12s ease-in-out infinite;
    }

    .hero-icon {
      height: 46px;
      width: 46px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      opacity: 0.9;
    }
    .hero-icon-a {
      background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.85),
        rgba(236, 72, 153, 0.75)
      );
    }
    .hero-icon-b {
      background: linear-gradient(
        135deg,
        rgba(34, 211, 238, 0.8),
        rgba(59, 130, 246, 0.78)
      );
    }
    .hero-icon-c {
      background: linear-gradient(
        135deg,
        rgba(16, 185, 129, 0.78),
        rgba(250, 204, 21, 0.72)
      );
    }
    .hero-icon-d {
      background: linear-gradient(
        135deg,
        rgba(236, 72, 153, 0.8),
        rgba(168, 85, 247, 0.75)
      );
    }
    .hero-icon-e {
      background: linear-gradient(
        135deg,
        rgba(250, 204, 21, 0.78),
        rgba(236, 72, 153, 0.75)
      );
    }

    @keyframes orbit {
      0% {
        transform: translate3d(0, 0, 0) rotate(0deg);
      }
      50% {
        transform: translate3d(0, -10px, 0) rotate(3deg);
      }
      100% {
        transform: translate3d(0, 0, 0) rotate(0deg);
      }
    }
    @keyframes orbit2 {
      0% {
        transform: translate3d(0, 0, 0) rotate(0deg);
      }
      50% {
        transform: translate3d(0, 12px, 0) rotate(-3deg);
      }
      100% {
        transform: translate3d(0, 0, 0) rotate(0deg);
      }
    }
    .hero-orbit {
      animation: orbit 7.2s ease-in-out infinite;
    }
    .hero-orbit2 {
      animation: orbit2 8.2s ease-in-out infinite;
    }
    .hero-orbit3 {
      animation: orbit 9.4s ease-in-out infinite;
    }
    .hero-orbit4 {
      animation: orbit2 10.2s ease-in-out infinite;
    }
    .hero-orbit5 {
      animation: orbit 11.6s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-rainbow,
      .hero-float,
      .hero-float-rev,
      .hero-float-slow,
      .hero-orbit,
      .hero-orbit2,
      .hero-orbit3,
      .hero-orbit4,
      .hero-orbit5 {
        animation: none !important;
      }
    }

     @media (prefers-reduced-motion: reduce) {
          .animate-fade-in {
            animation: none !important;
          }
        }
  `}</style>

    </div>
  );
}
