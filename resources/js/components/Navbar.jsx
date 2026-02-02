import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
	const { user, logout, loading } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login", { replace: true });
		} catch (e) {
			console.error("Logout failed:", e);
		}
	};

	return (
		<nav className="navbar navbar-expand navbar-light bg-light border-bottom">
			<div className="container">
				<Link className="navbar-brand fw-bold" to={user ? "/dashboard" : "/login"}>
					JobTrackr
				</Link>

				<div className="d-flex" id="mainNav">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						{!loading && user && (
							<li className="nav-item">
								<NavLink className="nav-link" to="/dashboard">
									Dashboard
								</NavLink>
							</li>
						)}
					</ul>

					<ul className="navbar-nav ms-auto">
						{!loading && !user && (
							<>
								<li className="nav-item">
									<NavLink className="nav-link" to="/login">
										Login
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink className="nav-link" to="/register">
										Register
									</NavLink>
								</li>
							</>
						)}

						{!loading && user && (
							<>
								<li className="nav-item">
									<NavLink className="nav-link text-danger" onClick={handleLogout}>
										Logout
									</NavLink>
								</li>
							</>
						)}
					</ul>
				</div>
				
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#mainNav"
					aria-controls="mainNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>
				
			</div>
		</nav>
	);
}
