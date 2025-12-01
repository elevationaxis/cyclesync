import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Coffee, HandHeart, Sparkles, CheckCircle, Clock, Send, Users, Utensils, Battery, BatteryLow, BatteryMedium, BatteryFull, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CareRequest, SpoonEntry } from "@shared/schema";

const careTypes = [
  { 
    type: "snack", 
    label: "Snack Run", 
    icon: Coffee, 
    description: "Bring me something yummy",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    borderColor: "border-amber-200 dark:border-amber-800"
  },
  { 
    type: "touch", 
    label: "Physical Touch", 
    icon: Heart, 
    description: "Cuddles or massage please",
    gradient: "from-pink-500 to-rose-600",
    bgGradient: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
    borderColor: "border-pink-200 dark:border-pink-800"
  },
  { 
    type: "chill", 
    label: "Quiet Time", 
    icon: Sparkles, 
    description: "I need some space to rest",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
    borderColor: "border-violet-200 dark:border-violet-800"
  },
  { 
    type: "encouragement", 
    label: "Encouragement", 
    icon: HandHeart, 
    description: "Kind words appreciated",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800"
  },
];

export default function PartnerSupportPage() {
  const { toast } = useToast();
  const userId = "demo-user";

  const { data: requests = [], isLoading } = useQuery<CareRequest[]>({
    queryKey: ["/api/care-requests", userId],
    queryFn: async () => {
      const response = await fetch(`/api/care-requests?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch care requests");
      return response.json();
    },
  });

  const { data: spoonEntry } = useQuery<SpoonEntry | null>({
    queryKey: ["/api/spoon-entries/today", userId],
    queryFn: async () => {
      const response = await fetch(`/api/spoon-entries/today?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch spoon entry");
      return response.json();
    },
  });

  const getSpoonStatus = () => {
    if (!spoonEntry) return null;
    const remaining = spoonEntry.totalSpoons - spoonEntry.usedSpoons;
    const percentage = (remaining / spoonEntry.totalSpoons) * 100;
    
    if (percentage >= 70) return { 
      label: "Plenty of energy", 
      description: "They have good energy today",
      icon: BatteryFull, 
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800"
    };
    if (percentage >= 40) return { 
      label: "Moderate energy", 
      description: "Managing energy carefully today",
      icon: BatteryMedium, 
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
      borderColor: "border-amber-200 dark:border-amber-800"
    };
    if (percentage >= 15) return { 
      label: "Running low", 
      description: "Energy is limited - extra support helps",
      icon: BatteryLow, 
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      borderColor: "border-orange-200 dark:border-orange-800"
    };
    return { 
      label: "Recharge needed", 
      description: "Very low energy - be gentle and take over tasks",
      icon: Battery, 
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
      borderColor: "border-rose-200 dark:border-rose-800"
    };
  };

  const spoonStatus = getSpoonStatus();

  const createRequest = useMutation({
    mutationFn: async (type: string) => {
      return await apiRequest("POST", "/api/care-requests", {
        type,
        status: "pending",
        userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/care-requests"] });
      toast({
        title: "Care request sent",
        description: "Your partner has been notified",
      });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/care-requests/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/care-requests"] });
      toast({
        title: "Request updated",
        description: "Status has been changed",
      });
    },
  });

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const completedRequests = requests.filter((r) => r.status === "completed");

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 mb-4">
          <Users className="w-8 h-8 text-pink-600 dark:text-pink-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Partner Support
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Let your partner know what you need today with just one tap
        </p>
      </div>

      <div className="space-y-8">
        {spoonEntry && spoonStatus && (
          <Card className={`border-2 ${spoonStatus.borderColor} bg-gradient-to-br ${spoonStatus.bgColor}`} data-testid="card-spoon-status">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-background/80 flex items-center justify-center shadow-sm`}>
                  <spoonStatus.icon className={`w-7 h-7 ${spoonStatus.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-lg font-semibold ${spoonStatus.color}`}>{spoonStatus.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {spoonEntry.totalSpoons - spoonEntry.usedSpoons} / {spoonEntry.totalSpoons} spoons
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{spoonStatus.description}</p>
                  {spoonEntry.note && (
                    <p className="text-xs text-muted-foreground mt-1 italic">"{spoonEntry.note}"</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: spoonEntry.totalSpoons }).map((_, i) => {
                    const isUsed = i < spoonEntry.usedSpoons;
                    return (
                      <Utensils
                        key={i}
                        className={`w-4 h-4 ${isUsed ? 'text-muted-foreground/30' : 'text-orange-500'}`}
                      />
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-2 overflow-visible">
          <CardHeader className="text-center pb-2">
            <CardTitle className="flex items-center justify-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Quick Care Requests
            </CardTitle>
            <CardDescription className="text-base">
              Choose what kind of support would feel best right now
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {careTypes.map((care) => {
                const Icon = care.icon;
                return (
                  <button
                    key={care.type}
                    onClick={() => createRequest.mutate(care.type)}
                    disabled={createRequest.isPending}
                    className={`relative group p-5 rounded-xl border-2 ${care.borderColor} bg-gradient-to-br ${care.bgGradient} text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-visible`}
                    data-testid={`button-request-${care.type}`}
                  >
                    <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${care.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-6 mt-2">
                      <span className="font-semibold text-lg block mb-1">{care.label}</span>
                      <p className="text-sm text-muted-foreground">
                        {care.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {pendingRequests.length > 0 && (
          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pending Requests</CardTitle>
                  <CardDescription>Waiting for your partner</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.map((request) => {
                const careType = careTypes.find((c) => c.type === request.type);
                const Icon = careType?.icon || Clock;
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border rounded-xl shadow-sm"
                    data-testid={`pending-request-${request.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${careType?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{careType?.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.createdAt!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatus.mutate({ id: request.id, status: "completed" })
                      }
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      data-testid={`button-complete-${request.id}`}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Done
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {completedRequests.length > 0 && (
          <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Completed</CardTitle>
                  <CardDescription>Thank you, partner!</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {completedRequests.slice(0, 5).map((request) => {
                  const careType = careTypes.find((c) => c.type === request.type);
                  const Icon = careType?.icon || CheckCircle;
                  return (
                    <div
                      key={request.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
                      data-testid={`completed-request-${request.id}`}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium flex-1">{careType?.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {requests.length === 0 && !isLoading && (
          <Card className="border-dashed border-2">
            <CardContent className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg mb-2">
                No care requests yet
              </p>
              <p className="text-sm text-muted-foreground">
                Tap a button above to let your partner know what you need
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
