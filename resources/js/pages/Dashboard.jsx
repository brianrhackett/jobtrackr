import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mt-5">
      <h2>Welcome, {user?.name} 👋</h2>

      <button className="btn btn-outline-danger mt-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
