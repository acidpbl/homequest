import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  type Timestamp,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { getAuth } from "firebase/auth";
import { Mission } from "@/types/Mission";
import Button from "@/components/Button";
import PopUp from "@/components/PopUp";
import { twMerge } from "tailwind-merge";
import { Clock, CheckCircle, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { DocumentData } from "firebase-admin/firestore";

const Dashboard = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [animatingCheck, setAnimatingCheck] = useState<string | null>(null);
  const [missionToComplete, setMissionToComplete] = useState<string | null>(
    null
  );
  const [missionToDelete, setMissionToDelete] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<DocumentData | null>(null);

  const fetchMissions = async () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        const q = query(
          collection(db, "missions"),
          where("assignedTo", "array-contains", user.uid)
        );

        const querySnapshot = await getDocs(q);

        const missionsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Mission[];

        const now = new Date();
        const updates = missionsList.map(async (mission) => {
          if (mission.status === "pendente" && mission.dueDate.toDate() < now) {
            const missionRef = doc(db, "missions", mission.id);
            await updateDoc(missionRef, { status: "expirada" });

            return { ...mission, status: "expirada" as Mission["status"] };
          }
          return mission;
        });

        const updatedMissions = await Promise.all(updates);
        setMissions(updatedMissions);
      } catch (error) {
        console.error("Erro ao buscar missões:", error);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const completeMission = async () => {
    if (!missionToComplete) return;

    setAnimatingCheck(missionToComplete);
    try {
      const missionRef = doc(db, "missions", missionToComplete);
      await updateDoc(missionRef, {
        status: "concluída",
      });
      setMissions((prevMissions) =>
        prevMissions.map((mission) =>
          mission.id === missionToComplete
            ? { ...mission, status: "concluída" }
            : mission
        )
      );
    } catch (error) {
      console.error("Erro ao completar a missão:", error);
    } finally {
      setTimeout(() => {
        setAnimatingCheck(null);
        setMissionToComplete(null);
      }, 2000);
    }
  };

  const deleteMission = async (missionId: string) => {
    if (!missionToDelete) return;

    setAnimatingCheck(missionToDelete);

    try {
      const missionRef = doc(db, "missions", missionId);
      await deleteDoc(missionRef);

      alert("Missão excluída com sucesso!");

      fetchMissions();
    } catch (error) {
      console.error("Erro ao apagar missão:", error);
      alert("Erro ao excluir missão. Tente novamente.");
    } finally {
      setTimeout(() => {
        setAnimatingCheck(null);
        setMissionToDelete(null);
      }, 2000);
    }
  };

  if (loading) {
    return <p>Carregando missões...</p>;
  }

  const formatDate = (date: Timestamp) => {
    const dueDate = date.toDate();
    const day = dueDate.getDate().toString().padStart(2, "0");
    const month = (dueDate.getMonth() + 1).toString().padStart(2, "0");
    const year = dueDate.getFullYear();
    const hours = dueDate.getHours().toString().padStart(2, "0");
    const minutes = dueDate.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="bg-violet-100 h-screen max-h-screen flex flex-col">
      <div className="py-8 px-12 bg-violet-400">
        <h1 className="text-2xl font-bold text-violet-950">Missões</h1>
      </div>
      <div className="py-8 px-12 size-full bg-violet-200">
        {missions.length > 0 ? (
          <ul className="flex gap-2 flex-wrap">
            {missions.map((mission) => (
              <li
                key={mission.id}
                className={twMerge(
                  "p-4 border-2 w-fit min-w-96 max-w-120 rounded overflow-hidden gap-1 flex flex-col",
                  mission.status === "concluída"
                    ? "border-green-600 bg-green-100"
                    : "",
                  mission.status === "pendente"
                    ? "border-violet-800 bg-violet-200"
                    : "",
                  mission.status === "expirada"
                    ? "border-red-800 bg-red-200"
                    : ""
                )}
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-xl capitalize">
                    {mission.title}
                  </h2>
                  <div className="flex gap-2">
                    <span
                      className={`text-sm leading-[22px] ${
                        mission.status === "concluída"
                          ? "rounded bg-green-600 text-white px-2 py-1"
                          : ""
                      }
                    ${
                      mission.status === "pendente"
                        ? "rounded bg-amber-500 text-black px-2 py-1"
                        : ""
                    }
                    ${
                      mission.status === "expirada"
                        ? "rounded bg-red-500 text-white px-2 py-1"
                        : ""
                    }`}
                    >
                      {mission.status && mission.status}{" "}
                      {mission.status && mission.points ? "|" : ""}{" "}
                      {mission.points > 0 &&
                        `${mission.status !== "expirada" ? "+" : ""} ${
                          mission.points
                        } pt${mission.points > 1 && "s"}`}
                    </span>
                    {userData!.isAdmin && (
                      <Button
                        variant="danger"
                        placeholder={
                          <Trash size={16} fill="white" stroke="white" />
                        }
                        click={() => {
                          setMissionToDelete(mission.id);
                          setPopupOpen(true);
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="text-ellipsis">{mission.description}</p>

                  <div className="flex justify-between items-end">
                    <span
                      className={twMerge(
                        "text-sm flex gap-2 items-center",
                        mission.status === "concluída"
                          ? "line-through"
                          : mission.status === "expirada"
                          ? "text-red-500"
                          : ""
                      )}
                    >
                      <Clock className="size-4" />
                      {formatDate(mission.dueDate)}
                    </span>
                    {mission.status === "concluída" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                      >
                        <CheckCircle className="size-8 text-green-600" />
                      </motion.div>
                    ) : mission.status === "pendente" ? (
                      <Button
                        variant="primary"
                        placeholder="Completar Missão"
                        styling="place-self-end"
                        click={() => {
                          setMissionToComplete(mission.id);
                          setPopupOpen(true);
                        }}
                        disabled={animatingCheck === mission.id}
                      />
                    ) : (
                      <Button
                        variant="secondary"
                        placeholder="Missão Expirada"
                        styling="place-self-end bg-red-300 text-red-600 hover:bg-red-300 hover:text-red-600 opacity-50"
                        disabled
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Não há missões atribuídas a você!</p>
        )}
      </div>
      {missionToComplete && (
        <PopUp
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          title={`Deseja concluir a missão "${
            missions.find((mission) => mission.id === missionToComplete)
              ?.title || ""
          }"?`}
          description={`Ao confirmar, a missão "${
            missions.find((mission) => mission.id === missionToComplete)
              ?.title || ""
          }" será concluída e você não poderá alterar.\nTem certeza que deseja continuar?`}
        >
          <div className="flex gap-4 items-center justify-center">
            <Button
              placeholder="Confirmar"
              variant="primary"
              click={completeMission}
            />
            <Button
              placeholder="Cancelar"
              variant="danger"
              click={() => setPopupOpen(false)}
            />
          </div>
        </PopUp>
      )}
      {missionToDelete && (
        <PopUp
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          title={`Deseja apagar a missão "${
            missions.find((mission) => mission.id === missionToDelete)?.title ||
            ""
          }"?`}
          description={`Ao confirmar, a missão "${
            missions.find((mission) => mission.id === missionToDelete)?.title ||
            ""
          }" será apagada e você não poderá alterar.\nTem certeza que deseja continuar?`}
        >
          <div className="flex gap-4 items-center justify-center">
            <Button
              placeholder="Confirmar"
              variant="primary"
              click={() => deleteMission(missionToDelete)}
            />
            <Button
              placeholder="Cancelar"
              variant="danger"
              click={() => setPopupOpen(false)}
            />
          </div>
        </PopUp>
      )}
    </div>
  );
};

export default Dashboard;
