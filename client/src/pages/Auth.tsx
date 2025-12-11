import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import logoImage from "@assets/Content_1024x1024_(1)_(1)_1765442654740.png";
import { useToast } from "@/hooks/use-toast";
import { useLoginMutation, useSignupMutation } from "@/hooks/use-auth";

interface AuthProps {
  onAuth: () => void;
}

export default function Auth({ onAuth }: AuthProps) {
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await loginMutation.mutateAsync({
        email: loginData.email,
        password: loginData.password,
      });
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      onAuth();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast({
        title: "Login failed",
        description: message.includes("401") ? "Invalid email or password" : message,
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await signupMutation.mutateAsync({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });
      toast({
        title: "Account created!",
        description: "Welcome to Swift Shaadi. Let's plan your wedding!",
      });
      onAuth();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Signup failed";
      toast({
        title: "Signup failed",
        description: message.includes("400") ? "Email already registered" : message,
        variant: "destructive",
      });
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-background" data-testid="page-auth">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src={logoImage} 
            alt="Swift Shaadi" 
            className="w-20 h-20 mx-auto mb-4 object-contain"
            data-testid="img-logo"
          />
          <h1 className="text-2xl font-serif font-semibold">Swift Shaadi</h1>
          <p className="text-muted-foreground mt-1">Plan your perfect Indian wedding</p>
        </div>

        <Card data-testid="card-auth">
          <Tabs defaultValue="login">
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
                <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="login" className="mt-0">
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = "/api/login"}
                    data-testid="button-google-login"
                  >
                    <SiGoogle className="w-4 h-4 mr-2" />
                    Continue with Google
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-9"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                        data-testid="input-login-email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-9"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        data-testid="input-login-password"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-login">
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = "/api/login"}
                    data-testid="button-google-signup"
                  >
                    <SiGoogle className="w-4 h-4 mr-2" />
                    Sign up with Google
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or sign up with email</span>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your name"
                        className="pl-9"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        required
                        data-testid="input-signup-name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-9"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                        data-testid="input-signup-email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-9"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        data-testid="input-signup-password"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-9"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                        data-testid="input-signup-confirm"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-signup">
                    {signupMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
