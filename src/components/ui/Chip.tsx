import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "accent" | "mint";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Chip = ({ 
  children, 
  variant = "default", 
  size = "md",
  className,
  onClick,
  style 
}: ChipProps) => {
  const variants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/20 text-primary border border-primary/30",
    secondary: "bg-secondary/20 text-secondary border border-secondary/30",
    accent: "bg-accent/20 text-accent border border-accent/30",
    mint: "bg-mint-glow/20 text-mint-glow border border-mint-glow/30",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-1.5 text-sm",
  };

  return (
    <span
      onClick={onClick}
      style={style}
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-all duration-200",
        variants[variant],
        sizes[size],
        onClick && "cursor-pointer hover:scale-105 active:scale-95",
        className
      )}
    >
      {children}
    </span>
  );
};
