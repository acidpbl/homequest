import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/SelectMenu";
import type { User } from "@/types/User";

export default function Admin() {
  const [title, setTitle] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));

        const usersList = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        })) as User[];

        setUsers(usersList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleAddMission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !dueDate || !selectedUser || !category) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // Verificar se a missão já existe (título, categoria, data de vencimento e alvo)
      const missionsRef = collection(db, "missions");
      const q = query(
        missionsRef,
        where("title", "==", title),
        where("category", "==", category),
        where("dueDate", "==", Timestamp.fromDate(new Date(dueDate))),
        where("assignedTo", "array-contains", selectedUser)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert(
          "Já existe uma missão com esse título, categoria, data de vencimento e alvo."
        );
        setLoading(false);
        return;
      }

      // Adicionar missão se não existir
      const dueDateTimestamp = Timestamp.fromDate(
        new Date(`${dueDate}T00:00:00`)
      );

      await addDoc(missionsRef, {
        title,
        description,
        dueDate: dueDateTimestamp,
        status: "pendente",
        createdAt: Timestamp.now(),
        points,
        assignedTo: [selectedUser],
        category,
      });

      // Resetando os campos após a missão ser adicionada
      setTitle("");
      setDescription("");
      setDueDate("");
      setSelectedUser("");
      setCategory("");
      setPoints(0);

      alert("Missão adicionada com sucesso!");
      navigate("/admin");
    } catch (error) {
      console.error("Erro ao adicionar missão:", error);
      alert("Erro ao adicionar missão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map((user) => ({
    placeholder: user.name,
    value: user.uid,
    icon: user.avatar || "user-filled",
  }));

  const categoryOptions = [
    { placeholder: "Limpeza", value: "limpeza" },
    { placeholder: "Contas", value: "contas" },
    { placeholder: "Geral", value: "geral" },
  ];

  return (
    <div className="bg-violet-100 h-screen max-h-screen flex flex-col">
      <div className="py-8 px-12 bg-violet-400">
        <h1 className="text-2xl font-bold text-violet-950">Admin</h1>
      </div>

      <div className="py-8 px-12 bg-violet-200 flex flex-col gap-6 h-full">
        <h2 className="text-xl font-semibold">Adicionar Missão</h2>

        <form onSubmit={handleAddMission} className="flex flex-col gap-4 w-fit">
          <div className="flex justify-between gap-4 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-violet-950">
                Título
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da missão"
                required
                styling="w-full"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-violet-950">
                Pontos
              </label>
              <Input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                placeholder="Pontos"
                required
                styling="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-violet-950">
              Descrição
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              styling="w-full resize-none"
              placeholder="Descrição da missão"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-4 justify-between">
            <div>
              <label className="block text-sm font-medium text-violet-950">
                Data de Vencimento
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                styling="w-fit"
              />
            </div>{" "}
            <div>
              <label className="block text-sm font-medium text-violet-950">
                Categoria
              </label>
              <Select
                options={categoryOptions}
                change={(value) => setCategory(value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-violet-950">
                Missão para
              </label>
              <Select
                options={userOptions}
                change={(value) => setSelectedUser(value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 py-2 px-4 bg-violet-600 text-white rounded hover:bg-violet-700"
            disabled={loading}
          >
            {loading ? "Adicionando..." : "Adicionar Missão"}
          </button>
        </form>
      </div>
    </div>
  );
}
