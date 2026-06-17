import type {
  Dispatch,
  Draft,
  NarrativeArc,
  Project,
  StampEvent,
  VoiceProfile,
} from "./types";

const API_BASE = (import.meta.env.VITE_BYLINE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getApiBaseUrl() {
  return API_BASE;
}

export function getProjects() {
  return request<Project[]>("/projects");
}

export function getNarrativeArcs() {
  return request<NarrativeArc[]>("/narrative-arcs");
}

export function getDispatches() {
  return request<Dispatch[]>("/dispatches");
}

export function getDrafts(dispatchId: string) {
  return request<Draft[]>(`/dispatches/${dispatchId}/drafts`);
}

export function createDispatch(payload: { project_id: string; arc_id: string | null; body: string }) {
  return request<Dispatch>("/dispatches", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function patchDraft(
  draftId: string,
  payload: { body?: string; status?: string },
) {
  return request<Draft>(`/drafts/${draftId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getVoiceProfile(): Promise<VoiceProfile | null> {
  try {
    return await request<VoiceProfile>("/voice-profile");
  } catch {
    return null;
  }
}

export function openGenerationStream(
  dispatchId: string,
  handlers: {
    onMessage: (event: StampEvent) => void;
    onClose: () => void;
    onError: (error: Event) => void;
  },
) {
  const source = new EventSource(`${API_BASE}/dispatches/${dispatchId}/generate`);
  source.onmessage = (message) => {
    const payload = JSON.parse(message.data) as StampEvent;
    handlers.onMessage(payload);
  };
  source.onerror = (error) => {
    source.close();
    handlers.onError(error);
  };
  return source;
}
