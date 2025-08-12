import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User, Calendar, Settings } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/signin");
    } else {
      setUser(user);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-border hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <User className="w-5 h-5 mr-2 text-voice-accent" />
                Profile
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your personal information and preferences
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-voice-accent" />
                Appointments
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                View your scheduled demos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your Bolo AI demo appointments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Settings className="w-5 h-5 mr-2 text-voice-accent" />
                Settings
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Customize your Bolo AI experience
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-primary/10 to-voice-accent/10 border-voice-accent/20">
          <CardHeader>
            <CardTitle className="text-foreground">Welcome to Bolo AI</CardTitle>
            <CardDescription className="text-muted-foreground">
              You're now logged into your Bolo AI dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4">
              From here you can manage your AI voice assistant integrations, view analytics, 
              and configure your brand's voice settings.
            </p>
            <Button variant="outline" className="border-voice-accent text-voice-accent hover:bg-voice-accent hover:text-primary-foreground">
              Explore Features
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;