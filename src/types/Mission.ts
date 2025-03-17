import type { Timestamp } from "firebase/firestore";

export type MissionStatus = "pendente" | "concluída" | "expirada";

export type Mission = {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  createdAt: Timestamp;
  dueDate: Timestamp;
  status: MissionStatus;
  points: number;
  category?: "limpeza" | "contas" | "geral";
  completedBy?: string;
};
