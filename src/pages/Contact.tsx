import { useQuery } from "@tanstack/react-query";
import { getContactUs } from "@/services/legal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, ArrowLeft, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

const Contact = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["contact"],
    queryFn: getContactUs,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          <p className="text-muted-foreground mt-4">Loading Contact Information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <GlassCard className="p-6 max-w-2xl">
          <p className="text-destructive">Failed to load Contact Information</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <GlassCard className="p-8">
          <div className="prose prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-6">{data?.data.title}</h1>
            <div className="markdown-content">
              <ReactMarkdown>{data?.data.content || ""}</ReactMarkdown>
            </div>
            
            {/* Quick Contact Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="p-6" glow="primary">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Email</h3>
                </div>
                <a 
                  href="mailto:amaan@tarslab.in" 
                  className="text-primary hover:underline"
                >
                  amaan@tarslab.in
                </a>
              </GlassCard>
              
              <GlassCard className="p-6" glow="primary">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Phone</h3>
                </div>
                <a 
                  href="tel:+918790492138" 
                  className="text-primary hover:underline"
                >
                  +91 8790492138
                </a>
              </GlassCard>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Contact;

