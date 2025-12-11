import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { useLoginMutation, useSignupMutation } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

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
  const [phoneData, setPhoneData] = useState({
    phone: "",
    otp: "",
    name: "",
    verificationToken: "",
    step: "phone" as "phone" | "otp" | "name"
  });

  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();

  const sendOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      const res = await apiRequest("POST", "/api/otp/send", { phone });
      return res.json();
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const res = await apiRequest("POST", "/api/otp/verify", { phone, otp });
      return res.json();
    }
  });

  const phoneLoginMutation = useMutation({
    mutationFn: async ({ verificationToken, name }: { verificationToken: string; name?: string }) => {
      const res = await apiRequest("POST", "/api/auth/phone", { verificationToken, name });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    }
  });

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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneData.phone || phoneData.phone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number with country code (e.g., +91XXXXXXXXXX)",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await sendOtpMutation.mutateAsync(phoneData.phone);
      toast({
        title: "OTP sent!",
        description: "Check your phone for the verification code.",
      });
      setPhoneData({ ...phoneData, step: "otp" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send OTP";
      toast({
        title: "Failed to send OTP",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const verifyResult = await verifyOtpMutation.mutateAsync({ phone: phoneData.phone, otp: phoneData.otp });
      
      // Store the verification token
      const verificationToken = verifyResult.verificationToken;
      
      const result = await phoneLoginMutation.mutateAsync({ 
        verificationToken,
        name: phoneData.name || undefined 
      });
      
      if (result.isNewUser && !phoneData.name) {
        setPhoneData({ ...phoneData, verificationToken, step: "name" });
        return;
      }
      
      toast({
        title: "Welcome!",
        description: "You have been logged in successfully.",
      });
      onAuth();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Verification failed";
      toast({
        title: "Verification failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleCompleteName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await phoneLoginMutation.mutateAsync({ 
        verificationToken: phoneData.verificationToken,
        name: phoneData.name 
      });
      toast({
        title: "Account created!",
        description: "Welcome to Swift Shaadi. Let's plan your wedding!",
      });
      onAuth();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to complete signup";
      toast({
        title: "Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;
  const isPhoneLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending || phoneLoginMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-background" data-testid="page-auth">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-semibold">Swift Shaadi</h1>
          <p className="text-muted-foreground mt-1">Plan your perfect Indian wedding</p>
        </div>

        <Card data-testid="card-auth">
          <Tabs defaultValue="phone">
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="phone" data-testid="tab-phone">Phone</TabsTrigger>
                <TabsTrigger value="login" data-testid="tab-login">Email</TabsTrigger>
                <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="phone" className="mt-0">
                <div className="space-y-4 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = "/api/login"}
                    data-testid="button-google-phone"
                  >
                    <SiGoogle className="w-4 h-4 mr-2" />
                    Continue with Google
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or use phone</span>
                    </div>
                  </div>
                </div>

                {phoneData.step === "phone" && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone-number"
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="pl-9"
                          value={phoneData.phone}
                          onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value })}
                          required
                          data-testid="input-phone"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +91 for India)</p>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isPhoneLoading} data-testid="button-send-otp">
                      {sendOtpMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </form>
                )}

                {phoneData.step === "otp" && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <Label htmlFor="otp-code">Enter OTP</Label>
                      <Input
                        id="otp-code"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="123456"
                        className="text-center text-lg tracking-widest"
                        value={phoneData.otp}
                        onChange={(e) => setPhoneData({ ...phoneData, otp: e.target.value.replace(/\D/g, "") })}
                        required
                        data-testid="input-otp"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Sent to {phoneData.phone}
                        <button 
                          type="button" 
                          className="px-1 text-xs text-primary underline"
                          onClick={() => setPhoneData({ ...phoneData, step: "phone", otp: "" })}
                        >
                          Change
                        </button>
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isPhoneLoading || phoneData.otp.length !== 6} data-testid="button-verify-otp">
                      {verifyOtpMutation.isPending || phoneLoginMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Continue"
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => sendOtpMutation.mutate(phoneData.phone)}
                      disabled={sendOtpMutation.isPending}
                    >
                      Resend OTP
                    </Button>
                  </form>
                )}

                {phoneData.step === "name" && (
                  <form onSubmit={handleCompleteName} className="space-y-4">
                    <div>
                      <Label htmlFor="phone-name">Your Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone-name"
                          type="text"
                          placeholder="Your name"
                          className="pl-9"
                          value={phoneData.name}
                          onChange={(e) => setPhoneData({ ...phoneData, name: e.target.value })}
                          required
                          data-testid="input-phone-name"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={phoneLoginMutation.isPending} data-testid="button-complete-signup">
                      {phoneLoginMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Complete Sign Up"
                      )}
                    </Button>
                  </form>
                )}
              </TabsContent>

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
