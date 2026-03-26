import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import Sidebar from "@/components/Sidebar";
import DashboardPage from "@/components/DashboardPage";
import OffersPage from "@/components/OffersPage";
import ContentPage from "@/components/ContentPage";
import CampaignsPage from "@/components/CampaignsPage";
import AnalyticsPage from "@/components/AnalyticsPage";
import SettingsPage from "@/components/SettingsPage";
import { Offer } from "@/components/OffersPage";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [preSelectedOffer, setPreSelectedOffer] = useState<Offer | null>(null);

  const handleGenerateContent = (offer: Offer) => {
    setPreSelectedOffer(offer);
    setActivePage("conteudo");
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
    if (page !== "conteudo") setPreSelectedOffer(null);
  };

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardPage />;
      case "ofertas": return <OffersPage onGenerateContent={handleGenerateContent} />;
      case "conteudo": return <ContentPage preSelectedOffer={preSelectedOffer} />;
      case "campanhas": return <CampaignsPage />;
      case "analytics": return <AnalyticsPage />;
      case "configuracoes": return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} onLogout={() => setIsLoggedIn(false)} />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {renderPage()}
      </main>
    </div>
  );
}
