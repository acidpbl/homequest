export type MissionStatus = "pendente" | "concluída" | "expirada";

export type Mission = {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  createdAt: Date;
  dueDate: Date;
  status: MissionStatus;
  points: number;
  category?: string;
  completedBy?: string;
}
