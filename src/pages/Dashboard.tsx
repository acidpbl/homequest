import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Mission } from "@/types/Mission";
import Button from "@/components/Button";
import { twMerge } from "tailwind-merge";

const Dashboard = () => {
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      const querySnapshot = await getDocs(collection(db, "missions"));
      const missionsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Mission[];

      setMissions(missionsList);
    };

    fetchMissions();
  }, []);

  // ✅ Função para completar missão
  const completeMission = async (missionId: string) => {
    try {
      const missionRef = doc(db, "missions", missionId);
      await updateDoc(missionRef, {
        status: "concluída",
      });

      // Atualiza o estado localmente
      setMissions((prevMissions) =>
        prevMissions.map((mission) =>
          mission.id === missionId
            ? { ...mission, status: "concluída" }
            : mission
        )
      );
    } catch (error) {
      console.error("Erro ao completar a missão:", error);
    }
  };

  return (
    <div className="bg-violet-100 h-screen max-h-screen flex flex-col">
      <div className="py-8 px-12 bg-violet-400">
        <h1 className="text-2xl font-bold text-violet-950">Missões</h1>
      </div>
      <div className="py-8 px-12 size-full bg-violet-200">
        {missions.length > 0 ? (
          <ul>
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
                  <span
                    className={`text-sm ${
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
                    {mission.status && mission.points && "|"}{" "}
                    {mission.points &&
                      `${mission.status !== "expirada" ? "+" : ""} ${
                        mission.points
                      } pontos`}
                  </span>
                </div>

                <div className="flex flex-col">
                  <p className="text-ellipsis">{mission.description}</p>

                  {mission.status === "concluída" ? (
                    <Button
                      variant="secondary"
                      placeholder="Missão Concluída"
                      styling="place-self-end bg-green-300 text-green-600 hover:bg-green-300 hover:text-green-600 opacity-50"
                      disabled
                    />
                  ) : mission.status === "pendente" ? (
                    <Button
                      variant="primary"
                      placeholder="Completar Missão"
                      styling="place-self-end"
                      click={() => completeMission(mission.id)}
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
              </li>
            ))}
          </ul>
        ) : (
          <p>Não há missões disponíveis!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
