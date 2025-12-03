import { MobileApp } from "@/components/layout/MobileApp";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      {/* Phone Frame for Desktop View */}
      <div className="hidden md:block relative">
        {/* Phone Bezel */}
        <div className="relative w-[430px] h-[932px] bg-foreground/90 rounded-[60px] p-3 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-foreground/90 rounded-b-3xl z-50" />
          {/* Screen */}
          <div className="w-full h-full rounded-[48px] overflow-hidden bg-background">
            <MobileApp />
          </div>
        </div>
        {/* Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-3xl -z-10 rounded-[70px]" />
      </div>

      {/* Direct View for Mobile */}
      <div className="md:hidden w-full">
        <MobileApp />
      </div>
    </div>
  );
};

export default Index;
