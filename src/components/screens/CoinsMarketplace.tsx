import { useState } from "react";
import { Coins, Gift, History, Loader2, ArrowRight } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoinBundles, createOrder, giftCoins, getTransactionHistory, type CoinBundle, type CoinTransaction } from "@/services/coins";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "buy" | "gift" | "history";

export const CoinsMarketplace = () => {
  const [activeTab, setActiveTab] = useState<Tab>("buy");
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [giftUserId, setGiftUserId] = useState("");
  const [giftAmount, setGiftAmount] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: bundlesData, isLoading: bundlesLoading } = useQuery({
    queryKey: ["coin-bundles"],
    queryFn: getCoinBundles,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["coin-history"],
    queryFn: getTransactionHistory,
    enabled: activeTab === "history",
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // In a real app, you would integrate Razorpay here
      // For now, we'll show a message
      toast.success("Order created! Complete payment with Razorpay.");
      console.log("Razorpay order:", data.data);
      // TODO: Integrate Razorpay checkout
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create order");
    },
  });

  const giftMutation = useMutation({
    mutationFn: giftCoins,
    onSuccess: () => {
      toast.success("Coins gifted successfully!");
      queryClient.invalidateQueries({ queryKey: ["coin-history"] });
      setGiftDialogOpen(false);
      setGiftUserId("");
      setGiftAmount("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to gift coins");
    },
  });

  const bundles = Array.isArray(bundlesData?.data) ? bundlesData.data : [];
  const transactions = Array.isArray(historyData?.data) ? historyData.data : [];

  const handleBuyCoins = (bundleId: number) => {
    createOrderMutation.mutate(bundleId);
  };

  const handleGiftCoins = () => {
    if (!giftUserId || !giftAmount) {
      toast.error("Please fill in all fields");
      return;
    }
    const coins = parseInt(giftAmount);
    if (isNaN(coins) || coins <= 0) {
      toast.error("Please enter a valid coin amount");
      return;
    }
    giftMutation.mutate({ toUserId: giftUserId, coins });
  };

  return (
    <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 space-y-6 animate-fade-in max-w-6xl lg:mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-4">
          <Coins className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Coins Marketplace</h1>
        <p className="text-muted-foreground">Buy, gift, and manage your coins</p>
        {user && (
          <p className="text-lg font-semibold text-primary">
            Your Balance: {user.coins || 0} Coins
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 justify-center">
        <NeonButton
          variant={activeTab === "buy" ? "gradient" : "ghost"}
          onClick={() => setActiveTab("buy")}
          className="glass-card"
        >
          <Coins className="w-4 h-4 mr-2" />
          Buy Coins
        </NeonButton>
        <NeonButton
          variant={activeTab === "gift" ? "gradient" : "ghost"}
          onClick={() => setActiveTab("gift")}
          className="glass-card"
        >
          <Gift className="w-4 h-4 mr-2" />
          Gift Coins
        </NeonButton>
        <NeonButton
          variant={activeTab === "history" ? "gradient" : "ghost"}
          onClick={() => setActiveTab("history")}
          className="glass-card"
        >
          <History className="w-4 h-4 mr-2" />
          History
        </NeonButton>
      </div>

      {/* Buy Coins Tab */}
      {activeTab === "buy" && (
        <div className="space-y-4">
          {bundlesLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
              <p className="text-muted-foreground mt-4">Loading bundles...</p>
            </div>
          ) : bundles.length === 0 ? (
            <GlassCard className="text-center py-12">
              <p className="text-muted-foreground">No coin bundles available</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bundles.map((bundle: CoinBundle) => (
                <GlassCard key={bundle.id} className="p-6 space-y-4" neonBorder>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {bundle.coins}
                    </div>
                    <div className="text-2xl font-semibold text-foreground">
                      ₹{bundle.amountINR}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {Math.round((bundle.coins / bundle.amountINR) * 100) / 100} coins per ₹1
                    </div>
                  </div>
                  <NeonButton
                    variant="gradient"
                    className="w-full"
                    onClick={() => handleBuyCoins(bundle.id)}
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Buy Now <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </NeonButton>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gift Coins Tab */}
      {activeTab === "gift" && (
        <div className="max-w-md mx-auto">
          <GlassCard className="p-6 space-y-4">
            <div className="text-center mb-4">
              <Gift className="w-12 h-12 mx-auto text-primary mb-2" />
              <h2 className="text-xl font-semibold text-foreground">Gift Coins</h2>
              <p className="text-sm text-muted-foreground">
                Share coins with your friends
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userId">Recipient User ID</Label>
                <Input
                  id="userId"
                  placeholder="Enter user ID"
                  value={giftUserId}
                  onChange={(e) => setGiftUserId(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="amount">Coins to Gift</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  min="1"
                />
              </div>
              <NeonButton
                variant="gradient"
                className="w-full"
                onClick={handleGiftCoins}
                disabled={giftMutation.isPending || !giftUserId || !giftAmount}
              >
                {giftMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gifting...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Gift Coins
                  </>
                )}
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {historyLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
              <p className="text-muted-foreground mt-4">Loading history...</p>
            </div>
          ) : transactions.length === 0 ? (
            <GlassCard className="text-center py-12">
              <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No transaction history</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction: CoinTransaction) => (
                <GlassCard key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        transaction.type === "purchase" ? "bg-primary/20" :
                        transaction.type === "gift_sent" ? "bg-destructive/20" :
                        "bg-primary/20"
                      )}>
                        {transaction.type === "purchase" ? (
                          <Coins className="w-5 h-5 text-primary" />
                        ) : transaction.type === "gift_sent" ? (
                          <Gift className="w-5 h-5 text-destructive" />
                        ) : (
                          <Gift className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {transaction.type === "purchase" ? "Purchased" :
                           transaction.type === "gift_sent" ? `Gifted to ${transaction.receiver?.name || "User"}` :
                           `Received from ${transaction.sender?.name || "User"}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "text-lg font-bold",
                      transaction.type === "gift_sent" ? "text-destructive" : "text-primary"
                    )}>
                      {transaction.type === "gift_sent" ? "-" : "+"}{transaction.coins} Coins
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

