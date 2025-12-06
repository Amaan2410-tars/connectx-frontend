import { useState } from "react";
import { Tag, QrCode, Clock, Store, X, Percent } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Chip } from "../ui/Chip";
import { NeonButton } from "../ui/NeonButton";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoupons, redeemCoupon } from "@/services/coupons";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const categories = ["All", "Food", "Shopping", "Entertainment", "Services"];

export const CouponsMarketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { data: couponsData, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: getCoupons,
  });

  const redeemMutation = useMutation({
    mutationFn: redeemCoupon,
    onSuccess: () => {
      toast.success("Coupon redeemed successfully!");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setSelectedCoupon(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to redeem coupon");
    },
  });

  // Safe array extraction with null checks
  const coupons = Array.isArray(couponsData?.data) ? couponsData.data : [];

  if (isLoading) {
    return (
      <div className="px-4 pt-4 pb-32 space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 space-y-6 animate-fade-in max-w-6xl lg:mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coupons</h1>
          <p className="text-sm text-muted-foreground">Exclusive student deals</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass-card">
          <Tag className="w-5 h-5 text-accent" />
          <span className="font-bold text-foreground">{coupons.length} Active</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {categories.map((cat) => (
          <Chip
            key={cat}
            variant={activeCategory === cat ? "primary" : "default"}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "whitespace-nowrap transition-all",
              activeCategory === cat && "neon-glow"
            )}
          >
            {cat}
          </Chip>
        ))}
      </div>

      {/* Coupons Grid */}
      <div className="space-y-4">
        {coupons.length === 0 ? (
          <GlassCard className="text-center py-8">
            <p className="text-muted-foreground">No coupons available yet</p>
          </GlassCard>
        ) : (
          (Array.isArray(coupons) ? coupons : [])
            .filter((coupon: any) => {
              if (!coupon) return false;
              if (activeCategory === "All") return true;
              // You can add category filtering logic here
              return true;
            })
            .map((coupon: any, index: number) => {
              const isExpired = new Date(coupon.expiry) < new Date();
              const isUsed = !!coupon.usedBy;

              return (
                <div
                  key={coupon.id}
                  className="relative animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                >
                  <GlassCard
                    className={cn(
                      "overflow-hidden p-0 cursor-pointer hover:scale-[1.02] transition-transform",
                      (isExpired || isUsed) && "opacity-50"
                    )}
                    onClick={() => !isExpired && !isUsed && setSelectedCoupon(coupon)}
                  >
                    <div className="flex">
                      {/* Left Section */}
                      <div className="flex-1 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Store className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{coupon.vendor}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            {coupon.value}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {isExpired
                              ? "Expired"
                              : `Valid until ${new Date(coupon.expiry).toLocaleDateString()}`}
                          </span>
                        </div>
                        {isUsed && (
                          <span className="text-xs text-muted-foreground mt-1 block">
                            Already used
                          </span>
                        )}
                      </div>

                      {/* Perforation */}
                      <div className="flex flex-col justify-between py-2">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-3 h-3 rounded-full bg-background" />
                        ))}
                      </div>

                      {/* Right Section */}
                      <div className="w-28 relative bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Percent className="w-8 h-8 text-primary drop-shadow-lg" />
                      </div>
                    </div>
                  </GlassCard>
                </div>
              );
            })
        )}
      </div>

      {/* QR Modal */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-fade-in">
          <GlassCard className="w-full max-w-sm text-center space-y-6" glow="primary">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">{selectedCoupon.vendor}</span>
              <button
                onClick={() => setSelectedCoupon(null)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* QR Code */}
            <div className="relative mx-auto">
              <div className="w-48 h-48 mx-auto glass-card neon-border p-4">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                  {selectedCoupon.qrCode ? (
                    <img src={selectedCoupon.qrCode} alt="QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <QrCode className="w-32 h-32 text-foreground" />
                  )}
                </div>
              </div>
              <div className="absolute -inset-4 rounded-3xl border-2 border-primary/30 animate-glow-pulse" />
            </div>

            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {selectedCoupon.value}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Expires: {new Date(selectedCoupon.expiry).toLocaleDateString()}</span>
            </div>

            <NeonButton
              variant="gradient"
              className="w-full"
              onClick={() => redeemMutation.mutate(selectedCoupon.id)}
              disabled={redeemMutation.isPending}
            >
              {redeemMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redeeming...
                </>
              ) : (
                "Redeem Coupon"
              )}
            </NeonButton>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
