import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Store, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import westfieldLogo from "@/assets/westfield-logo.png";
import ClientShopifyTab from "@/components/client/ClientShopifyTab";

const ClientSettings = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientData, setClientData] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [hasSetPassword, setHasSetPassword] = useState(true);

  useEffect(() => {
    if (!loading && (!user || role !== "client")) {
      navigate("/login");
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);

  const [locationId, setLocationId] = useState<string>("");
  const [validating, setValidating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<any>(null);

  const fetchClientData = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("id, first_name, last_name, company_name, email, phone_number, default_low_stock_threshold, shopify_location_id")
      .eq("user_id", user?.id)
      .single();

    if (!error && data) {
      setClientData(data);
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setCompanyName(data.company_name || "");
      setPhoneNumber(data.phone_number || "");
      setLowStockThreshold(data.default_low_stock_threshold || 10);
      setLocationId(data.shopify_location_id || "");
      setHasSetPassword(true);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    const { error } = await supabase
      .from("clients")
      .update({
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        phone_number: phoneNumber,
        contact_name: `${firstName} ${lastName}`.trim(),
        default_low_stock_threshold: lowStockThreshold,
      })
      .eq("user_id", user?.id);

    setIsSavingProfile(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      fetchClientData();
    }
  };

  const validateLocation = async () => {
    if (!locationId) {
      toast({
        title: "Error",
        description: "Please enter a location ID first",
        variant: "destructive",
      });
      return;
    }

    setValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke('shopify-validate-location', {
        body: { client_id: clientData.id, location_id: locationId }
      });

      if (error) throw error;
      setLocationStatus(data);

      toast({
        title: data.valid ? "Valid Location" : "Invalid Location",
        description: data.valid ? data.location_name : data.error,
        variant: data.valid ? "default" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Validation Failed",
        description: error.message,
        variant: "destructive",
      });
      setLocationStatus({ valid: false, error: error.message });
    } finally {
      setValidating(false);
    }
  };

  const saveLocationId = async () => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ shopify_location_id: locationId || null })
        .eq('id', clientData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Location ID saved successfully",
      });
      setLocationStatus(null);
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 12) {
      toast({
        title: "Error",
        description: "Password must be at least 12 characters",
        variant: "destructive",
      });
      return;
    }

    // Check password complexity
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      toast({
        title: "Error",
        description: "Password must include uppercase, lowercase, number, and special character",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      // Use server-side password change with verification
      const { data, error } = await supabase.functions.invoke('change-password', {
        body: {
          currentPassword,
          newPassword,
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setHasSetPassword(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || role !== "client") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/client/dashboard">
              <img src={westfieldLogo} alt="Westfield Logo" className="h-10 cursor-pointer" />
            </Link>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/client/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-2xl">
            <TabsTrigger value="account">
              <User className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="shopify">
              <Store className="mr-2 h-4 w-4" />
              Shopify
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="max-w-2xl">
            <div className="space-y-6">
              <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your basic account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName"
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName"
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={clientData?.email || ""} disabled />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input 
                    id="phoneNumber"
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="lowStockThreshold">Default Low Stock Threshold</Label>
                  <Input 
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Alert when inventory falls below this level
                  </p>
                </div>
                <Button type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shopify Integration Settings</CardTitle>
              <CardDescription>
                Configure your Shopify location for accurate inventory sync
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopify_location_id">
                  Shopify Location ID
                  <span className="text-muted-foreground ml-2">(Optional)</span>
                </Label>

                <div className="flex gap-2">
                  <Input
                    id="shopify_location_id"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    placeholder="Auto-selected if empty"
                    className="flex-1"
                  />
                  <Button 
                    variant="outline"
                    onClick={validateLocation}
                    disabled={validating || !locationId}
                  >
                    {validating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Validate"
                    )}
                  </Button>
                </div>

                {locationStatus && (
                  <Alert className={locationStatus.valid ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-red-500 bg-red-50 dark:bg-red-950"}>
                    <AlertDescription className="flex items-center gap-2">
                      {locationStatus.valid ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-900 dark:text-green-100">
                            Valid: {locationStatus.location_name}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-900 dark:text-red-100">{locationStatus.error}</span>
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <p className="text-sm text-muted-foreground">
                  Leave empty to auto-select your store's primary fulfillment location. 
                  If Westfield Prep is your 3PL warehouse, create a separate Shopify 
                  location and enter its ID here for accurate inventory sync.
                </p>
              </div>

              <Button onClick={saveLocationId}>
                Save Location Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your client account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium mb-2">⚠️ Warning: This action cannot be undone</p>
                <p className="text-sm text-muted-foreground">
                  Deleting your account will permanently remove:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                  <li>All inventory records and history</li>
                  <li>All shipments and orders</li>
                  <li>All billing information</li>
                  <li>All Shopify integrations</li>
                  <li>All account settings and preferences</li>
                </ul>
              </div>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!confirm("Are you absolutely sure you want to delete your account? This cannot be undone.")) {
                    return;
                  }
                  
                  if (!confirm("Last chance: Delete all account data permanently?")) {
                    return;
                  }

                  try {
                    const { data, error } = await supabase.rpc('delete_own_client_account');
                    
                    if (error) throw error;

                    toast({
                      title: "Account Deleted",
                      description: "Your account has been permanently deleted. You will be logged out.",
                    });

                    // Sign out and redirect
                    setTimeout(async () => {
                      await supabase.auth.signOut();
                      navigate('/');
                    }, 2000);
                  } catch (error: any) {
                    toast({
                      title: "Deletion Failed",
                      description: error.message || "Failed to delete account",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Delete Account Permanently
              </Button>
            </CardContent>
          </Card>
            </div>
          </TabsContent>

          <TabsContent value="shopify">
            <ClientShopifyTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClientSettings;
