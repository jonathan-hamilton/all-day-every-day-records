import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Releases from "./pages/Releases";
import Admin from "./pages/Admin";
import TripleX from "./pages/TripleX";
import RansomNote from "./pages/RansomNote";
import MainLayout from "./layouts/MainLayout";
import { JSX } from "react";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ReleaseDetail from "./pages/ReleaseDetail";
import ChangePassword from "./pages/ChangePassword";

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/releases" element={<Releases />} />
        <Route path="/triple-x" element={<TripleX />} />
        <Route path="/ransom-note" element={<RansomNote />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/releases/:id" element={<ReleaseDetail />} />
      </Route>
    </Routes>
  );
}
