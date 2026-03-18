import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowRight, ArrowLeft, Calendar, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { UserProfile } from "@shared/schema";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    lastPeriodStart: "",
    cycleLength: 28,
    concerns: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createProfile = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/profile", {
        name: data.name,
        lastPeriodStart: data.lastPeriodStart,
        cycleLength: data.cycleLength,
        concerns: data.concerns || null
      });
      return response.json() as Promise<UserProfile>;
    },
    onSuccess: (profile) => {
      localStorage.setItem("cycleSync_hasStarted", "true");
      localStorage.setItem("cycleSync_profileId", profile.id);
      localStorage.setItem("cycleSync_userName", profile.name);
      setLocation("/dashboard");
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

    if (currentStep === 2) {
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

    if (currentStep === 3) {
      if (formData.cycleLength < 20 || formData.cycleLength > 45) {
        newErrors.cycleLength = "Typical cycles are between 20-45 days";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        createProfile.mutate(formData);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const progressDots = [1, 2, 3, 4].map((num) => (
    <div
      key={num}
      className={`w-2.5 h-2.5 rounded-full transition-colors ${
        num === step
          ? "bg-primary"
          : num < step
          ? "bg-[hsl(var(--brand-copper))]"
          : "bg-muted"
      }`}
    />
  ));

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand-lavender))] via-background to-[hsl(var(--brand-lavender)/0.3)]" />
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[hsl(var(--brand-lavender)/0.2)] blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[hsl(var(--brand-rose)/0.15)] blur-3xl" />

      <div className="relative container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--brand-lavender))] mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div className="flex justify-center gap-2 mb-4">
              {progressDots}
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">
                      Hey there, sugar!
                    </h2>
                    <p className="text-muted-foreground">
                      I'm Aunt B. Let's get to know each other a little.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">
                      What should I call you?
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="text-lg py-6"
                      data-testid="input-name"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">
                      Perfect, {formData.name}!
                    </h2>
                    <p className="text-muted-foreground">
                      Now let's figure out where you are in your cycle.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastPeriod" className="text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      When did your last period start?
                    </Label>
                    <Input
                      id="lastPeriod"
                      type="date"
                      value={formData.lastPeriodStart}
                      onChange={(e) =>
                        setFormData({ ...formData, lastPeriodStart: e.target.value })
                      }
                      max={new Date().toISOString().split("T")[0]}
                      className="text-lg py-6"
                      data-testid="input-last-period"
                    />
                    {errors.lastPeriodStart && (
                      <p className="text-sm text-destructive">
                        {errors.lastPeriodStart}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      Don't worry if you're not sure — your best guess works!
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">
                      Almost there!
                    </h2>
                    <p className="text-muted-foreground">
                      How long is your typical cycle?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="cycleLength" className="text-base">
                      Average cycle length (in days)
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            cycleLength: Math.max(20, formData.cycleLength - 1)
                          })
                        }
                        data-testid="button-decrease-cycle"
                      >
                        -
                      </Button>
                      <Input
                        id="cycleLength"
                        type="number"
                        min={20}
                        max={45}
                        value={formData.cycleLength}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cycleLength: parseInt(e.target.value) || 28
                          })
                        }
                        className="text-center text-2xl font-semibold py-6 w-24"
                        data-testid="input-cycle-length"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            cycleLength: Math.min(45, formData.cycleLength + 1)
                          })
                        }
                        data-testid="button-increase-cycle"
                      >
                        +
                      </Button>
                    </div>
                    {errors.cycleLength && (
                      <p className="text-sm text-destructive">
                        {errors.cycleLength}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground text-center">
                      The average is 28 days, but everyone's different!
                    </p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--brand-lavender))] mb-4">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">
                      One more thing...
                    </h2>
                    <p className="text-muted-foreground">
                      Anything specific you want help with? (totally optional)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="e.g., managing PMS symptoms, understanding my moods, planning around my cycle..."
                      value={formData.concerns}
                      onChange={(e) =>
                        setFormData({ ...formData, concerns: e.target.value })
                      }
                      className="min-h-[120px] resize-none"
                      data-testid="input-concerns"
                    />
                    <p className="text-sm text-muted-foreground">
                      This helps Aunt B give you more personalized support.
                    </p>
                  </div>
                </div>
              )}

              {errors.submit && (
                <p className="text-sm text-destructive text-center mt-4">
                  {errors.submit}
                </p>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={createProfile.isPending}
                  className="bg-primary text-primary-foreground"
                  data-testid="button-next"
                >
                  {createProfile.isPending ? (
                    "Setting things up..."
                  ) : step === 4 ? (
                    <>
                      Let's Go!
                      <Heart className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            You can always update this later in settings
          </p>
        </div>
      </div>
    </div>
  );
}
