export type Platform = "linkedin" | "x" | "reddit" | "threads";

export type StampStatus = "pending" | "writing" | "ready" | "flagged" | "posted" | "approved";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  problem: string | null;
  stack: string[] | null;
  status: string;
  demo_url: string | null;
  repo_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface NarrativeArc {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface StampState {
  platform: Platform;
  status: StampStatus;
  draft_id: string | null;
  critic_score: number | null;
  critic_note: string | null;
}

export interface Dispatch {
  id: string;
  project_id: string;
  project_name: string;
  arc_id: string | null;
  arc_name: string | null;
  body: string;
  source: string;
  is_post_worthy: boolean | null;
  hold_reason: string | null;
  angle: string | null;
  suggested_platforms: Platform[] | null;
  avoid_topics: string[] | null;
  created_at: string;
  updated_at: string;
  stamps: StampState[];
}

export interface Draft {
  id: string;
  dispatch_id: string;
  platform: Platform;
  body: string;
  reddit_title: string | null;
  reddit_subreddit: string | null;
  generation: number;
  critic_score: number | null;
  critic_note: string | null;
  status: string;
  scheduled_at: string | null;
  posted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VoiceProfile {
  id: string;
  platform: string;
  body: string;
  version: number;
  is_active: boolean;
  generated_at: string;
}

export interface StampEvent {
  platform: Platform;
  status: StampStatus | "error";
  draft_id?: string | null;
  critic_score?: number | null;
  critic_note?: string | null;
  message?: string;
}
