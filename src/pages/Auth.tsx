
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const resetForm = useForm({
    defaultValues: {
      resetEmail: ''
    }
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Please check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("You've been logged in successfully!");
        navigate('/');
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (data: { resetEmail: string }) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(data.resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset instructions sent to your email");
      setIsResetOpen(false);
      resetForm.reset();
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-zenblue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Create Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>
            {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
            
            {!isSignUp && (
              <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <DialogTrigger asChild>
                  <button className="text-sm text-muted-foreground hover:text-primary">
                    Forgot password?
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset your password</DialogTitle>
                    <DialogDescription>
                      Enter your email address and we'll send you instructions to reset your password.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                      <FormField
                        control={resetForm.control}
                        name="resetEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input placeholder="Enter your email" {...field} />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                          {isLoading ? 'Sending...' : 'Send Instructions'}
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
