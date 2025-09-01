import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, UserPlus, Users, Eye, Shield, Bot, Activity, Bell, Check, Code } from "lucide-react";
const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    checkAuth();
    fetchUsers();
    fetchAgents();
    fetchActivityLogs();
    fetchNotifications();
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
      // Fetch users from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error("Error fetching users:", profilesError);
        toast({
          title: "Error fetching users",
          description: profilesError.message,
          variant: "destructive"
        });
        return;
      }

      // Fetch user roles separately
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
      }

      // Combine profiles with their roles
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.id) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      // Fetch agents
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (agentsError) {
        console.error("Error fetching agents:", agentsError);
        return;
      }

      // Fetch profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }

      // Combine agents with their owner profiles
      const agentsWithProfiles = agents?.map(agent => ({
        ...agent,
        profiles: profiles?.find(profile => profile.id === agent.user_id) || null
      })) || [];

      setAgents(agentsWithProfiles);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      // Fetch activity logs
      const { data: logs, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (logsError) {
        console.error("Error fetching activity logs:", logsError);
        return;
      }

      // Fetch profiles and agents separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('*');

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }
      if (agentsError) {
        console.error("Error fetching agents:", agentsError);
      }

      // Combine logs with their related data
      const logsWithRelations = logs?.map(log => ({
        ...log,
        profiles: profiles?.find(profile => profile.id === log.user_id) || null,
        agents: agents?.find(agent => agent.id === log.agent_id) || null
      })) || [];

      setActivityLogs(logsWithRelations);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) {
        console.error("Error marking notification as read:", error);
        return;
      }

      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
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

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
            <TabsTrigger value="create-user">Create User</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Agent Configuration Requests
                </CardTitle>
                <CardDescription>
                  New agent configurations submitted by users awaiting your review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications at this time
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg ${
                          notification.read ? 'bg-muted/30' : 'bg-card border-primary/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{notification.title}</h4>
                              {!notification.read && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {notification.message}
                            </p>
                            
                            {notification.data && (
                              <div className="bg-muted/50 p-3 rounded border text-sm space-y-2">
                                <div><strong>Agent Name:</strong> {notification.data.agent_name}</div>
                                <div><strong>Voice:</strong> {notification.data.voice_id}</div>
                                {notification.data.voice_preferences && (
                                  <div className="bg-muted/30 p-2 rounded mt-2">
                                    <div className="text-xs font-semibold mb-1">Voice Preferences:</div>
                                    <div className="text-xs space-y-1">
                                      <div><strong>Gender:</strong> {notification.data.voice_preferences.gender}</div>
                                      <div><strong>Age Group:</strong> {notification.data.voice_preferences.age}</div>
                                      {notification.data.voice_preferences.voice_name && (
                                        <div><strong>Selected Voice:</strong> {notification.data.voice_preferences.voice_name}</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                <div><strong>First Message:</strong> {notification.data.first_message}</div>
                                <div><strong>Responsiveness:</strong> {notification.data.responsiveness}</div>
                                <div><strong>Backchannel:</strong> {notification.data.enable_backchannel ? 'Enabled' : 'Disabled'}</div>
                                {notification.data.knowledge_base && (
                                  <div><strong>Knowledge Base:</strong> {notification.data.knowledge_base}</div>
                                )}
                                {notification.data.website_link && (
                                  <div><strong>Website:</strong> {notification.data.website_link}</div>
                                )}
                              </div>
                            )}
                            
                            <div className="text-xs text-muted-foreground mt-2">
                              Submitted: {new Date(notification.created_at).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            {!notification.read ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Mark Read
                              </Button>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                Agent configuration approved. User can now test and deploy their agent.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  All Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}</TableCell>
                        <TableCell>
                          <Select
                            value={user.user_roles?.[0]?.role || 'user'}
                            onValueChange={(value) => handleRoleChange(user.id, value as any)}
                            disabled={roleUpdateLoading === user.id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {roleUpdateLoading === user.id && "Updating..."}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  All Agent Configurations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>{agent.profiles?.email || 'Unknown'}</TableCell>
                        <TableCell>{agent.language}</TableCell>
                        <TableCell>{new Date(agent.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="max-w-xs truncate">{agent.description || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Widget Management
                </CardTitle>
                <CardDescription>
                  View and manage all voice widgets created by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate('/admin/widgets')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View All Widgets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Activity Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.profiles?.email || 'Unknown'}</TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.agents?.name || 'N/A'}</TableCell>
                        <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.details ? JSON.stringify(log.details) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-user" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default Admin;