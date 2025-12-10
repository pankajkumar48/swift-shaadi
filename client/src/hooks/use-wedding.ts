import { createContext, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export interface Wedding {
  id: string;
  couple_names: string;
  date: string;
  city: string;
  haldi_date_time?: string;
  sangeet_date_time?: string;
  wedding_date_time?: string;
  total_budget: number;
  owner_id: string;
}

export interface WeddingContextType {
  wedding: Wedding | null;
  setWedding: (wedding: Wedding | null) => void;
}

export const WeddingContext = createContext<WeddingContextType | null>(null);

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error("useWedding must be used within WeddingProvider");
  }
  return context;
}

export function useWeddingsQuery() {
  return useQuery<Wedding[]>({
    queryKey: ["/api/weddings"],
  });
}

export function useWeddingQuery(weddingId: string | null) {
  return useQuery<Wedding>({
    queryKey: ["/api/weddings", weddingId],
    enabled: !!weddingId,
  });
}

export function useCreateWeddingMutation() {
  return useMutation({
    mutationFn: async (data: {
      couple_names: string;
      date: string;
      city: string;
      haldi_date_time?: string;
      sangeet_date_time?: string;
      wedding_date_time?: string;
      total_budget?: number;
      owner_name?: string;
      owner_email?: string;
    }) => {
      const res = await apiRequest("POST", "/api/weddings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings"] });
    },
  });
}

export function useUpdateWeddingMutation() {
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Wedding>) => {
      const res = await apiRequest("PATCH", `/api/weddings/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings"] });
    },
  });
}

export function useWeddingStatsQuery(weddingId: string | null) {
  return useQuery<{
    guests: { total: number; going: number; not_going: number; maybe: number; pending: number };
    tasks: { total: number; completed: number; overdue: number };
    budget: { total_budget: number; total_spent: number; total_planned: number };
  }>({
    queryKey: ["/api/weddings", weddingId, "stats"],
    enabled: !!weddingId,
  });
}

export function useGuestsQuery(weddingId: string | null) {
  return useQuery<Array<{
    id: string;
    name: string;
    phone?: string;
    email?: string;
    side: string;
    group?: string;
    rsvp_status: string;
  }>>({
    queryKey: ["/api/weddings", weddingId, "guests"],
    enabled: !!weddingId,
  });
}

export function useCreateGuestMutation() {
  return useMutation({
    mutationFn: async ({ weddingId, ...data }: { weddingId: string; name: string; side: string; phone?: string; email?: string; group?: string; rsvp_status?: string }) => {
      const res = await apiRequest("POST", `/api/weddings/${weddingId}/guests`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "guests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "stats"] });
    },
  });
}

export function useUpdateGuestMutation() {
  return useMutation({
    mutationFn: async ({ id, weddingId, ...data }: { id: string; weddingId: string } & Record<string, unknown>) => {
      const res = await apiRequest("PATCH", `/api/guests/${id}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "guests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "stats"] });
    },
  });
}

export function useDeleteGuestMutation() {
  return useMutation({
    mutationFn: async ({ id }: { id: string; weddingId: string }) => {
      await apiRequest("DELETE", `/api/guests/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "guests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "stats"] });
    },
  });
}

export function useEventsQuery(weddingId: string | null) {
  return useQuery<Array<{
    id: string;
    name: string;
    date_time: string;
    location: string;
    notes?: string;
  }>>({
    queryKey: ["/api/weddings", weddingId, "events"],
    enabled: !!weddingId,
  });
}

export function useCreateEventMutation() {
  return useMutation({
    mutationFn: async ({ weddingId, ...data }: { weddingId: string; name: string; date_time: string; location: string; notes?: string }) => {
      const res = await apiRequest("POST", `/api/weddings/${weddingId}/events`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "events"] });
    },
  });
}

export function useUpdateEventMutation() {
  return useMutation({
    mutationFn: async ({ id, weddingId, ...data }: { id: string; weddingId: string } & Record<string, unknown>) => {
      const res = await apiRequest("PATCH", `/api/events/${id}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "events"] });
    },
  });
}

export function useDeleteEventMutation() {
  return useMutation({
    mutationFn: async ({ id }: { id: string; weddingId: string }) => {
      await apiRequest("DELETE", `/api/events/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "events"] });
    },
  });
}

export function useTasksQuery(weddingId: string | null) {
  return useQuery<Array<{
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    status: string;
    assignee_name?: string;
    linked_event?: string;
  }>>({
    queryKey: ["/api/weddings", weddingId, "tasks"],
    enabled: !!weddingId,
  });
}

export function useCreateTaskMutation() {
  return useMutation({
    mutationFn: async ({ weddingId, ...data }: { weddingId: string; title: string; description?: string; due_date?: string; status?: string; assignee_name?: string; linked_event?: string }) => {
      const res = await apiRequest("POST", `/api/weddings/${weddingId}/tasks`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "stats"] });
    },
  });
}

export function useUpdateTaskMutation() {
  return useMutation({
    mutationFn: async ({ id, weddingId, ...data }: { id: string; weddingId: string } & Record<string, unknown>) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "stats"] });
    },
  });
}

export function useDeleteTaskMutation() {
  return useMutation({
    mutationFn: async ({ id }: { id: string; weddingId: string }) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "stats"] });
    },
  });
}

export function useBudgetQuery(weddingId: string | null) {
  return useQuery<Array<{
    id: string;
    category: string;
    planned: number;
    actual: number;
  }>>({
    queryKey: ["/api/weddings", weddingId, "budget"],
    enabled: !!weddingId,
  });
}

export function useCreateBudgetItemMutation() {
  return useMutation({
    mutationFn: async ({ weddingId, ...data }: { weddingId: string; category: string; planned: number; actual?: number }) => {
      const res = await apiRequest("POST", `/api/weddings/${weddingId}/budget`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "budget"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "stats"] });
    },
  });
}

export function useUpdateBudgetItemMutation() {
  return useMutation({
    mutationFn: async ({ id, weddingId, ...data }: { id: string; weddingId: string } & Record<string, unknown>) => {
      const res = await apiRequest("PATCH", `/api/budget/${id}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "budget"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "stats"] });
    },
  });
}

export function useDeleteBudgetItemMutation() {
  return useMutation({
    mutationFn: async ({ id }: { id: string; weddingId: string }) => {
      await apiRequest("DELETE", `/api/budget/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "budget"] });
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "stats"] });
    },
  });
}

export function useTeamQuery(weddingId: string | null) {
  return useQuery<Array<{
    id: string;
    user_id?: string;
    role: string;
    name: string;
    email: string;
  }>>({
    queryKey: ["/api/weddings", weddingId, "team"],
    enabled: !!weddingId,
  });
}

export function useCreateTeamMemberMutation() {
  return useMutation({
    mutationFn: async ({ weddingId, ...data }: { weddingId: string; name: string; email: string; role: string; user_id?: string }) => {
      const res = await apiRequest("POST", `/api/weddings/${weddingId}/team`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "team"] });
    },
  });
}

export function useUpdateTeamMemberMutation() {
  return useMutation({
    mutationFn: async ({ id, weddingId, ...data }: { id: string; weddingId: string } & Record<string, unknown>) => {
      const res = await apiRequest("PATCH", `/api/team/${id}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "team"] });
    },
  });
}

export function useDeleteTeamMemberMutation() {
  return useMutation({
    mutationFn: async ({ id }: { id: string; weddingId: string }) => {
      await apiRequest("DELETE", `/api/team/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/weddings", variables.weddingId, "team"] });
    },
  });
}
