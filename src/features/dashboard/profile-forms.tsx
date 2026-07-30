"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { getImageUrl } from "@/lib/getImageUrl";
import {
  changePassword,
  updateUserProfile,
} from "@/helpers/next-fetch/profileActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardPanel } from "@/features/dashboard/ui";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileForms({
  user,
}: {
  user: {
    name?: string;
    email?: string;
    image?: string;
    company?: string;
    interest?: string;
    contact?: string;
    contactNo?: string;
    role?: string;
  };
}) {
  const router = useRouter();
  const [name, setName] = React.useState(user.name ?? "");
  const [company, setCompany] = React.useState(user.company ?? "");
  const [interest, setInterest] = React.useState(user.interest ?? "");
  const [contact, setContact] = React.useState(
    user.contact ?? user.contactNo ?? "",
  );
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | undefined>(
    getImageUrl(user.image || ""),
  );
  const [savingProfile, setSavingProfile] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [savingPassword, setSavingPassword] = React.useState(false);

  React.useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (company.trim()) fd.append("company", company.trim());
      if (interest.trim()) fd.append("interest", interest.trim());
      if (contact.trim()) fd.append("contact", contact.trim());
      if (imageFile) fd.append("image", imageFile);

      const res = await updateUserProfile(fd);
      if (!res.success) {
        toast.error(res.message || "Could not update profile.", {
          id: "profile",
        });
        return;
      }
      toast.success("Profile updated", { id: "profile" });
      setImageFile(null);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.", { id: "profile" });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.", {
        id: "password",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.", { id: "password" });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
      });
      if (!res.success) {
        toast.error(res.message || "Could not change password.", {
          id: "password",
        });
        return;
      }
      toast.success("Password updated", { id: "password" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Network error. Please try again.", { id: "password" });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardPanel
        title="Profile information"
        description="Update how you appear across Hubology."
      >
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <Avatar className="h-20 w-20 border border-hairline-strong">
                <AvatarImage src={preview} alt={name || "Profile"} />
                <AvatarFallback>{initials(name || "U")}</AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-brand-gradient text-white shadow-lg">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-cloud">Profile photo</p>
              <p className="mt-1 text-xs text-mist">
                JPG or PNG. A square image looks best.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-hairline bg-ink/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email ?? ""}
                disabled
                className="border-hairline bg-ink/50 opacity-70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="border-hairline bg-ink/50"
                placeholder="Your company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact number</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="border-hairline bg-ink/50"
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="interest">Interest</Label>
              <Input
                id="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="border-hairline bg-ink/50"
                placeholder="What are you focused on?"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={savingProfile}>
              {savingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save profile"
              )}
            </Button>
          </div>
        </form>
      </DashboardPanel>

      <DashboardPanel
        title="Change password"
        description="Use a strong password you don't reuse elsewhere."
      >
        <form
          id="password"
          onSubmit={handlePasswordSubmit}
          className="scroll-mt-32 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="border-hairline bg-ink/50"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="border-hairline bg-ink/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="border-hairline bg-ink/50"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={savingPassword}>
              {savingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Update password
                </>
              )}
            </Button>
          </div>
        </form>
      </DashboardPanel>
    </div>
  );
}
