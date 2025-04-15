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
import { OAuthSuccess } from "./pages/auth/OAuthSuccess";

function ResetUserQueries() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();
  useLayoutEffect(() => {
    queryClient.resetQueries();
  }, [token]);
  return null;
}

/* The child page is accessible only when the user is logged in */
function Protect({ children }) {
  const { token } = useAuthState();
  if (!token) {
    return <Navigate to='/auth/login' replace />;
  } else {
    return children;
  }
}

/* The child page is accessible only when the user is logged out */
function NoLogin({ children }) {
  const { token } = useAuthState();
  if (token) {
    return <Navigate to='/app' replace />;
  } else {
    return children;
  }
}

export function App() {
  return (
    <Providers>
      <ResetUserQueries />
      <BrowserRouter>
        {/* prettier-ignore */}
        <Routes>
          <Route path='/s' element={<Scratch />} />
          <Route path='' element={<HomePage />} />
          <Route path="/auth">
            <Route
              path='sign-up'
              element={<NoLogin><SignUpPage /></NoLogin>}
            />
            <Route
              path='sign-up/done'
              element={<NoLogin><SignUpCompletedPage /></NoLogin>}
            />
            <Route
              path='verify/:userId/:token'
              element={<NoLogin><VerifyEmail /></NoLogin>}
            />
            <Route
              path='login'
              element={<NoLogin><LoginPage /></NoLogin>}
            />
            <Route
              path='oauth-success/:token'
              element={<OAuthSuccess />}
            />
            <Route
              path='logout'
              element={<LogoutHandler />}
            />
            <Route
              path='forget-password'
              element={<NoLogin><ForgetPasswordPage /></NoLogin>}
            />
            <Route
              path='forget-password/sent'
              element={<NoLogin><ForgetPasswordEmailSentPage /></NoLogin>}
            />
            <Route
              path='reset-password/:userId/:token'
              element={<NoLogin><ResetPasswordPage /></NoLogin>}
            />
            <Route
              path='reset-password/done'
              element={<NoLogin><ResetPasswordCompletedPage /></NoLogin>}
            />
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
