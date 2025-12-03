import { Home, Compass, User, Building2, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "discover", icon: Compass, label: "Discover" },
  { id: "campus", icon: Building2, label: "Campus" },
  { id: "rewards", icon: Gift, label: "Rewards" },
  { id: "profile", icon: User, label: "Profile" },
];

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      <div className="mx-4 mb-4 glass-card-strong px-2 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "relative p-2 rounded-xl transition-all duration-300",
                  isActive && "bg-primary/20 shadow-neon"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive && "drop-shadow-[0_0_8px_hsl(189,100%,72%)]"
                  )} />
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-primary/10 animate-glow-pulse" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-all duration-300",
                  isActive && "text-primary"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
