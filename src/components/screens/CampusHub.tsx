import { Building2, Users, Calendar, BookOpen, Award, MapPin } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Chip } from "../ui/Chip";
import { Avatar } from "../ui/Avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClubs, joinClub } from "@/services/clubs";
import { getEvents, rsvpEvent } from "@/services/events";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { NeonButton } from "../ui/NeonButton";

export const CampusHub = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: clubsData } = useQuery({
    queryKey: ["clubs"],
    queryFn: getClubs,
  });

  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const joinClubMutation = useMutation({
    mutationFn: joinClub,
    onSuccess: () => {
      toast.success("Joined club successfully!");
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to join club");
    },
  });

  const rsvpMutation = useMutation({
    mutationFn: rsvpEvent,
    onSuccess: () => {
      toast.success("RSVP successful!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to RSVP");
    },
  });

  // Safe array extraction with null checks
  const clubs = Array.isArray(clubsData?.data) ? clubsData.data : [];
  const events = Array.isArray(eventsData?.data) ? eventsData.data : [];

  const departments = [
    "Engineering", "Business", "Arts", "Sciences", "Medicine", "Law"
  ];

  return (
    <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 space-y-6 animate-fade-in max-w-6xl lg:mx-auto">
      {/* Campus Banner */}
      <GlassCard className="relative overflow-hidden p-0 h-48">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-foreground">
            {user?.collegeId ? "Your Campus" : "Campus Hub"}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Explore clubs and events</span>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="flex items-center gap-3 animate-scale-in">
          <div className="p-3 rounded-xl bg-muted text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{clubs.length}</p>
            <p className="text-xs text-muted-foreground">Clubs</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3 animate-scale-in">
          <div className="p-3 rounded-xl bg-muted text-accent">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{events.length}</p>
            <p className="text-xs text-muted-foreground">Events</p>
          </div>
        </GlassCard>
      </div>

      {/* Departments */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-secondary" />
          <h2 className="text-lg font-semibold text-foreground">Departments</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {departments.map((dept, index) => (
            <Chip
              key={dept}
              variant={index % 4 === 0 ? "primary" : index % 4 === 1 ? "secondary" : index % 4 === 2 ? "accent" : "mint"}
              className="animate-float"
              style={{ animationDelay: `${index * 150}ms` } as React.CSSProperties}
            >
              {dept}
            </Chip>
          ))}
        </div>
      </div>

      {/* Clubs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Clubs</h2>
          </div>
        </div>
        <div className="space-y-3">
          {clubs.length === 0 ? (
            <GlassCard className="text-center py-8">
              <p className="text-muted-foreground">No clubs available yet</p>
            </GlassCard>
          ) : (
            clubs.map((club: any, index: number) => (
              <GlassCard
                key={club.id}
                className="flex items-center gap-4 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center neon-border">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{club.name}</h3>
                  <p className="text-xs text-muted-foreground">{club.description || "No description"}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary">
                      {club._count?.members || 0} members
                    </span>
                  </div>
                </div>
                <NeonButton
                  variant="ghost"
                  size="sm"
                  onClick={() => joinClubMutation.mutate(club.id)}
                  disabled={joinClubMutation.isPending}
                >
                  Join
                </NeonButton>
              </GlassCard>
            ))
          )}
        </div>
      </div>

      {/* Events */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-mint-glow" />
          <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
        </div>
        <div className="space-y-3">
          {events.length === 0 ? (
            <GlassCard className="text-center py-8">
              <p className="text-muted-foreground">No events scheduled yet</p>
            </GlassCard>
          ) : (
            events.map((event: any, index: number) => (
              <GlassCard
                key={event.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="flex gap-4">
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{event.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.description || "No description"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Users className="w-3 h-3 text-primary" />
                      <span className="text-xs text-primary">
                        {event._count?.attendees || 0} attending
                      </span>
                    </div>
                  </div>
                  <NeonButton
                    variant="ghost"
                    size="sm"
                    onClick={() => rsvpMutation.mutate(event.id)}
                    disabled={rsvpMutation.isPending}
                  >
                    RSVP
                  </NeonButton>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
