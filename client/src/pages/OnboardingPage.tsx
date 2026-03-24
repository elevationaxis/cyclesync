import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { UserProfile } from "@shared/schema";

// Transparent logo watermark
function LogoWatermark({ size = 200, opacity = 0.08, className = "" }: { size?: number; opacity?: number; className?: string }) {
  return (
    <img
      src="/logo-mark.png"
      alt=""
      width={size}
      height={size}
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity, objectFit: 'contain' }}
    />
  );
}

const BLUSH = "#E8B4A0";
const SAGE = "#7A9E7E";
const CREAM = "#F7F2EB";
const BLACK = "#0D0B0A";
const CREAM_MUTED = "#c4b29a";
const CREAM_DIM = "#8a7d74";

const intakeQuestions = [
  {
    id: "adhd",
    question: "Does your brain feel like it runs on a different operating system than everyone else's?",
    subtext: "Hyperfocus one minute, can't remember what you walked into the room for the next.",
    tag: "ADHD / Executive Function"
  },
  {
    id: "pmdd",
    question: "Does your luteal phase feel less like PMS and more like a personality transplant?",
    subtext: "Like the week before your period, someone else moves in and you just have to wait it out.",
    tag: "PMDD / Luteal Intensity"
  },
  {
    id: "perimenopause",
    question: "Has your cycle started doing things it never used to?",
    subtext: "Irregular, more intense, unpredictable — like your body changed the rules without telling you.",
    tag: "Perimenopause / Hormonal Shifts"
  },
  {
    id: "spoons",
    question: "Do you track your energy in terms of what you have left, not what you planned?",
    subtext: "Some days you wake up already at half capacity. You know the math before the day starts.",
    tag: "Spoon Theory / Chronic Energy"
  },
];

