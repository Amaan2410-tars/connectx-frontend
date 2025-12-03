import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const VerifiedBadge = ({ size = "md", className }: VerifiedBadgeProps) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <BadgeCheck 
        className={cn(
          sizes[size],
          "text-mint-glow drop-shadow-[0_0_8px_hsl(160,100%,75%)]"
        )} 
      />
    </div>
  );
};
