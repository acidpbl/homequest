import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import type { User } from "@/types/User";
import type { AuthContextType } from "@/types/AuthContext";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistência ativada!");
  })
  .catch((error) => {
    console.error("Erro ao definir persistência:", error);
  });

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let userData = await getUserFromFirestore(firebaseUser.uid);

          if (!userData) {
            // Se o usuário não existir no Firestore, crie um novo registro
            userData = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "Novo Usuário",
              email: firebaseUser.email || "",
              avatar: firebaseUser.photoURL || "",
              points: 0,
              createdAt: new Date().toISOString(),
              isAdmin: false,
            };
            await setDoc(doc(db, "users", firebaseUser.uid), userData);
          }

          setUser(userData);
        } catch (error) {
          console.error("Erro ao buscar/criar usuário no Firestore:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve estar dentro de um AuthProvider");
  }
  return context;
};

const getUserFromFirestore = async (uid: string): Promise<User | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.warn("Usuário não encontrado no Firestore:", uid);
      return null;
    }
    return userSnap.data() as User;
  } catch (error) {
    console.error("Erro ao buscar usuário no Firestore:", error);
    return null;
  }
};
