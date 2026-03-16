import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Music, Video, Sparkles, Heart, Sun, Flower2, Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Ritual } from "@shared/schema";

const phaseIcons: Record<string, typeof Heart> = {
  menstrual: Heart,
  follicular: Flower2,
  ovulatory: Sun,
  luteal: Cloud,
};

export default function RitualsPage() {
  const { toast } = useToast();
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    phase: "menstrual",
    duration: "",
    file: null as File | null,
  });

  const { data: rituals = [], isLoading } = useQuery<Ritual[]>({
    queryKey: selectedPhase === "all" ? ["/api/rituals"] : ["/api/rituals", selectedPhase],
    queryFn: async () => {
      const response = await fetch(
        selectedPhase === "all" ? "/api/rituals" : `/api/rituals?phase=${selectedPhase}`
      );
      if (!response.ok) throw new Error("Failed to fetch rituals");
      return response.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadForm.file) throw new Error("No file selected");

      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("title", uploadForm.title);
      formData.append("description", uploadForm.description);
      formData.append("phase", uploadForm.phase);
      if (uploadForm.duration) formData.append("duration", uploadForm.duration);

      const response = await fetch("/api/rituals/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload ritual");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rituals"] });
      toast({
        title: "Ritual uploaded",
        description: "Your ritual has been added to the library",
      });
      setUploadForm({
        title: "",
        description: "",
        phase: "menstrual",
        duration: "",
        file: null,
      });
      setIsUploading(false);
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Could not upload your ritual. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/rituals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rituals"] });
      toast({
        title: "Ritual deleted",
        description: "The ritual has been removed from your library",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, file: e.target.files[0] });
    }
  };

  const handleUpload = () => {
    if (!uploadForm.file || !uploadForm.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select a file",
        variant: "destructive",
      });
      return;
    }
    uploadMutation.mutate();
  };

  const phaseColors: Record<string, string> = {
    menstrual: "bg-gradient-to-br from-rose-100 to-red-50 dark:from-rose-900/30 dark:to-red-900/20 border-rose-200 dark:border-rose-800",
    follicular: "bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900/30 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800",
    ovulatory: "bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800",
    luteal: "bg-gradient-to-br from-sky-100 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/20 border-sky-200 dark:border-sky-800",
  };

  const phaseTextColors: Record<string, string> = {
    menstrual: "text-rose-700 dark:text-rose-300",
    follicular: "text-emerald-700 dark:text-emerald-300",
    ovulatory: "text-amber-700 dark:text-amber-300",
    luteal: "text-sky-700 dark:text-sky-300",
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Ritual Library
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Your sacred collection of phase-aligned practices for every season of your cycle
        </p>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList data-testid="tabs-rituals">
          <TabsTrigger value="library" data-testid="tab-library">Library</TabsTrigger>
          <TabsTrigger value="upload" data-testid="tab-upload">Upload Ritual</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger className="w-[200px]" data-testid="select-phase-filter">
                <SelectValue placeholder="Filter by phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" data-testid="phase-all">All Phases</SelectItem>
                <SelectItem value="menstrual" data-testid="phase-menstrual">Menstrual</SelectItem>
                <SelectItem value="follicular" data-testid="phase-follicular">Follicular</SelectItem>
                <SelectItem value="ovulatory" data-testid="phase-ovulatory">Ovulatory</SelectItem>
                <SelectItem value="luteal" data-testid="phase-luteal">Luteal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading rituals...</div>
          ) : rituals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No rituals yet. Upload your first one to get started!
                </p>
                <Button onClick={() => setIsUploading(true)} data-testid="button-start-upload">
                  Upload Ritual
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rituals.map((ritual) => (
                <Card key={ritual.id} data-testid={`card-ritual-${ritual.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg" data-testid={`text-ritual-title-${ritual.id}`}>
                          {ritual.title}
                        </CardTitle>
                        <CardDescription>
                          <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mt-2 capitalize ${phaseColors[ritual.phase]}`}>
                            {ritual.phase}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {ritual.fileType === "audio" ? (
                          <Music className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Video className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{ritual.description}</p>
                    {ritual.duration && (
                      <p className="text-xs text-muted-foreground">Duration: {ritual.duration}</p>
                    )}
                    {ritual.filePath ? (
                      <div className="flex gap-2">
                        {ritual.fileType === "audio" ? (
                          <audio controls className="w-full" data-testid={`audio-player-${ritual.id}`}>
                            <source src={ritual.filePath} type="audio/mpeg" />
                            Your browser does not support audio playback.
                          </audio>
                        ) : (
                          <video controls className="w-full rounded-md" data-testid={`video-player-${ritual.id}`}>
                            <source src={ritual.filePath} type="video/mp4" />
                            Your browser does not support video playback.
                          </video>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-6 rounded-md bg-muted/50 border border-dashed" data-testid={`placeholder-media-${ritual.id}`}>
                        <p className="text-sm text-muted-foreground">Media coming soon</p>
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(ritual.id)}
                      disabled={deleteMutation.isPending}
                      className="w-full"
                      data-testid={`button-delete-${ritual.id}`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Ritual</CardTitle>
              <CardDescription>
                Add your own audio or video practice to your library
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Morning Meditation"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  data-testid="input-ritual-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What is this ritual about?"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  data-testid="input-ritual-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phase">Cycle Phase</Label>
                <Select
                  value={uploadForm.phase}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, phase: value })}
                >
                  <SelectTrigger data-testid="select-ritual-phase">
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

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (optional)</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 10 minutes"
                  value={uploadForm.duration}
                  onChange={(e) => setUploadForm({ ...uploadForm, duration: e.target.value })}
                  data-testid="input-ritual-duration"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Audio or Video File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileChange}
                  data-testid="input-ritual-file"
                />
                {uploadForm.file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {uploadForm.file.name}
                  </p>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending || !uploadForm.file || !uploadForm.title}
                className="w-full"
                data-testid="button-upload-ritual"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadMutation.isPending ? "Uploading..." : "Upload Ritual"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
