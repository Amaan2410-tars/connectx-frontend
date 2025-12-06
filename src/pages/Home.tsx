import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Footer } from "@/components/layout/Footer";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Gift, 
  Coins, 
  Crown,
  Shield,
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Users,
      title: "Connect with Peers",
      description: "Join clubs, attend events, and build your campus network"
    },
    {
      icon: MessageSquare,
      title: "Share & Engage",
      description: "Post updates, comment, and like to stay connected"
    },
    {
      icon: Calendar,
      title: "Campus Events",
      description: "Discover and RSVP to events happening on campus"
    },
    {
      icon: Gift,
      title: "Rewards & Coupons",
      description: "Earn points, redeem rewards, and get exclusive coupons"
    },
    {
      icon: Coins,
      title: "Digital Coins",
      description: "Purchase coins to gift friends and unlock premium features"
    },
    {
      icon: Crown,
      title: "Premium Access",
      description: "Get priority access to exclusive clubs and events"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Verified Students",
      description: "Secure verification system ensures authentic campus community"
    },
    {
      icon: Sparkles,
      title: "Gamification",
      description: "Earn points, unlock achievements, and climb the leaderboard"
    },
    {
      icon: TrendingUp,
      title: "Growth & Learning",
      description: "Join clubs, attend workshops, and expand your skills"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Get recognized for your contributions and engagement"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  ConnectX
                </span>
              </h1>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-primary via-secondary to-accent rounded-full"></div>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Your Campus Social Network
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect, engage, and grow with your college community. Join clubs, attend events, 
              earn rewards, and build lasting relationships.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/signup">
                  <NeonButton className="px-8 py-6 text-lg">
                    Get Started
                  </NeonButton>
                </Link>
                <Link to="/login">
                  <NeonButton variant="outline" className="px-8 py-6 text-lg">
                    Login
                  </NeonButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Features</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to stay connected on campus
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={index} className="p-6 hover:scale-105 transition-transform duration-300" glow="primary">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/20">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose ConnectX?</h2>
            <p className="text-muted-foreground text-lg">
              Built for students, by students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <GlassCard key={index} className="p-6" glow="mint">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/20">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-12 text-center" glow="gold">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of students already using ConnectX to stay connected on campus
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <NeonButton className="px-8 py-6 text-lg">
                    Create Account
                  </NeonButton>
                </Link>
                <Link to="/login">
                  <NeonButton variant="outline" className="px-8 py-6 text-lg">
                    Already have an account?
                  </NeonButton>
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;

