import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  glowRing?: boolean;
  className?: string;
}

export const Avatar = ({ 
  src, 
  alt, 
  size = "md", 
  glowRing = false,
  className 
}: AvatarProps) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn(
      "relative inline-block",
      glowRing && "p-[3px] rounded-full gradient-primary shadow-glow",
      className
    )}>
      <img
        src={src}
        alt={alt}
        className={cn(
          sizes[size],
          "rounded-full object-cover",
          glowRing && "border-2 border-background"
        )}
      />
    </div>
  );
};
