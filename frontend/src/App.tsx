import React, { useState, useEffect } from "react";
import { getBudgetData } from "./utils/storage";
import SetupWizard from "./components/setup/SetupWizard";
import Dashboard from "./components/dashboard/Dashboard";
import SettingsPage from "./components/settings/SettingsPage";
import { Download, Settings } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { BeforeInstallPromptEvent } from "./types";
import { getSheetData, addCategory } from "./services/sheets";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./context/AuthContext";

export interface GoogleUserType {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string; // Google's user identifier
  iat: number;
  exp: number;
}

const GOOGLE_CLIENT_ID =
  "776061667159-0gqeif4drpfdv14uah9b0j58jlq7svc6.apps.googleusercontent.com";

function App() {
  const { isAuthenticated, login, user } = useAuth();
  const [setupComplete, setSetupComplete] = useState<boolean | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [defferedPrompt, setDefferedPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      setDefferedPrompt(e);
    });

    const data = getBudgetData();
    setSetupComplete(data.setupComplete);

    // Check if the user is already authenticated
    const token = localStorage.getItem('googleToken');
    if (token) {
      try {
        const decodedUser: GoogleUserType = jwtDecode(token);
        const userData = {
          email: decodedUser.email,
          name: decodedUser.name,
          picture: decodedUser.picture,
          sub: decodedUser.sub,
        };
        login(userData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Invalid token, clear it
        localStorage.removeItem('googleToken');
      }
    }
    
    setIsLoading(false);
  }, [login]);

  useEffect(() => {
    // Only fetch data if the user is authenticated
    if (isAuthenticated) {
      // Example data fetching
      getSheetData("פברואר 2025").then((data) => {
        console.log(data);
      });

      // Example of adding a category
      addCategory({ 
        name: "קטגוריה חדשה", 
        color: "#000000", 
        budgetLimit: 1000 
      }).then(success => {
        if (success) {
          console.log("Category added successfully");
        }
      });
    }
  }, [isAuthenticated]);

  const displayInstallPrompt = async () => {
    if (defferedPrompt !== null) {
      defferedPrompt.prompt();
      const { outcome } = await defferedPrompt.userChoice;
      if (outcome === "accepted") {
        setDefferedPrompt(null);
      }
    }
  };

  const handleLogin = (credentialResponse: CredentialResponse): void => {
    if (credentialResponse.credential) {
      const decodedUser: GoogleUserType = jwtDecode(
        credentialResponse.credential
      );

      const userData = {
        email: decodedUser.email,
        name: decodedUser.name,
        picture: decodedUser.picture,
        sub: decodedUser.sub,
      };

      login(userData);

      localStorage.setItem("googleToken", credentialResponse.credential);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">טוען...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => console.error("Error logging in")}
            useOneTap
          />
        </div>
      </GoogleOAuthProvider>
    );
  }

  if (setupComplete === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">טוען...</p>
      </div>
    );
  }

  if (!setupComplete) {
    return <SetupWizard onComplete={() => setSetupComplete(true)} />;
  }

  if (showSettings) {
    return <SettingsPage onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-4">
            <h1 className="text-xl font-bold text-gray-800">מעקב תקציב אישי</h1>
            {user?.name}
          </div>
          <div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="הגדרות"
            >
              <Settings size={20} className="text-gray-600" />
            </button>
            {defferedPrompt && (
              <button
                onClick={displayInstallPrompt}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="התקנה"
              >
                <Download size={20} className="text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        <Dashboard />
      </main>

      <Toaster position="bottom-left" />
    </div>
  );
}

export default App;