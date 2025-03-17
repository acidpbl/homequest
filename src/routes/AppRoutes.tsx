import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Redirecionamento caso a rota não exista */}
        <Route path="*" element={user ? <Dashboard /> : <Login />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
