import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="py-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
