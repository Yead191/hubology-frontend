"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Lock, Search } from "lucide-react";
import { toast } from "sonner";

import { getImageUrl } from "@/lib/getImageUrl";
import type { VendorProfile } from "@/types";
import {
  availabilityOptions,
  consultationTypeOptions,
  expertiseOptions,
  yearsExperienceOptions,
} from "@/lib/validators";
import {
  changePassword,
  updateUserProfile,
} from "@/helpers/next-fetch/profileActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardPanel } from "@/features/dashboard/ui";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function isVendorRole(role?: string) {
  const r = (role ?? "").toLowerCase();
  return r === "vendor" || r === "expert";
}

type ProfileUser = {
  name?: string;
  email?: string;
  image?: string;
  company?: string;
  interest?: string;
  contact?: string;
  contactNo?: string;
  role?: string;
  vendorProfile?: Partial<VendorProfile> | null;
};

export function ProfileForms({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const vendor = isVendorRole(user.role);
  const vp = user.vendorProfile ?? {};

  const [name, setName] = React.useState(user.name ?? "");
  const [company, setCompany] = React.useState(user.company ?? "");
  const [interest, setInterest] = React.useState(user.interest ?? "");
  const [contact, setContact] = React.useState(
    user.contact ?? user.contactNo ?? vp.contactNo ?? "",
  );
  const [jobTitle, setJobTitle] = React.useState(vp.jobTitle ?? "");
  const [bio, setBio] = React.useState(vp.bio ?? "");
  const [expertise, setExpertise] = React.useState<string[]>(
    vp.expertise ?? [],
  );
  const [yearsExperience, setYearsExperience] = React.useState(
    vp.yearsExperience ?? "",
  );
  const [degree, setDegree] = React.useState(vp.degree ?? "");
  const [linkedin, setLinkedin] = React.useState(vp.linkedin ?? "");
  const [hourlyRate, setHourlyRate] = React.useState(
    vp.hourlyRate != null ? String(vp.hourlyRate) : "",
  );
  const [availability, setAvailability] = React.useState(vp.availability ?? "");
  const [consultationTypes, setConsultationTypes] = React.useState<string[]>(
    vp.consultationTypes ?? [],
  );
  const [expertiseQuery, setExpertiseQuery] = React.useState("");

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

  const filteredExpertise = expertiseOptions.filter((opt) =>
    opt.toLowerCase().includes(expertiseQuery.trim().toLowerCase()),
  );

  function toggleExpertise(opt: string) {
    setExpertise((prev) =>
      prev.includes(opt)
        ? prev.filter((v) => v !== opt)
        : prev.length >= 6
          ? prev
          : [...prev, opt],
    );
  }

  function toggleConsultationType(opt: string) {
    setConsultationTypes((prev) =>
      prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt],
    );
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (vendor) {
      if (!jobTitle.trim()) {
        toast.error("Job title is required.", { id: "profile" });
        return;
      }
      if (!contact.trim()) {
        toast.error("Contact number is required.", { id: "profile" });
        return;
      }
      if (bio.trim().length < 10) {
        toast.error("Bio must be at least 10 characters.", { id: "profile" });
        return;
      }
      if (expertise.length < 1) {
        toast.error("Select at least one area of expertise.", { id: "profile" });
        return;
      }
      if (!yearsExperience) {
        toast.error("Select your years of experience.", { id: "profile" });
        return;
      }
      if (!hourlyRate || Number(hourlyRate) <= 0) {
        toast.error("Enter a valid hourly rate.", { id: "profile" });
        return;
      }
      if (!availability) {
        toast.error("Select your availability.", { id: "profile" });
        return;
      }
      if (consultationTypes.length < 1) {
        toast.error("Select at least one consultation type.", {
          id: "profile",
        });
        return;
      }
    }

    setSavingProfile(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (company.trim()) fd.append("company", company.trim());
      if (imageFile) fd.append("image", imageFile);

      if (vendor) {
        const vendorProfile: VendorProfile = {
          jobTitle: jobTitle.trim(),
          contactNo: contact.trim(),
          bio: bio.trim(),
          expertise,
          yearsExperience,
          degree: degree.trim() || undefined,
          linkedin: linkedin.trim() || undefined,
          hourlyRate: Number(hourlyRate),
          availability,
          consultationTypes,
          ...(vp.applicationStatus
            ? { applicationStatus: vp.applicationStatus }
            : {}),
        };
        fd.append("vendorProfile", JSON.stringify(vendorProfile));
      } else {
        if (interest.trim()) fd.append("interest", interest.trim());
        if (contact.trim()) fd.append("contact", contact.trim());
      }

      const res = await updateUserProfile(fd);
      if (!res.success) {
        if (res?.error && Array.isArray(res.error)) {
          res.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "profile" });
          });
        } else {
          toast.error(res.message || "Could not update profile.", {
            id: "profile",
          });
        }
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
        confirmPassword,
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
        title={vendor ? "Expert profile" : "Profile information"}
        description={
          vendor
            ? "Update the details members see on your public expert profile."
            : "Update how you appear across Hubology."
        }
      >
        <form onSubmit={handleProfileSubmit} className="space-y-8">
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

          {/* Shared identity fields */}
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
                required={vendor}
              />
            </div>

            {!vendor && (
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
            )}

            {vendor && (
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job title</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="border-hairline bg-ink/50"
                  placeholder="e.g. Growth Advisor"
                  required
                />
              </div>
            )}
          </div>

          {vendor && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  maxLength={600}
                  className="border-hairline bg-ink/50"
                  placeholder="Tell members about your background and how you help…"
                  required
                />
                <p className="text-xs text-mist">
                  {bio.trim().length}/600 · at least 40 characters
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <Label>Areas of expertise</Label>
                  {expertise.length > 0 && (
                    <span className="text-xs text-faint">
                      {expertise.length}/6 selected
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  <Input
                    value={expertiseQuery}
                    onChange={(e) => setExpertiseQuery(e.target.value)}
                    placeholder="Search expertise fields…"
                    aria-label="Search expertise fields"
                    className="border-hairline bg-ink/50 pl-11"
                  />
                </div>
                {filteredExpertise.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredExpertise.map((opt) => (
                      <CheckboxCard
                        key={opt}
                        label={opt}
                        checked={expertise.includes(opt)}
                        onToggle={() => toggleExpertise(opt)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-hairline bg-white/2 px-4 py-3 text-sm text-faint">
                    No fields match “{expertiseQuery}”.
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of experience</Label>
                  <Select
                    value={yearsExperience}
                    onValueChange={setYearsExperience}
                  >
                    <SelectTrigger
                      id="yearsExperience"
                      className="border-hairline bg-ink/50"
                    >
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearsExperienceOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">
                    Hourly rate — starting from (USD)
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-mist">
                      $
                    </span>
                    <Input
                      id="hourlyRate"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="border-hairline bg-ink/50 pl-8"
                      placeholder="e.g. 100"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree">
                    Highest degree / certification{" "}
                    <span className="text-faint">(optional)</span>
                  </Label>
                  <Input
                    id="degree"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="border-hairline bg-ink/50"
                    placeholder="e.g. MBA, CFA, Ph.D"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger
                      id="availability"
                      className="border-hairline bg-ink/50"
                    >
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((opt) => (
                        <SelectItem key={opt.key} value={opt.key}>
                          {opt.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="linkedin">
                    LinkedIn profile URL{" "}
                    <span className="text-faint">(optional)</span>
                  </Label>
                  <Input
                    id="linkedin"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="border-hairline bg-ink/50"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Consultation types</Label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {consultationTypeOptions.map((opt) => (
                    <CheckboxCard
                      key={opt}
                      label={opt}
                      checked={consultationTypes.includes(opt)}
                      onToggle={() => toggleConsultationType(opt)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

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
