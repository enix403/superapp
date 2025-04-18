import { AvatarChanger } from "@/components/form/file-input/AvatarChanger";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { uploadFiles } from "@/components/form/file-input/uploading";

import { useMutation } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api-routes";
import { useAuthState } from "@/stores/auth-store";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();

  const queryKey = ["me", token];

  return useMutation({
    mutationFn: async (base64Image: string | null) => {
      let profilePictureUrl: string | null = null;

      if (base64Image) {
        const [uploadedUrl] = await uploadFiles([base64Image]);
        profilePictureUrl = uploadedUrl;
      }

      await apiRoutes.updateMe({ profilePictureUrl });
      return profilePictureUrl;
    },

    // Optimistic update
    onMutate: async (newAvatar: string | null) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousUser = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        profilePictureUrl: newAvatar ? "" : null // temporary empty string if uploading
      }));

      return { previousUser };
    },

    onSuccess: newUrl => {
      console.log(newUrl);
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        profilePictureUrl: newUrl
      }));
    },

    onError: (_err, _vars, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(queryKey, context.previousUser);
      }
    }
  });
}

export function UserAvatarChanger() {
  const { user } = useCurrentUser();
  const { mutateAsync: updateAvatar } = useUpdateAvatar();

  return (
    <AvatarChanger
      initialImageSrc={user?.profilePictureUrl || null}
      onSave={async (base64Image: string | null) => {
        await updateAvatar(base64Image);
      }}
    />
  );
}
