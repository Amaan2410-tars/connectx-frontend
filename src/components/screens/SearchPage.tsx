import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, FileText, Building2, Calendar, Loader2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { Input } from "@/components/ui/input";
import { search } from "@/services/search";
import { Avatar } from "../ui/Avatar";
import { cn } from "@/lib/utils";
import { FeedSkeleton } from "../ui/skeleton";

type SearchType = "all" | "users" | "posts" | "clubs" | "events";

export const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<SearchType>("all");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery, activeType],
    queryFn: () => search(debouncedQuery, activeType, 20),
    enabled: debouncedQuery.length >= 2,
  });

  const searchResults = data?.data || {};

  return (
    <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 space-y-6 animate-fade-in max-w-6xl lg:mx-auto">
      {/* Search Header */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users, posts, clubs, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Search Type Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "users", "posts", "clubs", "events"] as SearchType[]).map((type) => (
            <NeonButton
              key={type}
              variant={activeType === type ? "gradient" : "ghost"}
              size="sm"
              onClick={() => setActiveType(type)}
              className="capitalize"
            >
              {type === "all" ? "All" : type}
            </NeonButton>
          ))}
        </div>
      </GlassCard>

      {/* Search Results */}
      {isLoading && debouncedQuery.length >= 2 ? (
        <FeedSkeleton />
      ) : debouncedQuery.length < 2 ? (
        <GlassCard className="text-center py-12">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Enter at least 2 characters to search</p>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {/* Users Results */}
          {(activeType === "all" || activeType === "users") && searchResults.users && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Users ({searchResults.users.length})
                </h2>
              </div>
              {searchResults.users.length === 0 ? (
                <GlassCard className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
                </GlassCard>
              ) : (
                <div className="space-y-2">
                  {searchResults.users.map((user: any) => (
                    <GlassCard key={user.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} alt={user.name} size="md" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.college?.name}</p>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Posts Results */}
          {(activeType === "all" || activeType === "posts") && searchResults.posts && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Posts ({searchResults.posts.length})
                </h2>
              </div>
              {searchResults.posts.length === 0 ? (
                <GlassCard className="text-center py-8">
                  <p className="text-muted-foreground">No posts found</p>
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {searchResults.posts.map((post: any) => (
                    <GlassCard key={post.id} className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar src={post.user?.avatar} alt={post.user?.name} size="sm" />
                        <span className="font-semibold text-foreground">{post.user?.name}</span>
                      </div>
                      {post.caption && (
                        <p className="text-foreground mb-2">{post.caption}</p>
                      )}
                      {post.image && (
                        <img src={post.image} alt="Post" className="w-full rounded-lg max-h-64 object-cover" />
                      )}
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{post._count?.likes || 0} likes</span>
                        <span>{post._count?.comments || 0} comments</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Clubs Results */}
          {(activeType === "all" || activeType === "clubs") && searchResults.clubs && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Clubs ({searchResults.clubs.length})
                </h2>
              </div>
              {searchResults.clubs.length === 0 ? (
                <GlassCard className="text-center py-8">
                  <p className="text-muted-foreground">No clubs found</p>
                </GlassCard>
              ) : (
                <div className="space-y-2">
                  {searchResults.clubs.map((club: any) => (
                    <GlassCard key={club.id} className="p-4">
                      <h3 className="font-semibold text-foreground">{club.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{club.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {club._count?.members || 0} members
                      </p>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events Results */}
          {(activeType === "all" || activeType === "events") && searchResults.events && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Events ({searchResults.events.length})
                </h2>
              </div>
              {searchResults.events.length === 0 ? (
                <GlassCard className="text-center py-8">
                  <p className="text-muted-foreground">No events found</p>
                </GlassCard>
              ) : (
                <div className="space-y-2">
                  {searchResults.events.map((event: any) => (
                    <GlassCard key={event.id} className="p-4">
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(event.date).toLocaleDateString()} • {event._count?.attendees || 0} attending
                      </p>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {!isLoading &&
            debouncedQuery.length >= 2 &&
            (!searchResults.users || searchResults.users.length === 0) &&
            (!searchResults.posts || searchResults.posts.length === 0) &&
            (!searchResults.clubs || searchResults.clubs.length === 0) &&
            (!searchResults.events || searchResults.events.length === 0) && (
              <GlassCard className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold text-foreground">No results found</p>
                <p className="text-muted-foreground mt-2">Try a different search term</p>
              </GlassCard>
            )}
        </div>
      )}
    </div>
  );
};

