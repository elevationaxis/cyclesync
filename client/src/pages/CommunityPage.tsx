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
import { ThumbsUp, Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CommunityPost } from "@shared/schema";

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

  const phaseColors: Record<string, string> = {
    menstrual: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300",
    follicular: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300",
    ovulatory: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300",
    luteal: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
  };

  const sortedPosts = [...posts].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Community Q&A</h1>
        <p className="text-muted-foreground">
          Anonymous tips and partner support wisdom, upvoted by the community
        </p>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList data-testid="tabs-community">
          <TabsTrigger value="browse" data-testid="tab-browse">Browse</TabsTrigger>
          <TabsTrigger value="share" data-testid="tab-share">Share a Tip</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex gap-2">
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
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading posts...</div>
          ) : sortedPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  No community tips yet. Be the first to share what helped you!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <Card key={post.id} data-testid={`post-${post.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2" data-testid={`text-question-${post.id}`}>
                          {post.question}
                        </CardTitle>
                        <Badge className={`capitalize ${phaseColors[post.phase]}`}>
                          {post.phase} phase
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => upvoteMutation.mutate(post.id)}
                        disabled={upvoteMutation.isPending}
                        className="flex-col h-auto py-2"
                        data-testid={`button-upvote-${post.id}`}
                      >
                        <ThumbsUp className="w-5 h-5 mb-1" />
                        <span className="text-sm font-semibold" data-testid={`text-upvotes-${post.id}`}>
                          {post.upvotes || 0}
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm" data-testid={`text-answer-${post.id}`}>{post.answer}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Posted {new Date(post.createdAt!).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="share" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
              <CardDescription>
                Help others by sharing what worked (or didn't) during a specific phase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question or Topic</Label>
                <Input
                  id="question"
                  placeholder="e.g., How do you manage cramps during menstrual phase?"
                  value={newPost.question}
                  onChange={(e) => setNewPost({ ...newPost, question: e.target.value })}
                  data-testid="input-question"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Your Tip or Experience</Label>
                <Textarea
                  id="answer"
                  placeholder="Share what helped you..."
                  value={newPost.answer}
                  onChange={(e) => setNewPost({ ...newPost, answer: e.target.value })}
                  rows={4}
                  data-testid="input-answer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phase">Cycle Phase</Label>
                <Select
                  value={newPost.phase}
                  onValueChange={(value) => setNewPost({ ...newPost, phase: value })}
                >
                  <SelectTrigger data-testid="select-post-phase">
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
                className="w-full"
                data-testid="button-submit-post"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createPost.isPending ? "Sharing..." : "Share Anonymously"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
