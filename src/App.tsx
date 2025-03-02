import React, { useState, useEffect } from "react";
import { getBudgetData } from "./utils/storage";
import SetupWizard from "./components/setup/SetupWizard";
import Dashboard from "./components/dashboard/Dashboard";
import SettingsPage from "./components/settings/SettingsPage";
import { Download, Settings } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { BeforeInstallPromptEvent } from "./types";

function App() {
  const [setupComplete, setSetupComplete] = useState<boolean | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [defferedPrompt, setDefferedPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  console.log(defferedPrompt);
  useEffect(() => {
    const data = getBudgetData();
    setSetupComplete(data.setupComplete);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      setDefferedPrompt(e);
    });
  }, []);

  const displayInstallPrompt = async () => {
    if (defferedPrompt !== null) {
      defferedPrompt.prompt();
      const { outcome } = await defferedPrompt.userChoice;
      if (outcome === "accepted") {
        setDefferedPrompt(null);
      }
    }
  };

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
          <h1 className="text-xl font-bold text-gray-800">מעקב תקציב אישי</h1>
          <div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="הגדרות"
            >
              <Settings size={20} className="text-gray-600" />
            </button>
            <button
              onClick={displayInstallPrompt}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="התקנה"
            >
              <Download size={20} className="text-gray-600" />
            </button>
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
