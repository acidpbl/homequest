import { User } from "@/types/User";

export type AuthContextType = {
  user: User | null;
  logout: () => Promise<void>;
};
