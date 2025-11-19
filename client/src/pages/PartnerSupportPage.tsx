import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Coffee, HandHeart, Sparkles, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CareRequest } from "@shared/schema";

const careTypes = [
  { type: "snack", label: "Snack Run", icon: Coffee, description: "Bring me something yummy" },
  { type: "touch", label: "Physical Touch", icon: Heart, description: "Cuddles or massage please" },
  { type: "chill", label: "Quiet Time", icon: Sparkles, description: "I need some space to rest" },
  { type: "encouragement", label: "Encouragement", icon: HandHeart, description: "Kind words appreciated" },
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
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Partner Support</h1>
        <p className="text-muted-foreground">
          Let your partner know what you need today
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Care Requests</CardTitle>
            <CardDescription>
              One tap to let your partner know how they can support you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {careTypes.map((care) => {
                const Icon = care.icon;
                return (
                  <Button
                    key={care.type}
                    variant="outline"
                    className="h-auto p-4 flex-col items-start gap-2 hover-elevate active-elevate-2"
                    onClick={() => createRequest.mutate(care.type)}
                    disabled={createRequest.isPending}
                    data-testid={`button-request-${care.type}`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{care.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">
                      {care.description}
                    </p>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {pendingRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Waiting for your partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.map((request) => {
                const careType = careTypes.find((c) => c.type === request.type);
                const Icon = careType?.icon || Clock;
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                    data-testid={`pending-request-${request.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{careType?.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.createdAt!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatus.mutate({ id: request.id, status: "completed" })
                      }
                      data-testid={`button-complete-${request.id}`}
                    >
                      Mark Complete
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {completedRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Completed Requests</CardTitle>
              <CardDescription>Thank you, partner! 💚</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedRequests.slice(0, 5).map((request) => {
                const careType = careTypes.find((c) => c.type === request.type);
                return (
                  <div
                    key={request.id}
                    className="flex items-center gap-3 p-2 text-muted-foreground"
                    data-testid={`completed-request-${request.id}`}
                  >
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{careType?.label}</span>
                    <span className="text-xs">
                      {new Date(request.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {requests.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No care requests yet. Tap a button above to get started!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
