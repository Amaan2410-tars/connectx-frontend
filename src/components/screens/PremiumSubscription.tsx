import { useState } from "react";
import { Crown, Check, X, Loader2, Sparkles } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPremiumStatus, subscribeToPremium, cancelPremium } from "@/services/premium";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const premiumFeatures = [
  "Priority post visibility in feed",
  "Access to premium-only clubs",
  "Access to premium-only events",
  "Exclusive premium badge",
  "Early access to new features",
  "Priority customer support",
];

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 299,
    period: "month",
    popular: false,
  },
  {
    id: "annual",
    name: "Annual",
    price: 2999,
    period: "year",
    popular: true,
    savings: "Save 17%",
  },
];

export const PremiumSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["premium-status"],
    queryFn: getPremiumStatus,
  });

  const subscribeMutation = useMutation({
    mutationFn: subscribeToPremium,
    onSuccess: (data) => {
      toast.success("Subscription created! Complete payment with Razorpay.");
      console.log("Razorpay subscription:", data.data);
      // TODO: Integrate Razorpay checkout
      queryClient.invalidateQueries({ queryKey: ["premium-status"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to subscribe");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelPremium,
    onSuccess: () => {
      toast.success("Subscription cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["premium-status"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to cancel subscription");
    },
  });

  const premiumStatus = statusData?.data || { isPremium: false };
  const isPremium = premiumStatus.isPremium || user?.isPremium;

  const handleSubscribe = (planType: "monthly" | "annual") => {
    subscribeMutation.mutate({ planType });
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel your premium subscription?")) {
      cancelMutation.mutate();
    }
  };

  if (statusLoading) {
    return (
      <div className="px-4 pt-4 pb-32 space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          <p className="text-muted-foreground mt-4">Loading premium status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 space-y-6 animate-fade-in max-w-6xl lg:mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Premium Subscription</h1>
        <p className="text-muted-foreground">Unlock exclusive features and benefits</p>
      </div>

      {/* Current Status */}
      {isPremium && (
        <GlassCard className="p-6 space-y-4" glow="primary">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">You're Premium!</h2>
              </div>
              <p className="text-muted-foreground">
                {premiumStatus.planType && (
                  <span className="capitalize">{premiumStatus.planType} Plan</span>
                )}
                {premiumStatus.premiumExpiry && (
                  <span> • Expires {new Date(premiumStatus.premiumExpiry).toLocaleDateString()}</span>
                )}
              </p>
            </div>
            <NeonButton
              variant="ghost"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="glass-card"
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              )}
            </NeonButton>
          </div>
        </GlassCard>
      )}

      {/* Features */}
      <GlassCard className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Premium Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Plans */}
      {!isPremium && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground text-center">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <GlassCard
                key={plan.id}
                className={cn(
                  "p-6 space-y-4 relative",
                  plan.popular && "neon-border"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      {plan.savings}
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">₹{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  {plan.id === "annual" && (
                    <p className="text-sm text-muted-foreground mb-4">
                      ₹{Math.round(plan.price / 12)}/month
                    </p>
                  )}
                </div>
                <NeonButton
                  variant={plan.popular ? "gradient" : "ghost"}
                  className="w-full"
                  onClick={() => handleSubscribe(plan.id as "monthly" | "annual")}
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </NeonButton>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Already Premium Message */}
      {isPremium && (
        <GlassCard className="p-6 text-center space-y-4">
          <Crown className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Enjoy Your Premium Benefits!</h2>
          <p className="text-muted-foreground">
            You have access to all premium features. Make the most of your subscription!
          </p>
        </GlassCard>
      )}
    </div>
  );
};


