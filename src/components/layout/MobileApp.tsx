import { useState } from "react";
import { BottomNav } from "../ui/BottomNav";
import { HomeFeed } from "../screens/HomeFeed";
import { DiscoverPage } from "../screens/DiscoverPage";
import { ProfilePage } from "../screens/ProfilePage";
import { CampusHub } from "../screens/CampusHub";
import { RewardsPage } from "../screens/RewardsPage";
import { VerificationFlow } from "../screens/VerificationFlow";
import { CouponsMarketplace } from "../screens/CouponsMarketplace";
import { Moon, Sun, Shield, Ticket, Plus } from "lucide-react";

export const MobileApp = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isDark, setIsDark] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const renderScreen = () => {
    if (showVerification) {
      return <VerificationFlow />;
    }
    if (showCoupons) {
      return <CouponsMarketplace />;
    }
    
    switch (activeTab) {
      case "home":
        return <HomeFeed />;
      case "discover":
        return <DiscoverPage />;
      case "campus":
        return <CampusHub />;
      case "rewards":
        return <RewardsPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="mobile-container bg-background transition-colors duration-500">
      {/* Status Bar */}
      <div className="sticky top-0 z-40 px-4 py-2 flex items-center justify-between glass-card-strong mx-2 mt-2 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-mint-glow animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">ConnectX</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowCoupons(!showCoupons);
              setShowVerification(false);
            }}
            className={`p-2 rounded-xl transition-all ${showCoupons ? 'bg-accent/20 text-accent' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Ticket className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowVerification(!showVerification);
              setShowCoupons(false);
            }}
            className={`p-2 rounded-xl transition-all ${showVerification ? 'bg-mint-glow/20 text-mint-glow' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-neon-gold" />
            ) : (
              <Moon className="w-4 h-4 text-secondary" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="overflow-y-auto h-[calc(100vh-140px)]">
        {renderScreen()}
      </main>

      {/* Floating Action Button - Post Creation */}
      {activeTab === "home" && !showVerification && !showCoupons && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] pointer-events-none z-50">
          <button
            onClick={() => {
              // This will be handled by HomeFeed component
              const event = new CustomEvent("openPostDialog");
              window.dispatchEvent(event);
            }}
            className="absolute bottom-0 right-6 w-14 h-14 rounded-full gradient-primary shadow-glow flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      {!showVerification && !showCoupons && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};
