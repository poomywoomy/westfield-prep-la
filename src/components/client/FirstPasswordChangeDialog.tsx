import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FirstPasswordChangeDialogProps {
  open: boolean;
  onSuccess: () => void;
}

const FirstPasswordChangeDialog = ({ open, onSuccess }: FirstPasswordChangeDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      // Clear the password expiration using secure RPC function
      const { error: clearError } = await supabase.rpc('clear_password_expiration');
      
      if (clearError) {
        console.error('Error clearing password expiration:', clearError);
        throw clearError;
      }

      toast({
        title: "Success",
        description: "Your password has been changed successfully",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    try { localStorage.removeItem('sb-gqnvkecmxjijrxhggcro-auth-token'); } catch {}
    window.location.replace('/login');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Change Your Password</DialogTitle>
          <DialogDescription>
            You must change your password before continuing. Please choose a secure password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input
              id="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Changing Password..." : "Change Password"}
          </Button>

          <div className="pt-4 space-y-2">
            <div className="text-sm text-muted-foreground text-center">Or</div>
            <Button type="button" variant="secondary" onClick={handleLogout} className="w-full">
              Log out and sign in with a different account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FirstPasswordChangeDialog;
