import "./bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap JS (dropdowns, etc.) optional but usually fine

import React from "react";
import { createRoot } from "react-dom/client";
import AppMain from "./AppMain"; // router component
import { AuthProvider } from "./context/AuthContext";

const el = document.getElementById("app");

if (el) {
	createRoot(el).render(
		<React.StrictMode>
			<AuthProvider>
				<AppMain />
			</AuthProvider>
		</React.StrictMode>
	);
}
