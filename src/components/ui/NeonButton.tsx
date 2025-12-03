import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export const NeonButton = ({ 
  children, 
  variant = "primary", 
  size = "md",
  glow = true,
  className,
  ...props 
}: NeonButtonProps) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    ghost: "bg-transparent hover:bg-muted text-foreground",
    gradient: "gradient-primary text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        "font-semibold rounded-2xl transition-all duration-300",
        "hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        glow && variant === "primary" && "shadow-neon hover:shadow-[0_0_30px_hsl(189,100%,72%/0.5)]",
        glow && variant === "gradient" && "shadow-glow hover:shadow-[0_0_40px_hsl(265,100%,80%/0.4)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
