import { SimpleFormItem } from "@/components/form/SimpleFormItem";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { HashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { AvatarChanger } from "@/components/form/file-input/AvatarChanger";
import { CoveredImageUpload } from "@/components/form/file-input/CoveredImageUpload";
import { GenericUpload } from "@/components/form/file-input/GenericUpload";
import { AppLayout } from "@/components/app-layout/AppLayout";
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

export function ImageFormsPage() {
  const form = useForm({
    defaultValues: {
      single: [],
      images: []
    },
    mode: "onBlur"
  });

  const onSubmit = async values => {
    // const images: File[] = values.images;
    // const urls = await uploadFiles(images);
    // console.log(urls);
    console.log(values);
  };

  const { user } = useCurrentUser();
  const { mutateAsync: updateAvatar } = useUpdateAvatar();

  return (
    <AppLayout>
      <div className='pb-40'>
        {/* <AvatarChanger initialImageSrc='/profile_img_01.png' /> */}
        <AvatarChanger
          initialImageSrc={user?.profilePictureUrl || null}
          onSave={async (base64Image: string | null) => {
            await updateAvatar(base64Image);
          }}
        />
        <br />
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name='single'
              rules={{
                validate: images =>
                  images.length > 0 || "Please upload at least one image"
              }}
              render={({ field, formState: { isSubmitting } }) => (
                <SimpleFormItem
                  label='Single Image'
                  desc='Upload your single images here'
                  noControl
                >
                  <CoveredImageUpload
                    {...field}
                    disabled={isSubmitting || field.disabled}
                  />
                </SimpleFormItem>
              )}
            />
            <FormField
              name='images'
              rules={{
                validate: images =>
                  images.length > 0 || "Please upload at least one image"
              }}
              render={({ field, formState: { isSubmitting } }) => (
                <SimpleFormItem
                  label='Images'
                  desc='Upload your images here'
                  noControl
                >
                  <GenericUpload
                    {...field}
                    disabled={isSubmitting || field.disabled}
                  />
                </SimpleFormItem>
              )}
            />
            <Button
              variant='default'
              className='mt-4'
              icon={HashIcon}
              effect='ringHover'
              type='submit'
              loading={form.formState.isSubmitting}
            >
              Upload
            </Button>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
}
