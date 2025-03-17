import { User } from "@/types/User";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};
