import { api } from "@/lib/apiClient";

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  image?: string;
  collegeId: string;
  createdAt: string;
  college?: {
    id: string;
    name: string;
  };
  _count?: {
    attendees: number;
  };
}

// GET /events
export const getEvents = async (): Promise<{ success: boolean; data: Event[] }> => {
  try {
    const response = await api.get("/student/events");
    return {
      success: response.data?.success !== false,
      data: Array.isArray(response.data?.data) ? response.data.data : [],
    };
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return {
      success: false,
      data: [],
    };
  }
};

// GET /events/:id
export const getEventById = async (id: string) => {
  const response = await api.get(`/student/events/${id}`);
  return response.data;
};

// POST /events/rsvp
export const rsvpEvent = async (eventId: string) => {
  const response = await api.post(`/student/events/${eventId}/rsvp`);
  return response.data;
};

// DELETE /events/:id/rsvp
export const cancelRSVP = async (eventId: string) => {
  const response = await api.delete(`/student/events/${eventId}/rsvp`);
  return response.data;
};

