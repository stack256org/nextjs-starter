"use client";

import { useActionState, useState } from "react";
import { updateProfile, type ActionResult } from "@/lib/auth/actions";
import { Alert, Avatar, Button, Input } from "@/components/ui";

interface ProfileFormProps {
  name: string;
  email: string;
  image: string | null;
}

export function ProfileForm({ name, email, image }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(updateProfile, null);

  // Live preview so the avatar reflects a pasted URL before saving.
  const [previewName, setPreviewName] = useState(name);
  const [previewImage, setPreviewImage] = useState(image ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar
          src={previewImage || null}
          name={previewName || email}
          size="2xl"
          shape="squircle"
        />
        <p className="max-w-[40ch] text-sm text-base-content/70">
          Your avatar comes from the image URL below. Leave it empty to show
          your initials instead.
        </p>
      </div>

      <Input
        name="name"
        label="Display name"
        defaultValue={name}
        onChange={(e) => setPreviewName(e.target.value)}
        placeholder="Amara Okonkwo"
        maxLength={100}
        required
      />

      <Input
        name="image"
        type="url"
        label="Avatar URL"
        description="Any publicly reachable image."
        defaultValue={image ?? ""}
        onChange={(e) => setPreviewImage(e.target.value)}
        placeholder="https://example.com/avatar.png"
      />

      <Input
        label="Email"
        description="Your email is your sign-in identity and cannot be changed here."
        value={email}
        disabled
        readOnly
      />

      {state && (
        <Alert tone={state.ok ? "success" : "error"} assertive={!state.ok}>
          {state.message}
        </Alert>
      )}

      <div>
        <Button type="submit" variant="primary" loading={isPending}>
          {isPending ? "Saving" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
