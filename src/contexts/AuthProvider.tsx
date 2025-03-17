import {
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 🔹 Adiciona estado de loading

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log("Persistência ativada!"))
      .catch((error) => console.error("Erro ao definir persistência:", error));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let userData = await getUserFromFirestore(firebaseUser.uid);

          // Se o usuário não for encontrado no Firestore, cria um novo
          if (!userData) {
            userData = await createUserInFirestore(
              firebaseUser.uid,
              firebaseUser.email ? firebaseUser.email : ""
            );
          }

          setUser(userData);
        } catch (error) {
          console.error("Erro ao buscar ou criar usuário no Firestore:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false); // 🔹 Somente agora o loading é desativado
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          Carregando...
        </div>
      ) : (
        children
      )}
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

// Função para criar o usuário no Firestore
const createUserInFirestore = async (
  uid: string,
  email: string
): Promise<User> => {
  try {
    const userRef = doc(db, "users", uid);
    const newUser = {
      uid,
      email,
      points: 0, // ou outros dados iniciais
      name: "", // ou outro campo
      createdAt: new Date().toISOString(),
      isAdmin: false,
    };

    // Cria o usuário no Firestore
    await setDoc(userRef, newUser);
    console.log("Usuário criado no Firestore:", uid);

    return newUser;
  } catch (error) {
    console.error("Erro ao criar usuário no Firestore:", error);
    throw new Error("Não foi possível criar o usuário no Firestore.");
  }
};
