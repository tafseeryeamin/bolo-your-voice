import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, UserPlus, Users, Eye, Shield } from "lucide-react";
const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    checkAuth();
    fetchUsers();
  }, []);
  const checkAuth = async () => {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user || user.email !== "tafser.yeamin.tiu@gmail.com") {
      navigate("/sign-in");
    }
  };
  const fetchUsers = async () => {
    try {
      // Fetch users from profiles table with their roles
      const {
        data: profiles,
        error: profilesError
      } = await supabase.from('profiles').select(`
          id,
          email,
          first_name,
          last_name,
          created_at,
          user_roles(role)
        `);
      if (profilesError) {
        console.error("Error fetching users:", profilesError);
        toast({
          title: "Error fetching users",
          description: profilesError.message,
          variant: "destructive"
        });
      } else {
        setUsers(profiles || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      if (error) {
        toast({
          title: "User Creation Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "User Created Successfully",
          description: `User ${email} has been created.`
        });
        setEmail("");
        setPassword("");
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleRoleChange = async (userId: string, newRole: "admin" | "moderator" | "user") => {
    setRoleUpdateLoading(userId);
    try {
      // First, remove existing roles for this user
      const {
        error: deleteError
      } = await supabase.from('user_roles').delete().eq('user_id', userId);
      if (deleteError) {
        throw deleteError;
      }

      // Then add the new role
      const {
        error: insertError
      } = await supabase.from('user_roles').insert({
        user_id: userId,
        role: newRole
      });
      if (insertError) {
        throw insertError;
      }
      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}.`
      });

      // Refresh the user list
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Role Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setRoleUpdateLoading(null);
    }
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/sign-in");
  };
  return <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate("/dashboard")} variant="voice" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Customer Page
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create User Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Create New User
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Add a new user to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-email" className="text-foreground">Email</Label>
                  <Input id="new-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter user email" required className="bg-input border-border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-foreground">Password</Label>
                  <Input id="new-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter user password" required className="bg-input border-border text-foreground" />
                </div>
                <Button type="submit" className="w-full" disabled={loading} variant="default">
                  {loading ? "Creating user..." : "Create User"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Users List */}
          
        </div>
      </div>
    </div>;
};
export default Admin;