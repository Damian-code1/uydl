export type RecordStatus = "PENDING" | "APPROVED" | "REJECTED";

export type DemonLevel = {
  id: string;
  rank: number;
  name: string;
  creator: string;
  videoUrl: string;
  description: string;
  points: number;
  victors: string[];
};
