import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Plus, Loader2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Avatar } from "../ui/Avatar";
import { VerifiedBadge } from "../ui/VerifiedBadge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFeed, likePost, unlikePost, commentOnPost, getPostComments, createPost, type Post } from "@/services/posts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeonButton } from "../ui/NeonButton";

export const HomeFeed = () => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [commentDialogOpen, setCommentDialogOpen] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [postFormData, setPostFormData] = useState<{ caption: string; image: File | null }>({
    caption: "",
    image: null,
  });
  const queryClient = useQueryClient();

  const { data: feedData, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => getFeed(20, pageParam),
    getNextPageParam: (lastPage) => lastPage?.data?.nextCursor,
    initialPageParam: undefined,
    retry: 2,
  });

  const likeMutation = useMutation({
    mutationFn: (postId: string) => {
      const isLiked = likedPosts.has(postId);
      return isLiked ? unlikePost(postId) : likePost(postId);
    },
    onSuccess: (_, postId) => {
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to like post");
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, text }: { postId: string; text: string }) =>
      commentOnPost(postId, text),
    onSuccess: () => {
      setCommentText("");
      setCommentDialogOpen(null);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.success("Comment added!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add comment");
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (data: { caption?: string; image?: File | string }) => createPost(data),
    onSuccess: () => {
      setPostFormData({ caption: "", image: null });
      setPostDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.success("Post created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create post");
    },
  });

  useEffect(() => {
    const handleOpenPostDialog = () => {
      setPostDialogOpen(true);
    };
    window.addEventListener("openPostDialog", handleOpenPostDialog);
    return () => {
      window.removeEventListener("openPostDialog", handleOpenPostDialog);
    };
  }, []);

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleComment = (postId: string) => {
    if (commentText.trim()) {
      commentMutation.mutate({ postId, text: commentText });
    }
  };

  // Safely extract posts with proper null checks
  const posts = feedData?.pages?.flatMap((page) => {
    if (!page || !page.data) return [];
    return Array.isArray(page.data.posts) ? page.data.posts : [];
  }) || [];

  if (isLoading) {
    return (
      <div className="px-4 pt-4 pb-32 space-y-4">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 pt-4 pb-32 space-y-4">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load feed. Please try again.</p>
          <NeonButton onClick={() => queryClient.invalidateQueries({ queryKey: ["feed"] })}>
            Retry
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 space-y-4 lg:space-y-6 animate-fade-in">
      {/* Header - Desktop shows differently */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Your Feed
          </h1>
          <p className="text-muted-foreground mt-1">Stay connected with your campus</p>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            ConnectX
          </h1>
          <p className="text-sm text-muted-foreground">Your Campus Feed</p>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4 lg:space-y-6 max-w-3xl lg:mx-auto">
        {posts.length === 0 ? (
          <GlassCard className="text-center py-12">
            <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
          </GlassCard>
        ) : (
          posts.map((post: Post, index: number) => {
              const isLiked = likedPosts.has(post.id);
              const isSaved = savedPosts.has(post.id);
              const likeCount = post._count?.likes || 0;
              const commentCount = post._count?.comments || 0;

              return (
                <GlassCard
                  key={post.id}
                  className="overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={post.user?.avatar}
                        alt={post.user?.name || "User"}
                        size="md"
                        glowRing
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">
                            {post.user?.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Post Content */}
                  {post.caption && (
                    <p className="text-foreground mb-3">{post.caption}</p>
                  )}

                  {/* Post Image */}
                  {post.image && (
                    <div className="relative -mx-4 mb-3 overflow-hidden rounded-xl">
                      <div className="absolute inset-0 gradient-primary opacity-20" />
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 border-y-2 border-primary/20" />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 transition-all duration-200 hover:scale-110"
                        disabled={likeMutation.isPending}
                      >
                        <Heart
                          className={cn(
                            "w-5 h-5 transition-colors",
                            isLiked
                              ? "fill-neon-pink text-neon-pink drop-shadow-[0_0_8px_hsl(311,100%,74%)]"
                              : "text-muted-foreground"
                          )}
                        />
                        <span className="text-sm text-muted-foreground">
                          {likeCount + (isLiked ? 1 : 0) - (isLiked ? 0 : 0)}
                        </span>
                      </button>

                      <Dialog
                        open={commentDialogOpen === post.id}
                        onOpenChange={(open) => {
                          setCommentDialogOpen(open ? post.id : null);
                          if (!open) setCommentText("");
                        }}
                      >
                        <DialogTrigger asChild>
                          <button className="flex items-center gap-1.5 transition-all duration-200 hover:scale-110">
                            <MessageCircle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                            <span className="text-sm text-muted-foreground">{commentCount}</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Comment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Write a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              rows={4}
                            />
                            <NeonButton
                              onClick={() => handleComment(post.id)}
                              disabled={!commentText.trim() || commentMutation.isPending}
                              variant="gradient"
                              className="w-full"
                            >
                              {commentMutation.isPending ? "Posting..." : "Post Comment"}
                            </NeonButton>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <button className="transition-all duration-200 hover:scale-110">
                        <Share2 className="w-5 h-5 text-muted-foreground hover:text-secondary" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setSavedPosts((prev) => {
                          const newSet = new Set(prev);
                          if (newSet.has(post.id)) {
                            newSet.delete(post.id);
                          } else {
                            newSet.add(post.id);
                          }
                          return newSet;
                        });
                      }}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Bookmark
                        className={cn(
                          "w-5 h-5 transition-colors",
                          isSaved
                            ? "fill-neon-gold text-neon-gold drop-shadow-[0_0_8px_hsl(47,100%,70%)]"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  </div>

                  {/* Time */}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </GlassCard>
              );
            })
          )}
        </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="text-center py-4">
          <NeonButton
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="ghost"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </NeonButton>
        </div>
      )}

      {/* Post Creation Dialog */}
      <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-caption">Caption</Label>
              <Textarea
                id="post-caption"
                placeholder="What's on your mind?"
                value={postFormData.caption}
                onChange={(e) =>
                  setPostFormData({ ...postFormData, caption: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-image">Image (Optional)</Label>
              <Input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPostFormData({
                    ...postFormData,
                    image: e.target.files?.[0] || null,
                  })
                }
              />
            </div>
            <NeonButton
              variant="gradient"
              className="w-full"
              onClick={() => createPostMutation.mutate(postFormData)}
              disabled={createPostMutation.isPending || (!postFormData.caption && !postFormData.image)}
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                "Create Post"
              )}
            </NeonButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
