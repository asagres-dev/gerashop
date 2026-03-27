import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/components/LoginPage";
import Sidebar from "@/components/Sidebar";
import DashboardPage from "@/components/DashboardPage";
import OffersPage from "@/components/OffersPage";
import ContentPage from "@/components/ContentPage";
import CampaignsPage from "@/components/CampaignsPage";
import AnalyticsPage from "@/components/AnalyticsPage";
import SettingsPage from "@/components/SettingsPage";
import CalendarPage from "@/components/CalendarPage";
import NicheMappingPage from "@/components/NicheMappingPage";
import { Offer } from "@/components/OffersPage";

export default function Index() {
  const { user, loading, signOut } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl gradient-primary animate-pulse-glow flex items-center justify-center">
          <span className="text-white text-xl">⚡</span>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardPage />;
      case "ofertas": return <OffersPage onGenerateContent={handleGenerateContent} />;
      case "conteudo": return <ContentPage preSelectedOffer={preSelectedOffer} />;
      case "calendario": return <CalendarPage />;
      case "mapeamento": return <NicheMappingPage />;
      case "campanhas": return <CampaignsPage />;
      case "analytics": return <AnalyticsPage />;
      case "configuracoes": return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} onLogout={signOut} />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {renderPage()}
      </main>
    </div>
  );
}
