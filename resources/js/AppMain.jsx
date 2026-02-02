import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

function AppMain() {
	const { user } = useAuth();

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					{/* Root */}
					<Route
						path="/"
						element={
							<GuestRoute>
								<Navigate to="/login" replace />
							</GuestRoute>
						}
					/>

					{/* Guest-only routes */}
					<Route
						path="/login"
						element={
							<GuestRoute>
								<Login />
							</GuestRoute>
						}
					/>

					<Route
						path="/register"
						element={
							<GuestRoute>
								<Register />
							</GuestRoute>
						}
					/>

					{/* Protected routes */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default AppMain;
