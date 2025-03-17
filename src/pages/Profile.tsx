import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthProvider";
import { db } from "@/services/firebase";
import { Crown } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setPoints(userSnap.data().points || 0);
        }
      }
    };

    fetchUserPoints();
  }, [user]);

  if (!user) {
    return <p className="text-center text-red-500">Usuário não autenticado.</p>;
  }

  return (
    <div className="flex flex-col px-12 py-8 bg-violet-200 h-screen">
      <div className="flex gap-4">
        <img
          src={user.avatar || "https://i.imgur.com/uZ117ol.jpeg"}
          alt="Avatar"
          className="w-48 h-48 rounded-md"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold flex gap-2 items-center">
            {user.name || "Usuário"}
            {user.isAdmin ? (
              <Crown size={20} fill="#7f22fe" stroke="#7f22fe" />
            ) : (
              ""
            )}
          </h1>
          <p className="text-violet-400">{user.email}</p>
          <p className="text-lg font-semibold text-violet-600">
            Pontos: {points}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
