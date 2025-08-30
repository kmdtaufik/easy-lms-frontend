"use client";

import { useState, useEffect, useTransition } from "react";
import { authClient } from "@/lib/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Upload, Save } from "lucide-react";
import { FileUploader } from "@/components/uploader/file-uploader";

export default function ProfilePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [isMutating, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPreview(session.user.image || "");
    }
  }, [session]);

  const hasChanges =
    (session?.user?.name || "") !== name ||
    (imageKey && imageKey !== session?.user?.image);

  const handleSave = () => {
    if (!hasChanges || !session?.user) return;
    startTransition(async () => {
      try {
        // Assume update user endpoint (adjust if different in your auth client)
        const { error } = await authClient.user.update({
          name: name.trim(),
          image: imageKey || preview || undefined,
          fetchOptions: {
            onSuccess: () => {
              toast.success("Profile updated");
            },
            onError: () => {
              toast.error("Update failed");
            },
          },
        });
        if (error) toast.error(error.message || "Update failed");
      } catch (e) {
        toast.error(e.message || "Unexpected error");
      }
    });
  };

  // Optional: remove avatar
  const removeAvatar = () => {
    setImageKey("");
    setPreview("");
  };

  if (sessionLoading && !session)
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );

  if (!session)
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>
              Please log in to view your profile.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );

  const initials = (session.user.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="p-6 max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            View and update your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Avatar */}
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    imageKey
                      ? `https://easy-lms.t3.storage.dev/${imageKey}`
                      : preview || ""
                  }
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <FileUploader
                  value={imageKey}
                  onChange={(k) => {
                    setImageKey(k);
                    if (k) setPreview(`https://easy-lms.t3.storage.dev/${k}`);
                  }}
                  className="w-40"
                  buttonLabel="Upload"
                />
                {preview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeAvatar}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload or change your avatar
              </p>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={session.user.email} disabled />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              disabled={isMutating || !hasChanges}
              onClick={() => {
                // reset
                setName(session.user.name || "");
                setImageKey("");
                setPreview(session.user.image || "");
              }}
            >
              Reset
            </Button>
            <Button disabled={!hasChanges || isMutating} onClick={handleSave}>
              {isMutating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Metadata</CardTitle>
          <CardDescription>Read-only reference data</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">User ID</span>
            <code className="px-2 py-1 bg-muted rounded">
              {session.user.id}
            </code>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <span>{session.user.role}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
