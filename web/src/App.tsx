import "./styles/load-fonts";
import "./styles/global.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Providers } from "./Providers";

import { HomePage } from "./pages/home/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { useAuthState } from "./stores/auth-store";
import {
  ForgetPasswordEmailSentPage,
  ForgetPasswordPage
} from "./pages/auth/ForgetPassword";
import {
  ResetPasswordCompletedPage,
  ResetPasswordPage
} from "./pages/auth/ResetPassword";
import { Scratch } from "./pages/_scratch/Scratch";
import { CoreApp } from "./pages/app/CoreApp";
import { LogoutHandler } from "./pages/auth/LogoutHandler";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { SignUpCompletedPage } from "./pages/auth/SignUpCompletedPage";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { useEffect, useLayoutEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

function Protect({ children }) {
  const { token } = useAuthState();
  if (!token) {
    return <Navigate to='/auth/login' replace />;
  } else {
    return children;
  }
}

function ResetUserQueries() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();
  useLayoutEffect(() => {
    queryClient.resetQueries();
  }, [token]);
  return null;
}

export function App() {
  return (
    <Providers>
      <ResetUserQueries />
      <BrowserRouter>
        {/* prettier-ignore */}
        <Routes>
          <Route path='/s' element={<Scratch />} />
          <Route path='/' element={<HomePage />} />
          <Route path="/auth">
            <Route path='sign-up' element={<SignUpPage />} />
            <Route path='sign-up/done' element={<SignUpCompletedPage />} />
            <Route path='verify/:userId/:token' element={<VerifyEmail />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='logout' element={<LogoutHandler />} />
            <Route path='forget-password' element={<ForgetPasswordPage />} />
            <Route path='forget-password/sent' element={<ForgetPasswordEmailSentPage />} />
            <Route path='reset-password/:userId/:token' element={<ResetPasswordPage />} />
            <Route path='reset-password/done' element={<ResetPasswordCompletedPage />} />
          </Route>
          <Route
            path='/app/*'
            element={
              <Protect>
                <CoreApp />
              </Protect>
            }
          />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
