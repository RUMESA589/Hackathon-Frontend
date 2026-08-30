import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/controllers/AuthController";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/Toaster";
import HomePage from "@/views/HomePage";
import LoginPage from "@/views/LoginPage";
import RegisterPage from "@/views/RegisterPage";
import StudentDashboardPage from "@/views/StudentDashboardPage";
import CreateTicketPage from "@/views/CreateTicketPage";
import TicketDetailPage from "@/views/TicketDetailPage";
import WorkerDashboardPage from "@/views/WorkerDashboardPage";
import WorkerVerifyPage from "@/views/WorkerVerifyPage";
import AdminDashboardPage from "@/views/AdminDashboardPage";
import ForgotPasswordPage from "@/views/ForgotPasswordPage";
import ResetPasswordPage from "@/views/ResetPasswordPage";
import WorkersPage from "@/views/WorkersPage";
import "@/index.css";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const content = (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<StudentDashboardPage />} />
        <Route path="/create-ticket" element={<CreateTicketPage />} />
        <Route path="/ticket/:id" element={<TicketDetailPage />} />
        <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />
        <Route path="/worker/verify" element={<WorkerVerifyPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
  return googleClientId ? <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider> : content;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>
);
