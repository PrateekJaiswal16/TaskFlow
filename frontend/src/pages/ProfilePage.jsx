import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { verifyPassword } from '@/service/userService'; // Import the new service
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const handleVerifyPassword = async () => {
    try {
      await verifyPassword(currentPassword);
      toast.success("Password verified. You can now set a new one.");
      setIsPasswordVerified(true); // This will show the new password fields
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToUpdate = { name, email };

    if (isPasswordVerified && newPassword) {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }
        dataToUpdate.password = newPassword;
        // The backend no longer needs currentPassword for the update endpoint
    }
    await updateProfile(dataToUpdate);
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your name and email here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {/* Password Change Section */}
            {!isPasswordVerified ? (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline">Change Password</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Verify Current Password</DialogTitle>
                            <DialogDescription>
                                To change your password, please enter your current password first.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 py-4">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="button" onClick={handleVerifyPassword}>Verify</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <div className="p-4 border rounded-lg bg-muted/50">
                    <h3 className="mb-2 font-semibold">Set New Password</h3>
                    <div className="space-y-2 mt-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2 mt-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
            )}
            
            <Button type="submit" disabled={loading} className="mt-4">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}