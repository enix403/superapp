import { SimpleFormItem } from "@/components/form/SimpleFormItem";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { HashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { UploadBlock } from "./file-input/UploadBlock";
import { FullImageUploadBlock } from "./file-input/FullImageUploadBlock";
import { AvatarChanger } from "./file-input/AvatarChanger";

export function Scratch() {
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

  return (
    <div className='pb-40'>
      {/* <AvatarChanger initialImageSrc='/profile_img_01.png' /> */}
      <AvatarChanger />
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
                <FullImageUploadBlock
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
                <UploadBlock
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
  );
}
