import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Plus, MessageSquare, Users, Heart, Flower2, Sun, Cloud, Lightbulb, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CommunityPost } from "@shared/schema";

const phaseIcons: Record<string, typeof Heart> = {
  menstrual: Heart,
  follicular: Flower2,
  ovulatory: Sun,
  luteal: Cloud,
};

export default function CommunityPage() {
  const { toast } = useToast();
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState({
    question: "",
    answer: "",
    phase: "menstrual",
  });

  const { data: posts = [], isLoading } = useQuery<CommunityPost[]>({
    queryKey: selectedPhase === "all" ? ["/api/community-posts"] : ["/api/community-posts", selectedPhase],
    queryFn: async () => {
      const response = await fetch(
        selectedPhase === "all" ? "/api/community-posts" : `/api/community-posts?phase=${selectedPhase}`
      );
      if (!response.ok) throw new Error("Failed to fetch community posts");
      return response.json();
    },
  });

  const createPost = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/community-posts", {
        question: newPost.question,
        answer: newPost.answer,
        phase: newPost.phase,
        upvotes: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
      toast({
        title: "Post created",
        description: "Your tip has been shared with the community",
      });
      setNewPost({ question: "", answer: "", phase: "menstrual" });
      setIsAdding(false);
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/community-posts/${id}/upvote`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
    },
  });

  const phaseColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    menstrual: {
      bg: "bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
      text: "text-rose-700 dark:text-rose-300",
      border: "border-rose-200 dark:border-rose-800",
      gradient: "from-rose-500 to-red-600"
    },
    follicular: {
      bg: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800",
      gradient: "from-emerald-500 to-green-600"
    },
    ovulatory: {
      bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
      gradient: "from-amber-500 to-yellow-600"
    },
    luteal: {
      bg: "bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
      text: "text-sky-700 dark:text-sky-300",
      border: "border-sky-200 dark:border-sky-800",
      gradient: "from-sky-500 to-blue-600"
    },
  };

  const sortedPosts = [...posts].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 mb-4">
          <Users className="w-8 h-8 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Community Wisdom
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Anonymous tips and experiences shared by women who understand
        </p>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2" data-testid="tabs-community">
          <TabsTrigger value="browse" data-testid="tab-browse" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Browse
          </TabsTrigger>
          <TabsTrigger value="share" data-testid="tab-share" className="gap-2">
            <Lightbulb className="w-4 h-4" />
            Share a Tip
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger className="w-[200px]" data-testid="select-phase-filter">
                <SelectValue placeholder="Filter by phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                <SelectItem value="menstrual">Menstrual</SelectItem>
                <SelectItem value="follicular">Follicular</SelectItem>
                <SelectItem value="ovulatory">Ovulatory</SelectItem>
                <SelectItem value="luteal">Luteal</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {sortedPosts.length} tip{sortedPosts.length !== 1 ? 's' : ''} shared
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20" />
                <p className="text-muted-foreground">Loading community wisdom...</p>
              </div>
            </div>
          ) : sortedPosts.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-2">No community tips yet</p>
                <p className="text-muted-foreground mb-4">
                  Be the first to share what helped you!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedPosts.map((post) => {
                const phase = phaseColors[post.phase];
                const PhaseIcon = phaseIcons[post.phase] || Heart;
                return (
                  <Card 
                    key={post.id} 
                    className={`border-2 ${phase.border} ${phase.bg} overflow-visible transition-all duration-300 hover:shadow-md`}
                    data-testid={`post-${post.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${phase.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <PhaseIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg mb-2 leading-snug" data-testid={`text-question-${post.id}`}>
                            {post.question}
                          </CardTitle>
                          <Badge variant="secondary" className={`capitalize ${phase.text} bg-background/50`}>
                            {post.phase} phase
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => upvoteMutation.mutate(post.id)}
                          disabled={upvoteMutation.isPending}
                          className="flex-col h-auto py-2 px-3 gap-1 hover-elevate"
                          data-testid={`button-upvote-${post.id}`}
                        >
                          <ThumbsUp className="w-5 h-5" />
                          <span className="text-sm font-bold" data-testid={`text-upvotes-${post.id}`}>
                            {post.upvotes || 0}
                          </span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-background/70 backdrop-blur-sm p-4 rounded-xl border">
                        <p className="text-sm leading-relaxed" data-testid={`text-answer-${post.id}`}>{post.answer}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Shared {new Date(post.createdAt!).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="share" className="space-y-4">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-2 mx-auto">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Share Your Wisdom</CardTitle>
              <CardDescription className="text-base">
                Help others by sharing what worked (or didn't) during a specific phase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="question" className="text-base">Question or Topic</Label>
                <Input
                  id="question"
                  placeholder="e.g., How do you manage energy dips during luteal phase?"
                  value={newPost.question}
                  onChange={(e) => setNewPost({ ...newPost, question: e.target.value })}
                  className="h-12"
                  data-testid="input-question"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer" className="text-base">Your Tip or Experience</Label>
                <Textarea
                  id="answer"
                  placeholder="Share what helped you... be as specific as you like!"
                  value={newPost.answer}
                  onChange={(e) => setNewPost({ ...newPost, answer: e.target.value })}
                  rows={5}
                  className="resize-none"
                  data-testid="input-answer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phase" className="text-base">Which Cycle Phase?</Label>
                <Select
                  value={newPost.phase}
                  onValueChange={(value) => setNewPost({ ...newPost, phase: value })}
                >
                  <SelectTrigger className="h-12" data-testid="select-post-phase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menstrual">Menstrual</SelectItem>
                    <SelectItem value="follicular">Follicular</SelectItem>
                    <SelectItem value="ovulatory">Ovulatory</SelectItem>
                    <SelectItem value="luteal">Luteal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => createPost.mutate()}
                disabled={!newPost.question || !newPost.answer || createPost.isPending}
                className="w-full h-12 text-base bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                data-testid="button-submit-post"
              >
                <Plus className="w-5 h-5 mr-2" />
                {createPost.isPending ? "Sharing..." : "Share Anonymously"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
