import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  neonBorder?: boolean;
  glow?: "primary" | "pink" | "purple" | "mint" | "gold" | "none";
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const GlassCard = ({ 
  children, 
  className, 
  neonBorder = false,
  glow = "none",
  onClick,
  style 
}: GlassCardProps) => {
  const glowStyles = {
    primary: "neon-glow",
    pink: "neon-glow-pink",
    purple: "neon-glow-purple",
    mint: "neon-glow-mint",
    gold: "neon-glow-gold",
    none: "",
  };

  return (
    <div 
      onClick={onClick}
      style={style}
      className={cn(
        "glass-card p-4 transition-all duration-300",
        neonBorder && "neon-border",
        glowStyles[glow],
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  );
};
