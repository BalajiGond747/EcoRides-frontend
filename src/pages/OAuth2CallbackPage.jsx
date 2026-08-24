import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";
import { setToken, setCurrentUser } from "../services/auth";

const OAuth2CallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasExchanged = useRef(false);

  useEffect(() => {
    if (hasExchanged.current) {
      return;
    }

    hasExchanged.current = true;

    const exchangeCode = async () => {
      const code = searchParams.get("code");

      if (!code) {
        toast.error("Google login failed");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await api.post(
          `/auth/oauth2/exchange?code=${encodeURIComponent(code)}`
        );

        const authData = response.data?.data;

        if (!authData?.token) {
          throw new Error("Authentication token was not received");
        }

        setToken(authData.token);

        setCurrentUser({
          userId: authData.userId,
          email: authData.email,
          userRole: authData.userRole,
        });

        toast.success("Google login successful");

        if (authData.userRole === "ADMIN") {
          navigate("/admin/dashboard", {
            replace: true,
          });
        } else {
          navigate("/", {
            replace: true,
          });
        }
      } catch (error) {
        console.error("Google login error:", error);

        toast.error(error.response?.data?.message || "Google login failed");

        navigate("/login", {
          replace: true,
        });
      }
    };

    exchangeCode();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />

        <p className="mt-4 text-gray-700 font-medium">
          Completing Google login...
        </p>
      </div>
    </div>
  );
};

export default OAuth2CallbackPage; 
