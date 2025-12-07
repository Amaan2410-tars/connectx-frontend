import { useQuery } from "@tanstack/react-query";
import { getPrivacyPolicy } from "@/services/legal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

const Privacy = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["privacy"],
    queryFn: getPrivacyPolicy,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          <p className="text-muted-foreground mt-4">Loading Privacy Policy...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <GlassCard className="p-6 max-w-2xl">
          <p className="text-destructive">Failed to load Privacy Policy</p>
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
            <h1 className="text-3xl font-bold mb-2">{data?.data.title}</h1>
            {data?.data.lastUpdated && (
              <p className="text-muted-foreground text-sm mb-6">
                Last Updated: {new Date(data.data.lastUpdated).toLocaleDateString()}
              </p>
            )}
            <div className="markdown-content">
              <ReactMarkdown>{data?.data.content || ""}</ReactMarkdown>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Privacy;


