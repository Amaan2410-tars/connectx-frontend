import { Search, TrendingUp, Calendar, Users, Sparkles } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Chip } from "../ui/Chip";
import { Avatar } from "../ui/Avatar";
import { VerifiedBadge } from "../ui/VerifiedBadge";

const trendingTopics = [
  { tag: "#FinalsSeason", posts: "12.5K" },
  { tag: "#CampusLife", posts: "8.2K" },
  { tag: "#StudyWithMe", posts: "6.7K" },
  { tag: "#SpringBreak2024", posts: "5.1K" },
];

const topColleges = [
  "Stanford", "MIT", "Harvard", "Yale", "Princeton", "Columbia"
];

const suggestedUsers = [
  {
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    college: "UC Berkeley",
    mutualFriends: 12,
    verified: true,
  },
  {
    name: "Jessica Park",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    college: "UCLA",
    mutualFriends: 8,
    verified: true,
  },
  {
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    college: "NYU",
    mutualFriends: 5,
    verified: false,
  },
];

const upcomingEvents = [
  {
    title: "Tech Career Fair 2024",
    date: "Mar 15",
    location: "Main Campus Hall",
    gradient: "from-primary to-secondary",
  },
  {
    title: "Spring Music Festival",
    date: "Mar 22",
    location: "University Amphitheater",
    gradient: "from-secondary to-accent",
  },
];

export const DiscoverPage = () => {
  return (
    <div className="px-4 pt-4 pb-32 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Discover</h1>
        <p className="text-sm text-muted-foreground">Explore your campus world</p>
      </div>

      {/* Search Bar */}
      <GlassCard className="flex items-center gap-3 py-3">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search students, events, topics..."
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
        <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-neon">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </GlassCard>

      {/* Trending Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-neon-pink" />
          <h2 className="text-lg font-semibold text-foreground">Trending Now</h2>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <GlassCard 
              key={topic.tag} 
              className="flex items-center justify-between py-3 hover:neon-glow-pink transition-all cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-neon-pink">#{index + 1}</span>
                <span className="font-medium text-foreground">{topic.tag}</span>
              </div>
              <span className="text-sm text-muted-foreground">{topic.posts} posts</span>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Top Colleges */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Top Colleges</h2>
        <div className="flex flex-wrap gap-2">
          {topColleges.map((college, index) => (
            <Chip 
              key={college}
              variant={index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent"}
              className="animate-float"
              style={{ animationDelay: `${index * 200}ms` } as React.CSSProperties}
            >
              {college}
            </Chip>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-secondary" />
          <h2 className="text-lg font-semibold text-foreground">People You May Know</h2>
        </div>
        <div className="space-y-3">
          {suggestedUsers.map((user, index) => (
            <GlassCard 
              key={user.name}
              className="flex items-center justify-between animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} alt={user.name} size="md" glowRing />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{user.name}</span>
                    {user.verified && <VerifiedBadge size="sm" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{user.college}</p>
                  <p className="text-xs text-primary">{user.mutualFriends} mutual friends</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-primary/20 text-primary font-medium text-sm hover:bg-primary/30 transition-colors neon-glow">
                Follow
              </button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-mint-glow" />
          <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <GlassCard 
              key={event.title}
              className="overflow-hidden p-0 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              <div className={`h-20 bg-gradient-to-r ${event.gradient} flex items-end p-4`}>
                <h3 className="text-white font-bold text-lg drop-shadow-lg">{event.title}</h3>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{event.date}</p>
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                </div>
                <button className="px-4 py-2 rounded-xl gradient-primary text-white font-medium text-sm shadow-glow">
                  RSVP
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
