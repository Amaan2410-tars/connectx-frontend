import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  bypassVerification,
  getStudents,
  getStudentStats,
  getCollegeAnalytics,
  createEvent,
  getCollegeEvents,
  createClub,
  getCollegeClubs,
  createAnnouncement,
  getAnnouncements,
  type PendingVerification,
} from "@/services/collegeAdmin";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { cn } from "@/lib/utils";
import {
  Shield,
  CheckCircle2,
  X,
  Loader2,
  BarChart3,
  Calendar,
  Building2,
  Megaphone,
  Users,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminVerificationPanel } from "./AdminVerificationPanel";

type Tab = "dashboard" | "verifications" | "students" | "events" | "clubs" | "announcements";

export const CollegeAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [createClubOpen, setCreateClubOpen] = useState(false);
  const [createAnnouncementOpen, setCreateAnnouncementOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: analyticsData } = useQuery({
    queryKey: ["college-analytics"],
    queryFn: getCollegeAnalytics,
    enabled: activeTab === "dashboard",
  });

  const { data: studentsData } = useQuery({
    queryKey: ["college-students"],
    queryFn: getStudents,
    enabled: activeTab === "students",
  });

  const { data: eventsData } = useQuery({
    queryKey: ["college-events"],
    queryFn: getCollegeEvents,
    enabled: activeTab === "events",
  });

  const { data: clubsData } = useQuery({
    queryKey: ["college-clubs"],
    queryFn: getCollegeClubs,
    enabled: activeTab === "clubs",
  });

  const { data: announcementsData } = useQuery({
    queryKey: ["college-announcements"],
    queryFn: getAnnouncements,
    enabled: activeTab === "announcements",
  });

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      toast.success("Event created successfully");
      queryClient.invalidateQueries({ queryKey: ["college-events"] });
      setCreateEventOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create event");
    },
  });

  const createClubMutation = useMutation({
    mutationFn: createClub,
    onSuccess: () => {
      toast.success("Club created successfully");
      queryClient.invalidateQueries({ queryKey: ["college-clubs"] });
      setCreateClubOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create club");
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      toast.success("Announcement created successfully");
      queryClient.invalidateQueries({ queryKey: ["college-announcements"] });
      setCreateAnnouncementOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create announcement");
    },
  });

  const analytics = analyticsData?.data;
  const students = Array.isArray(studentsData?.data) ? studentsData.data : [];
  const events = Array.isArray(eventsData?.data) ? eventsData.data : [];
  const clubs = Array.isArray(clubsData?.data) ? clubsData.data : [];
  const announcements = Array.isArray(announcementsData?.data) ? announcementsData.data : [];

  return (
    <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 min-h-screen max-w-7xl lg:mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                College Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Manage your college</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <NeonButton
            variant={activeTab === "dashboard" ? "gradient" : "ghost"}
            onClick={() => setActiveTab("dashboard")}
            className="whitespace-nowrap"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </NeonButton>
          <NeonButton
            variant={activeTab === "verifications" ? "gradient" : "ghost"}
            onClick={() => setActiveTab("verifications")}
            className="whitespace-nowrap"
          >
            <Shield className="w-4 h-4 mr-2" />
            Verifications
          </NeonButton>
          <NeonButton
            variant={activeTab === "students" ? "gradient" : "ghost"}
            onClick={() => setActiveTab("students")}
            className="whitespace-nowrap"
          >
            <Users className="w-4 h-4 mr-2" />
            Students
          </NeonButton>
          <NeonButton
            variant={activeTab === "events" ? "gradient" : "ghost"}
            onClick={() => setActiveTab("events")}
            className="whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Events
          </NeonButton>
          <NeonButton
            variant={activeTab === "clubs" ? "gradient" : "ghost"}
            onClick={() => setActiveTab("clubs")}
            className="whitespace-nowrap"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Clubs
          </NeonButton>
          <NeonButton
            variant={activeTab === "announcements" ? "gradient" : "ghost"}
            onClick={() => setActiveTab("announcements")}
            className="whitespace-nowrap"
          >
            <Megaphone className="w-4 h-4 mr-2" />
            Announcements
          </NeonButton>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.totalStudents || 0}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.totalEvents || 0}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clubs</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.totalClubs || 0}</p>
                </div>
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Verifications</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.pendingVerifications || 0}</p>
                </div>
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Verifications Tab */}
      {activeTab === "verifications" && <AdminVerificationPanel />}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="space-y-4">
          {students.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">No students found</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {students.map((student: any) => (
                <GlassCard key={student.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{student._count?.posts || 0} posts</span>
                        <span>{student._count?.eventsRSVP || 0} events</span>
                        <span>{student._count?.clubs || 0} clubs</span>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      student.verifiedStatus === "approved" ? "bg-primary/20 text-primary" :
                      student.verifiedStatus === "rejected" ? "bg-destructive/20 text-destructive" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {student.verifiedStatus}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Events</h2>
            <Dialog open={createEventOpen} onOpenChange={setCreateEventOpen}>
              <DialogTrigger asChild>
                <NeonButton variant="gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </NeonButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Event</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createEventMutation.mutate({
                      title: formData.get("title") as string,
                      description: formData.get("description") as string,
                      date: formData.get("date") as string,
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label>Title</Label>
                    <Input name="title" required />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" rows={4} />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input name="date" type="datetime-local" required />
                  </div>
                  <NeonButton type="submit" variant="gradient" className="w-full" disabled={createEventMutation.isPending}>
                    {createEventMutation.isPending ? "Creating..." : "Create Event"}
                  </NeonButton>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {events.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">No events yet</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {events.map((event: any) => (
                <GlassCard key={event.id} className="p-4">
                  <h3 className="font-semibold text-foreground">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clubs Tab */}
      {activeTab === "clubs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Clubs</h2>
            <Dialog open={createClubOpen} onOpenChange={setCreateClubOpen}>
              <DialogTrigger asChild>
                <NeonButton variant="gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Club
                </NeonButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Club</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createClubMutation.mutate({
                      name: formData.get("name") as string,
                      description: formData.get("description") as string,
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label>Name</Label>
                    <Input name="name" required />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" rows={4} />
                  </div>
                  <NeonButton type="submit" variant="gradient" className="w-full" disabled={createClubMutation.isPending}>
                    {createClubMutation.isPending ? "Creating..." : "Create Club"}
                  </NeonButton>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {clubs.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">No clubs yet</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {clubs.map((club: any) => (
                <GlassCard key={club.id} className="p-4">
                  <h3 className="font-semibold text-foreground">{club.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{club.description}</p>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Announcements</h2>
            <Dialog open={createAnnouncementOpen} onOpenChange={setCreateAnnouncementOpen}>
              <DialogTrigger asChild>
                <NeonButton variant="gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Announcement
                </NeonButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createAnnouncementMutation.mutate({
                      title: formData.get("title") as string,
                      message: formData.get("message") as string,
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label>Title</Label>
                    <Input name="title" required />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea name="message" rows={6} required />
                  </div>
                  <NeonButton type="submit" variant="gradient" className="w-full" disabled={createAnnouncementMutation.isPending}>
                    {createAnnouncementMutation.isPending ? "Creating..." : "Create Announcement"}
                  </NeonButton>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {announcements.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Megaphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">No announcements yet</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement: any) => (
                <GlassCard key={announcement.id} className="p-4">
                  <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


