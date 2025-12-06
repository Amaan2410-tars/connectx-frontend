import { useState } from "react";
import { Home, Compass, User, Building2, Gift, Shield, Ticket, Moon, Sun, LogOut, Coins, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { HomeFeed } from "../screens/HomeFeed";
import { SearchPage } from "../screens/SearchPage";
import { ProfilePage } from "../screens/ProfilePage";
import { CampusHub } from "../screens/CampusHub";
import { RewardsPage } from "../screens/RewardsPage";
import { VerificationFlow } from "../screens/VerificationFlow";
import { CouponsMarketplace } from "../screens/CouponsMarketplace";
import { CoinsMarketplace } from "../screens/CoinsMarketplace";
import { PremiumSubscription } from "../screens/PremiumSubscription";
import { Avatar } from "../ui/Avatar";

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "discover", icon: Compass, label: "Discover" },
  { id: "campus", icon: Building2, label: "Campus" },
  { id: "rewards", icon: Gift, label: "Rewards" },
  { id: "profile", icon: User, label: "Profile" },
];

export const DesktopLayout = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isDark, setIsDark] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderScreen = () => {
    if (showVerification) {
      return <VerificationFlow />;
    }
    if (showCoupons) {
      return <CouponsMarketplace />;
    }
    if (showCoins) {
      return <CoinsMarketplace />;
    }
    if (showPremium) {
      return <PremiumSubscription />;
    }
    
    switch (activeTab) {
      case "home":
        return <HomeFeed />;
      case "discover":
        return <SearchPage />;
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="flex h-screen">
        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-background/50 backdrop-blur-xl">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ConnectX
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Campus Social Network</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowVerification(false);
                    setShowCoupons(false);
                    setShowCoins(false);
                    setShowPremium(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/20 text-primary shadow-neon"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border/50 space-y-2">
            <button
              onClick={() => {
                setShowCoins(!showCoins);
                setShowCoupons(false);
                setShowVerification(false);
                setShowPremium(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                showCoins
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Coins className="w-5 h-5" />
              <span className="font-medium">Coins</span>
            </button>
            <button
              onClick={() => {
                setShowPremium(!showPremium);
                setShowCoupons(false);
                setShowVerification(false);
                setShowCoins(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                showPremium
                  ? "bg-neon-gold/20 text-neon-gold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Crown className="w-5 h-5" />
              <span className="font-medium">Premium</span>
            </button>
            <button
              onClick={() => {
                setShowCoupons(!showCoupons);
                setShowVerification(false);
                setShowCoins(false);
                setShowPremium(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                showCoupons
                  ? "bg-accent/20 text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Ticket className="w-5 h-5" />
              <span className="font-medium">Coupons</span>
            </button>
            <button
              onClick={() => {
                setShowVerification(!showVerification);
                setShowCoupons(false);
                setShowCoins(false);
                setShowPremium(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                showVerification
                  ? "bg-mint-glow/20 text-mint-glow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Verification</span>
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={user?.avatar} alt={user?.name || "User"} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-neon-gold" />
                ) : (
                  <Moon className="w-4 h-4 text-secondary" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar - Mobile & Tablet */}
          <div className="lg:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between glass-card-strong border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mint-glow animate-pulse" />
              <span className="text-sm font-medium text-foreground">ConnectX</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowCoupons(!showCoupons);
                  setShowVerification(false);
                }}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  showCoupons
                    ? "bg-accent/20 text-accent"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <Ticket className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowVerification(!showVerification);
                  setShowCoupons(false);
                }}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  showVerification
                    ? "bg-mint-glow/20 text-mint-glow"
                    : "hover:bg-muted text-muted-foreground"
                )}
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full">
              {/* Desktop: Center content with sidebar */}
              <div className="lg:px-8 lg:py-6">
                {renderScreen()}
              </div>
            </div>
          </div>

          {/* Bottom Navigation - Mobile & Tablet Only */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-card-strong border-t border-border/50">
            <div className="flex items-center justify-around px-2 py-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowVerification(false);
                      setShowCoupons(false);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_hsl(189,100%,72%)]")} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </main>
      </div>
    </div>
  );
};