const noPeriodReasons = [
  {
    id: "hysterectomy",
    label: "Hysterectomy",
    subtext: "Surgical removal of uterus — with or without ovaries",
    emoji: "🌿"
  },
  {
    id: "menopause",
    label: "Menopause",
    subtext: "Periods have stopped for 12+ months",
    emoji: "🌙"
  },
  {
    id: "perimenopause",
    label: "Perimenopause",
    subtext: "Cycles are irregular or changing — the in-between",
    emoji: "🌊"
  },
  {
    id: "pcos",
    label: "PCOS or other condition",
    subtext: "Polycystic ovary syndrome or another reason periods are absent",
    emoji: "🌸"
  },
  {
    id: "birth_control",
    label: "Hormonal birth control",
    subtext: "IUD, implant, injection, or pill that stopped your period",
    emoji: "💊"
  },
  {
    id: "other",
    label: "Something else",
    subtext: "My situation is different — I'll tell Aunt B more later",
    emoji: "✨"
  },
];

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    lastPeriodStart: "",
    cycleLength: 28,
    concerns: "",
    cycleStatus: "cycling" as "cycling" | "no_period",
    cycleReason: "" as string,
    age: "" as string,
    relationshipStatus: "" as string,
    partnerWillingness: "" as string,
  });
  const [intakeAnswers, setIntakeAnswers] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 6 — optional account creation
  const [accountData, setAccountData] = useState({ username: "", password: "", confirmPassword: "" });
  const [createdProfileId, setCreatedProfileId] = useState<string | null>(null);

  const createProfile = useMutation({
    mutationFn: async (data: typeof formData) => {
      const intakeTags = Object.entries(intakeAnswers)
        .filter(([, val]) => val)
        .map(([key]) => intakeQuestions.find(q => q.id === key)?.tag)
        .filter(Boolean)
        .join(", ");
      const fullConcerns = [intakeTags, data.concerns].filter(Boolean).join(" | ");

      const payload: Record<string, unknown> = {
        name: data.name,
        cycleLength: data.cycleLength,
        concerns: fullConcerns || null,
        cycleStatus: data.cycleStatus,
        cycleReason: data.cycleReason || null,
        age: data.age ? parseInt(data.age) : null,
        relationshipStatus: data.relationshipStatus || null,
        partnerWillingness: data.partnerWillingness || null,
      };

      if (data.cycleStatus === "cycling" && data.lastPeriodStart) {
        payload.lastPeriodStart = data.lastPeriodStart;
      }

      const response = await apiRequest("POST", "/api/profile", payload);
      return response.json() as Promise<UserProfile>;
    },
    onSuccess: (profile) => {
      localStorage.setItem("cycleSync_hasStarted", "true");
      localStorage.setItem("cycleSync_profileId", profile.id);
      localStorage.setItem("cycleSync_userName", profile.name);
      setCreatedProfileId(profile.id);
      setStep(6); // Go to account creation step
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    }
  });

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Please tell me your name, love";
      }
    }

    if (currentStep === 2 && formData.cycleStatus === "cycling") {
      if (!formData.lastPeriodStart) {
        newErrors.lastPeriodStart = "I need this to track your cycle accurately";
      } else {
        const selectedDate = new Date(formData.lastPeriodStart);
        const today = new Date();
        if (selectedDate > today) {
          newErrors.lastPeriodStart = "That date is in the future, love";
        }
      }
    }

    if (currentStep === 2.5 && formData.cycleStatus === "no_period") {
      if (!formData.cycleReason) {
        newErrors.cycleReason = "Help Aunt B understand your situation";
      }
    }

    if (currentStep === 3 && formData.cycleStatus === "cycling") {
      if (formData.cycleLength < 20 || formData.cycleLength > 45) {
        newErrors.cycleLength = "Typical cycles are between 20-45 days";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep(1)) setStep(15); // step 15 = age + relationship (between 1 and 2)
    } else if (step === 15) {
      setStep(2); // age/relationship is optional, always advance
    } else if (step === 2) {
      if (formData.cycleStatus === "cycling") {
        if (validateStep(2)) setStep(3);
      } else {
        // no_period — go to why quiz (step 2.5 represented as step 25)
        setStep(25);
      }
    } else if (step === 25) {
      if (!formData.cycleReason) {
        setErrors({ cycleReason: "Help Aunt B understand your situation" });
        return;
      }
      setErrors({});
      setStep(35); // spoon theory explainer before the intake gate
    } else if (step === 3) {
      if (validateStep(3)) setStep(35); // 35 = spoon theory explainer
    } else if (step === 35) {
      setStep(4); // spoon explainer always advances
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      createProfile.mutate(formData);
    } else if (step === 6) {
      handleCreateAccount();
    }
  };

  const handleBack = () => {
    if (step === 15) setStep(1);
    else if (step === 2) setStep(15);
    else if (step === 25) setStep(2);
    else if (step === 3) setStep(2);
    else if (step === 35) {
      if (formData.cycleStatus === "no_period") setStep(25);
      else setStep(3);
    }
    else if (step === 4) setStep(35);
    else if (step === 5) setStep(4);
    else if (step === 6) setStep(5);
    setErrors({});
  };

  const handleSkipIntake = () => {
    createProfile.mutate(formData);
  };

  const handleCreateAccount = async () => {
    const newErrors: Record<string, string> = {};
    if (!accountData.username.trim()) newErrors.username = "Choose a username, love";
    if (accountData.password.length < 6) newErrors.password = "At least 6 characters";
    if (accountData.password !== accountData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: accountData.username, password: accountData.password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrors({ username: data.error || "Username already taken" });
        return;
      }
      const user = await res.json();
      // Link the profile to the new account
      if (createdProfileId) {
        await fetch(`/api/profile/${createdProfileId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: user.id }),
        });
      }
      setLocation("/dashboard");
    } catch {
      setErrors({ username: "Something went wrong. Please try again." });
    }
  };

  const handleSkipAccount = () => {
    setLocation("/dashboard");
  };

  const progressStep = step <= 3 ? step : step === 25 ? 2 : 3;
  const progressDots = [1, 2, 3].map((num) => (
    <div
      key={num}
      className="w-2 h-2 rounded-full transition-all duration-300"
      style={{
        background: num === Math.min(progressStep, 3) ? BLUSH : num < Math.min(progressStep, 3) ? SAGE : "rgba(247,242,235,0.2)"
      }}
    />
  ));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: BLACK, color: CREAM }}>

      {/* Background watermarks */}
      <div className="absolute top-[-40px] right-[-40px]">
        <LogoWatermark size={280} opacity={0.05} />
      </div>
      <div className="absolute bottom-[-60px] left-[-60px]">
        <LogoWatermark size={320} opacity={0.04} />
      </div>
      <div className="absolute top-[40%] left-[5%]">
        <LogoWatermark size={120} opacity={0.03} />
      </div>

      <div className="relative container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-md mx-auto">

          {/* Logo + progress */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <img src="/logo-mark.png" alt="Cync" width={28} height={28} style={{ objectFit: 'contain' }} />
              <span className="font-display text-lg" style={{ color: CREAM }}>Cync</span>
            </div>
            {step <= 3 && (
              <div className="flex justify-center gap-2">
                {progressDots}
              </div>
            )}
          </div>

          {/* Step 1 — Name */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="font-display text-3xl font-normal mb-3" style={{ color: CREAM }}>
                  Hey sis, I'm Aunt B.
                </h2>
                <p style={{ color: CREAM_MUTED }}>
                  Let's get to know each other a little.
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium" style={{ color: CREAM_MUTED }}>
                  What should I call you?
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-lg py-6 border-0 rounded-xl"
                  style={{ background: "rgba(247,242,235,0.07)", color: CREAM }}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                />
                {errors.name && <p className="text-sm" style={{ color: "#e87070" }}>{errors.name}</p>}
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-center" style={{ color: 'rgba(247,242,235,0.35)', lineHeight: '1.5' }}>
                Cync and Aunt B are for informational and wellness purposes only — not medical advice. Always consult a qualified healthcare provider before making changes to your health routine.
              </p>

              <Button
                onClick={handleNext}
                className="w-full py-6 text-base font-semibold rounded-xl"
                style={{ background: BLUSH, color: BLACK }}
              >
                I understand — let's go
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 1.5 — Age + relationship (optional, skippable) */}
          {step === 15 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="font-display text-3xl font-normal mb-3" style={{ color: CREAM }}>
                  Nice to meet you, {formData.name}.
                </h2>
                <p style={{ color: CREAM_MUTED }}>
                  A little more context helps Aunt B give better guidance. All optional.
                </p>
              </div>

              {/* Age */}
              <div className="space-y-3">
                <Label className="text-sm font-medium" style={{ color: CREAM_MUTED }}>How old are you?</Label>
                <Input
                  type="number"
                  placeholder="Your age"
                  min={13}
                  max={99}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="text-lg py-6 border-0 rounded-xl"
                  style={{ background: "rgba(247,242,235,0.07)", color: CREAM }}
                />
              </div>

              {/* Relationship status */}
              <div className="space-y-3">
                <Label className="text-sm font-medium" style={{ color: CREAM_MUTED }}>Relationship status?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "single", label: "Single" },
                    { id: "partnered", label: "In a relationship" },
                    { id: "married", label: "Married" },
                    { id: "complicated", label: "It's complicated" },
                    { id: "prefer_not_to_say", label: "Prefer not to say" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, relationshipStatus: formData.relationshipStatus === opt.id ? "" : opt.id })}
                      className="text-sm py-3 px-4 rounded-xl text-left transition-all"
                      style={{
                        background: formData.relationshipStatus === opt.id ? `${BLUSH}18` : "rgba(247,242,235,0.04)",
                        border: `1px solid ${formData.relationshipStatus === opt.id ? BLUSH + "60" : "rgba(247,242,235,0.1)"}`,
                        color: formData.relationshipStatus === opt.id ? CREAM : CREAM_MUTED,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Partner willingness — only if partnered/married */}
              {(formData.relationshipStatus === "partnered" || formData.relationshipStatus === "married") && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium" style={{ color: CREAM_MUTED }}>Is your partner open to learning about your cycle?</Label>
                  <div className="space-y-2">
                    {[
                      { id: "open", label: "Yes, very open", sub: "They want to understand and support me" },
                      { id: "learning", label: "Getting there", sub: "Still learning but trying" },
                      { id: "not_involved", label: "Not really", sub: "They're not involved in this" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setFormData({ ...formData, partnerWillingness: formData.partnerWillingness === opt.id ? "" : opt.id })}
                        className="w-full text-left p-3 rounded-xl transition-all"
                        style={{
                          background: formData.partnerWillingness === opt.id ? `${BLUSH}18` : "rgba(247,242,235,0.04)",
                          border: `1px solid ${formData.partnerWillingness === opt.id ? BLUSH + "60" : "rgba(247,242,235,0.1)"}`,
                        }}
                      >
                        <p className="text-sm font-medium" style={{ color: CREAM }}>{opt.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(247,242,235,0.45)" }}>{opt.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="px-4 py-6 rounded-xl"
                  style={{ color: CREAM_MUTED }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 py-6 text-base font-semibold rounded-xl"
                  style={{ background: BLUSH, color: BLACK }}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <p className="text-center text-xs" style={{ color: "rgba(247,242,235,0.25)" }}>
                Skip anything you'd rather not share — Aunt B won't judge.
              </p>
            </div>
          )}

          {/* Step 2 — Last period (cycling path) */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="font-display text-3xl font-normal mb-3" style={{ color: CREAM }}>
                  Hey {formData.name}.
                </h2>
                <p style={{ color: CREAM_MUTED }}>
                  Let's figure out where you are in your cycle right now.
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="lastPeriod" className="text-sm font-medium flex items-center gap-2" style={{ color: CREAM_MUTED }}>
                  <Calendar className="w-4 h-4" />
                  When did your last period start?
                </Label>
                <Input
                  id="lastPeriod"
                  type="date"
                  value={formData.lastPeriodStart}
                  onChange={(e) => setFormData({ ...formData, lastPeriodStart: e.target.value, cycleStatus: "cycling" })}
                  max={new Date().toISOString().split("T")[0]}
                  className="text-lg py-6 border-0 rounded-xl"
                  style={{ background: "rgba(247,242,235,0.07)", color: CREAM, colorScheme: "dark" }}
                />
                {errors.lastPeriodStart && <p className="text-sm" style={{ color: "#e87070" }}>{errors.lastPeriodStart}</p>}
                <p className="text-sm" style={{ color: "rgba(247,242,235,0.4)" }}>
                  Best guess is fine, love. We'll refine it as we go.
                </p>
              </div>

              {/* No period option */}
              <button
                onClick={() => {
                  setFormData({ ...formData, cycleStatus: "no_period", lastPeriodStart: "" });
                  setStep(25);
                }}
                className="w-full text-left p-4 rounded-xl transition-all duration-200"
                style={{
                  background: "rgba(247,242,235,0.04)",
                  border: "1px solid rgba(247,242,235,0.12)"
                }}
              >
                <p className="text-sm font-medium" style={{ color: CREAM_MUTED }}>
                  I don't have those anymore
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(247,242,235,0.35)" }}>
                  Hysterectomy, menopause, perimenopause, or something else
                </p>
              </button>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="px-4 py-6 rounded-xl"
                  style={{ color: CREAM_MUTED }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 py-6 text-base font-semibold rounded-xl"
                  style={{ background: BLUSH, color: BLACK }}
                >
                  Got it
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2.5 — No period: why quiz */}
          {step === 25 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-display text-2xl font-normal mb-3" style={{ color: CREAM }}>
                  Got it, {formData.name}.
                </h2>
                <p style={{ color: CREAM_MUTED }}>
                  Help Aunt B understand your body better. What's your situation?
                </p>
              </div>

              <div className="space-y-3">
                {noPeriodReasons.map((reason) => {
                  const selected = formData.cycleReason === reason.id;
                  return (
                    <button
                      key={reason.id}
                      onClick={() => {
                        setFormData({ ...formData, cycleReason: reason.id });
                        setErrors({});
                      }}
                      className="w-full text-left p-4 rounded-xl transition-all duration-200"
                      style={{
                        background: selected ? `${BLUSH}18` : "rgba(247,242,235,0.04)",
                        border: `1px solid ${selected ? BLUSH + "60" : "rgba(247,242,235,0.1)"}`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{reason.emoji}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: CREAM }}>{reason.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: "rgba(247,242,235,0.45)" }}>{reason.subtext}</p>
                        </div>
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{
                            background: selected ? BLUSH : "transparent",
                            border: `1.5px solid ${selected ? BLUSH : "rgba(247,242,235,0.3)"}`,
                          }}
                        >
                          {selected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke={BLACK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.cycleReason && <p className="text-sm" style={{ color: "#e87070" }}>{errors.cycleReason}</p>}

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="px-4 py-6 rounded-xl"
                  style={{ color: CREAM_MUTED }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!formData.cycleReason}
                  className="flex-1 py-6 text-base font-semibold rounded-xl"
                  style={{ background: BLUSH, color: BLACK, opacity: formData.cycleReason ? 1 : 0.5 }}
                >
                  That's me
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Cycle length (cycling users only) */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="font-display text-3xl font-normal mb-3" style={{ color: CREAM }}>
                  Almost there.
                </h2>
                <p style={{ color: CREAM_MUTED }}>
                  How long is your typical cycle?
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-6">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, cycleLength: Math.max(20, formData.cycleLength - 1) })}
                    className="w-12 h-12 rounded-full border-0 text-xl"
                    style={{ background: "rgba(247,242,235,0.07)", color: CREAM }}
                  >
                    −
                  </Button>
                  <div className="text-center">
                    <div className="font-display text-6xl font-normal" style={{ color: BLUSH }}>
                      {formData.cycleLength}
                    </div>
                    <div className="text-sm mt-1" style={{ color: CREAM_MUTED }}>days</div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, cycleLength: Math.min(45, formData.cycleLength + 1) })}
                    className="w-12 h-12 rounded-full border-0 text-xl"
                    style={{ background: "rgba(247,242,235,0.07)", color: CREAM }}
                  >
                    +
                  </Button>
                </div>
                {errors.cycleLength && <p className="text-sm text-center" style={{ color: "#e87070" }}>{errors.cycleLength}</p>}
                <p className="text-sm text-center" style={{ color: "rgba(247,242,235,0.4)" }}>
                  Average is 28 days — but your body doesn't have to be average.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="px-4 py-6 rounded-xl"
                  style={{ color: CREAM_MUTED }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 py-6 text-base font-semibold rounded-xl"
                  style={{ background: BLUSH, color: BLACK }}
                >
                  That's me
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3.5 — Spoon theory explainer */}
          {step === 35 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-5xl mb-5">🥄</div>
                <h2 className="font-display text-3xl font-normal mb-4" style={{ color: CREAM }}>
                  A quick thing about spoons.
                </h2>
              </div>

              <div
                className="rounded-2xl p-6 space-y-4"
                style={{ background: "rgba(247,242,235,0.05)", border: "1px solid rgba(247,242,235,0.1)" }}
              >
                <p className="text-base leading-relaxed" style={{ color: CREAM_MUTED }}>
                  <strong style={{ color: CREAM }}>Spoon theory</strong> is a way of talking about energy — especially when you don't have a lot of it.
                </p>
                <p className="text-base leading-relaxed" style={{ color: CREAM_MUTED }}>
                  The idea: imagine you start each day with a certain number of spoons. Every task — getting dressed, making a call, going to the store — costs one. When they're gone, they're gone.
                </p>
                <p className="text-base leading-relaxed" style={{ color: CREAM_MUTED }}>
                  In Cync, you'll use spoons to tell us how much energy you actually have today. Aunt B uses that to adjust what she suggests — so she's never asking you to do more than you've got.
                </p>
              </div>

              <div
                className="rounded-xl p-4 text-center"
                style={{ background: `${BLUSH}12`, border: `1px solid ${BLUSH}30` }}
              >
                <p className="text-sm" style={{ color: BLUSH }}>
                  "Don't have the spoons?" = you're running low today. No explanation needed.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="px-4 py-6 rounded-xl"
                  style={{ color: CREAM_MUTED }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 py-6 text-base font-semibold rounded-xl"
                  style={{ background: BLUSH, color: BLACK }}
                >
                  Got it
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4 — Spoon gate for optional intake */}
          {step === 4 && (
            <div className="space-y-8 text-center">
              <div>
                <div className="text-4xl mb-4">🥄</div>
                <h2 className="font-display text-3xl font-normal mb-4" style={{ color: CREAM }}>
                  One last thing.
                </h2>
                <p className="text-lg leading-relaxed mb-2" style={{ color: CREAM_MUTED }}>
                  If you want Aunt B to <em>really</em> know you, answer a few questions.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "rgba(247,242,235,0.5)" }}>
                  Only if you have enough spoons. If not, do it later — she'll still be here.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleNext}
                  className="w-full py-6 text-base font-semibold rounded-xl"
                  style={{ background: BLUSH, color: BLACK }}
                >
                  I have spoons, let's go
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSkipIntake}
                  disabled={createProfile.isPending}
                  className="w-full py-6 text-base rounded-xl"
                  style={{ color: CREAM_MUTED, border: "1px solid rgba(247,242,235,0.1)" }}
                >
                  {createProfile.isPending ? "Setting things up..." : "Save my spoons, skip for now"}
                </Button>
              </div>

              {errors.submit && <p className="text-sm" style={{ color: "#e87070" }}>{errors.submit}</p>}
            </div>
          )}

          {/* Step 5 — Optional intake quiz */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-display text-2xl font-normal mb-2" style={{ color: CREAM }}>
                  Does any of this sound familiar?
                </h2>
                <p className="text-sm" style={{ color: CREAM_MUTED }}>
                  Select everything that resonates. No wrong answers.
                </p>
              </div>

              <div className="space-y-3">
                {intakeQuestions.map((q) => {
                  const selected = intakeAnswers[q.id] === true;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setIntakeAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="w-full text-left p-5 rounded-2xl transition-all duration-200"
                      style={{
                        background: selected ? `${BLUSH}18` : "rgba(247,242,235,0.04)",
                        border: `1px solid ${selected ? BLUSH + "60" : "rgba(247,242,235,0.1)"}`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                          style={{
                            background: selected ? BLUSH : "transparent",
                            border: `1.5px solid ${selected ? BLUSH : "rgba(247,242,235,0.3)"}`,
                          }}
                        >
                          {selected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke={BLACK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-snug mb-1" style={{ color: CREAM }}>
                            {q.question}
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,235,0.45)" }}>
                            {q.subtext}
                          </p>
                          <span
                            className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full"
                            style={{ background: selected ? `${SAGE}30` : "rgba(247,242,235,0.06)", color: selected ? SAGE : "rgba(247,242,235,0.35)" }}
                          >
                            {q.tag}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setStep(4)}
                  className="px-4 py-6 rounded-xl"
                  style={{ color: CREAM_MUTED }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => createProfile.mutate(formData)}
                  disabled={createProfile.isPending}
                  className="flex-1 py-6 text-base font-semibold rounded-xl"
                  style={{ background: BLUSH, color: BLACK }}
                >
                  {createProfile.isPending ? "Setting things up..." : "Take me in, Aunt B"}
                </Button>
              </div>

              {errors.submit && <p className="text-sm text-center" style={{ color: "#e87070" }}>{errors.submit}</p>}
            </div>
          )}

          {/* Step 6 — Save your progress (optional account creation) */}
          {step === 6 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🔐</div>
                <h2 className="font-display text-2xl md:text-3xl font-normal mb-3" style={{ color: CREAM }}>
                  Save your progress
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: CREAM_MUTED }}>
                  Create an account so you can come back to your data anytime — from any device.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium tracking-wide uppercase mb-2 block" style={{ color: CREAM_DIM }}>
                    Choose a username
                  </label>
                  <input
                    type="text"
                    value={accountData.username}
                    onChange={e => setAccountData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="something you'll remember"
                    autoComplete="username"
                    className="w-full bg-transparent border-0 border-b py-3 text-base outline-none"
                    style={{
                      borderBottom: `1px solid ${errors.username ? '#e87070' : 'rgba(247,242,235,0.2)'}`,
                      color: CREAM,
                      caretColor: BLUSH,
                    }}
                  />
                  {errors.username && <p className="text-xs mt-1" style={{ color: "#e87070" }}>{errors.username}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium tracking-wide uppercase mb-2 block" style={{ color: CREAM_DIM }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={accountData.password}
                    onChange={e => setAccountData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="at least 6 characters"
                    autoComplete="new-password"
                    className="w-full bg-transparent border-0 border-b py-3 text-base outline-none"
                    style={{
                      borderBottom: `1px solid ${errors.password ? '#e87070' : 'rgba(247,242,235,0.2)'}`,
                      color: CREAM,
                      caretColor: BLUSH,
                    }}
                  />
                  {errors.password && <p className="text-xs mt-1" style={{ color: "#e87070" }}>{errors.password}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium tracking-wide uppercase mb-2 block" style={{ color: CREAM_DIM }}>
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={accountData.confirmPassword}
                    onChange={e => setAccountData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full bg-transparent border-0 border-b py-3 text-base outline-none"
                    style={{
                      borderBottom: `1px solid ${errors.confirmPassword ? '#e87070' : 'rgba(247,242,235,0.2)'}`,
                      color: CREAM,
                      caretColor: BLUSH,
                    }}
                  />
                  {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: "#e87070" }}>{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCreateAccount}
                  className="w-full py-6 text-base font-semibold rounded-xl"
                  style={{ background: BLUSH, color: BLACK }}
                >
                  Save my progress
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSkipAccount}
                  className="w-full py-4 text-sm rounded-xl"
                  style={{ color: CREAM_DIM }}
                >
                  Skip for now — I'll come back as a guest
                </Button>
              </div>

              <p className="text-center text-xs" style={{ color: "rgba(247,242,235,0.25)" }}>
                No email required. Just a username and password.
              </p>
            </div>
          )}

          {(step === 1 || step === 2 || step === 3) && (
            <p className="text-center text-xs mt-8" style={{ color: "rgba(247,242,235,0.3)" }}>
              You can always update this later in settings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
