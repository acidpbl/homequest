import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { Scroll, LogOut, User } from "lucide-react";
import Button from "./Button";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <aside className="h-screen w-64 bg-violet-800 text-white flex flex-col px-4 py-8 items-center">
      <h1 className="text-xl font-bold pb-8">HomeQuest</h1>

      <nav className="flex w-10/12 h-full">
        <ul className="w-full flex flex-col gap-2">
          <Link to="/dashboard" className="outline-amber-500">
            <li className="flex gap-4 items-center pl-4 w-full rounded bg-transparent hover:bg-violet-700 transition-colors ease-linear p-2">
              <Scroll size={20} /> Missões
            </li>
          </Link>
          <Link to="/profile" className="outline-amber-500">
            <li className="flex gap-4 items-center pl-4 w-full rounded bg-transparent hover:bg-violet-700 transition-colors ease-linear p-2">
              <User size={20} /> Perfil
            </li>
          </Link>
        </ul>
      </nav>

      <Button
        variant="danger"
        click={handleLogout}
        styling="w-10/12 pl-4"
        placeholder={
          <>
            <LogOut size={20} />
            Sair
          </>
        }
      />
    </aside>
  );
};

export default Sidebar;
