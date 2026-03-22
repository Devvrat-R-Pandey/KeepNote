export type Status = "yet-to-start" | "in-progress" | "completed";

export type Priority = "high" | "medium" | "low";

export interface Note {
  id: number;
  title: string;
  description: string;
  status: Status;
  category: string;
  priority?: Priority;
}
