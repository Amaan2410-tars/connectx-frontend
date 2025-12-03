import { Gift, Star, Zap, Trophy, Target, CheckCircle2, Lock, Ticket } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRewards, redeemReward } from "@/services/rewards";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const RewardsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: getRewards,
  });

  const redeemMutation = useMutation({
    mutationFn: redeemReward,
    onSuccess: () => {
      toast.success("Reward redeemed successfully!");
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to redeem reward");
    },
  });

  const rewards = rewardsData?.data || [];
  const userPoints = user?.points || 0;

  if (isLoading) {
    return (
      <div className="px-4 pt-4 pb-32 space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-32 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rewards</h1>
          <p className="text-sm text-muted-foreground">Earn XP, unlock rewards</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass-card neon-glow-gold">
          <Zap className="w-5 h-5 text-neon-gold" />
          <span className="font-bold text-neon-gold">{userPoints} pts</span>
        </div>
      </div>

      {/* Points Display */}
      <GlassCard className="space-y-4" glow="gold">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-3xl shadow-glow animate-float">
              ⭐
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Points</p>
              <p className="text-xl font-bold text-foreground">{userPoints} Points</p>
            </div>
          </div>
          <Trophy className="w-8 h-8 text-neon-gold drop-shadow-[0_0_10px_hsl(47,100%,70%)]" />
        </div>
      </GlassCard>

      {/* Redeemable Rewards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Available Rewards</h2>
        </div>
        <div className="space-y-3">
          {rewards.length === 0 ? (
            <GlassCard className="text-center py-8">
              <p className="text-muted-foreground">No rewards available yet</p>
            </GlassCard>
          ) : (
            rewards.map((reward: any, index: number) => {
              const canRedeem = userPoints >= reward.pointsRequired;
              return (
                <GlassCard
                  key={reward.id}
                  className="flex items-center gap-4 animate-scale-in overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                  glow={canRedeem ? "primary" : "none"}
                >
                  {reward.image ? (
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Gift className="w-10 h-10 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{reward.title}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <Ticket className="w-4 h-4 text-neon-gold" />
                      <span className="text-sm font-bold text-neon-gold">
                        {reward.pointsRequired} pts
                      </span>
                    </div>
                  </div>
                  <NeonButton
                    variant={canRedeem ? "gradient" : "ghost"}
                    size="sm"
                    disabled={!canRedeem || redeemMutation.isPending}
                    onClick={() => redeemMutation.mutate(reward.id)}
                    className={!canRedeem ? "opacity-50" : ""}
                  >
                    {redeemMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : canRedeem ? (
                      "Redeem"
                    ) : (
                      "Locked"
                    )}
                  </NeonButton>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
