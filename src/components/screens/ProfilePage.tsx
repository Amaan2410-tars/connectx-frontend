import { Settings, Edit2, Grid, Bookmark, Heart, MapPin } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Avatar } from "../ui/Avatar";
import { VerifiedBadge } from "../ui/VerifiedBadge";
import { NeonButton } from "../ui/NeonButton";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/user";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/user";
import { createPost } from "@/services/posts";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const tabs = [
  { id: "posts", icon: Grid, label: "Posts" },
  { id: "saved", icon: Bookmark, label: "Saved" },
  { id: "liked", icon: Heart, label: "Liked" },
];

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      setEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update profile");
    },
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setPostDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create post");
    },
  });

  const profile = profileData?.data || user;
  const isVerified = profile?.verifiedStatus === "approved";

  if (isLoading) {
    return (
      <div className="pb-32 animate-fade-in">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 animate-fade-in">
      {/* Banner */}
      <div className="relative h-40 gradient-primary animate-gradient">
        {profile?.banner && (
          <img
            src={profile.banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <button className="absolute top-4 right-4 p-2 glass-card">
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative">
            <Avatar
              src={profile?.avatar}
              alt={profile?.name || "Profile"}
              size="xl"
              glowRing
            />
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <button className="absolute bottom-0 right-0 p-2 rounded-full gradient-primary shadow-glow">
                  <Edit2 className="w-4 h-4 text-white" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <ProfileEditForm
                  profile={profile}
                  onSubmit={(data) => updateProfileMutation.mutate(data)}
                  isLoading={updateProfileMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Name & Badge */}
          <div className="flex items-center gap-2 mt-4">
            <h1 className="text-2xl font-bold text-foreground">{profile?.name || "User"}</h1>
            {isVerified && <VerifiedBadge size="lg" />}
          </div>
          <p className="text-muted-foreground">@{profile?.email?.split("@")[0] || "user"}</p>

          {/* Bio */}
          {profile?.batch && (
            <p className="text-center mt-3 text-foreground max-w-xs">
              Batch: {profile.batch}
            </p>
          )}

          {/* Info Tags */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {profile?.collegeId && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>College ID: {profile.collegeId}</span>
              </div>
            )}
            {profile?.points !== undefined && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="text-primary font-semibold">{profile.points} Points</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 w-full max-w-xs">
            <NeonButton
              variant="gradient"
              className="flex-1"
              onClick={() => setEditDialogOpen(true)}
            >
              Edit Profile
            </NeonButton>
            <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
              <DialogTrigger asChild>
                <NeonButton variant="ghost" className="px-4 glass-card">
                  <Edit2 className="w-4 h-4" />
                </NeonButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>
                <PostCreateForm
                  onSubmit={(data) => createPostMutation.mutate(data)}
                  isLoading={createPostMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mt-6 border-b border-border/50 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive && "drop-shadow-[0_0_8px_hsl(189,100%,72%)]"
                  )}
                />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full gradient-primary shadow-neon" />
                )}
              </button>
            );
          })}
        </div>

        {/* Posts Grid - Placeholder */}
        <div className="mt-4 text-center py-8">
          <p className="text-muted-foreground">Posts will appear here</p>
        </div>
      </div>
    </div>
  );
};

const ProfileEditForm = ({
  profile,
  onSubmit,
  isLoading,
}: {
  profile: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    batch: profile?.batch || "",
    avatar: null as File | null,
    banner: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="batch">Batch</Label>
        <Input
          id="batch"
          value={formData.batch}
          onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, avatar: e.target.files?.[0] || null })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="banner">Banner</Label>
        <Input
          id="banner"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, banner: e.target.files?.[0] || null })
          }
        />
      </div>
      <NeonButton type="submit" variant="gradient" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Profile"
        )}
      </NeonButton>
    </form>
  );
};

const PostCreateForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    caption: "",
    image: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          id="caption"
          value={formData.caption}
          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image (Optional)</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files?.[0] || null })
          }
        />
      </div>
      <NeonButton type="submit" variant="gradient" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Posting...
          </>
        ) : (
          "Create Post"
        )}
      </NeonButton>
    </form>
  );
};
