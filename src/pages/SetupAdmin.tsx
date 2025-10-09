import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import westfieldLogo from "@/assets/westfield-logo.png";

const SetupAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const createAdmin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-admin", {
        body: {
          email: "info@westfieldprepcenter.com",
          password: "274504mmM",
        },
      });

      if (error) throw error;

      setDone(true);
      toast({
        title: "Admin account created!",
        description: "You can now log in with your credentials.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-8">
            <img src={westfieldLogo} alt="Westfield Logo" className="h-16" />
          </div>

          <h1 className="text-2xl font-bold mb-4">Admin Setup</h1>

          {!done ? (
            <>
              <p className="text-muted-foreground mb-6">
                Click below to create your admin account
              </p>
              <Button onClick={createAdmin} disabled={loading} className="w-full">
                {loading ? "Creating Admin..." : "Create Admin Account"}
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                Your admin account has been created successfully!
              </p>
              <Button onClick={() => navigate("/login")} className="w-full">
                Go to Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupAdmin;
