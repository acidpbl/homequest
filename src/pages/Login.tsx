import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { useEffect, useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Separator from "@/components/Separator";
import { useAuth } from "@/contexts/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Erro ao fazer login. Verifique seus dados.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      setError("Erro ao fazer login com Google.");
    }
  };

  const handleRegister = async () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-violet-200">
      <h1 className="text-2xl font-bold mb-4 text-violet-800">Login</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleEmailLogin}
        className="flex flex-col gap-2 min-w-96"
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="primary"
          type="submit"
          placeholder="Entrar"
          styling="justify-center"
        />
      </form>

      <Separator placeholder="ou" styling="w-96" />

      <Button
        variant="secondary"
        placeholder={"Entrar com Google"}
        click={handleGoogleLogin}
        styling="w-96 justify-center"
      />

      <Separator placeholder="Não tem conta?" styling="w-96" />

      <Button
        variant="primary"
        placeholder="Registre-se"
        click={handleRegister}
        styling="w-96 justify-center"
      />
    </div>
  );
};

export default Login;
