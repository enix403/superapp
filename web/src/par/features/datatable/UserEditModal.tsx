import Joi from "joi";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogHeader
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { apiRoutes } from "@/lib/api-routes";
import { PropsWithChildren, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn, VoidCallback } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { SimpleFormItem } from "@/par/cmp/form/SimpleFormItem";
import { optimisticUpdateFlow } from "@/par/cmp/form/optim-update-flow";
import { DatePicker } from "@/par/cmp/form/DatePicker";

// 📌 User Type Definition
interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  fullName: string;
  isActive: boolean;
  isVerified: boolean;
  bio?: string;
  gender?: "male" | "female";
  dateOfBirth?: string | Date;
  phoneCountryCode?: string;
  phoneNumber?: string;
  addressCountry?: string;
  addressCity?: string;
  addressArea?: string;
  addressZip?: string;
}

// 📌 Validation Schema (Joi)
const userSchema = Joi.object({
  fullName: Joi.string().min(3),
  email: Joi.string().email({ tlds: { allow: false } }),
  role: Joi.string().valid("user", "admin"),
  gender: Joi.string().valid("male", "female").allow(null, ""),
  dateOfBirth: Joi.alternatives().try(Joi.string(), Joi.date()).allow(null, ""),
  phoneCountryCode: Joi.string().allow(null, ""),
  phoneNumber: Joi.string().allow(null, ""),
  addressCountry: Joi.string().allow(null, ""),
  addressCity: Joi.string().allow(null, ""),
  addressArea: Joi.string().allow(null, ""),
  addressZip: Joi.string().allow(null, ""),
  bio: Joi.string().allow(null, ""),
  isActive: Joi.boolean(),
  isVerified: Joi.boolean()
}).unknown(true);

const listQueryKey = ["users", "list"];
const userQueryKey = (userId: string) => ["users", userId];

export function UserEditDialogInner({
  user,
  closeModal
}: {
  user: User;
  closeModal: VoidCallback;
} & PropsWithChildren) {
  const form = useForm<User>({
    resolver: joiResolver(userSchema),
    defaultValues: user,
    mode: "onBlur"
  });

  const { reset } = form;

  // Reset form when user data loads
  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: (updatedFields: Partial<User>) =>
      apiRoutes.updateUser(updatedFields, user.id),

    ...optimisticUpdateFlow<User>({
      queryClient,
      itemId: user.id,
      itemKey: userQueryKey(user.id),
      listKey: listQueryKey,
      onError: () => {
        toast.error("Failed to update user");
      },
      onSuccess: () => {
        closeModal();
        toast.success("User updated successfully");
      }
    })
  });

  const onSubmit = (updates: Partial<User>) => {
    delete updates["email"];
    delete updates["isVerified"];

    updateUserMutation.mutate(updates);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='contents'>
        <div className='overflow-y-auto'>
          <div className='space-y-4 p-6'>
            {/* Name */}
            <FormField
              name='fullName'
              render={({ field }) => (
                <SimpleFormItem
                  label='Full Name'
                  desc='This is your public display name'
                >
                  <Input placeholder='Enter your name' {...field} />
                </SimpleFormItem>
              )}
            />
            {/* Email */}
            <FormField
              name='email'
              render={({ field }) => (
                <SimpleFormItem label='Email'>
                  <Input placeholder='Enter your email' {...field} />
                </SimpleFormItem>
              )}
            />
            {/* Role */}
            <FormField
              name='role'
              render={({ field }) => (
                <SimpleFormItem label='Role' noControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='user'>User</SelectItem>
                      <SelectItem value='admin'>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </SimpleFormItem>
              )}
            />
            {/* Bio */}
            {/* TODO: Character Limit */}
            <FormField
              name='bio'
              render={({ field }) => (
                <SimpleFormItem label='bio'>
                  <Textarea
                    placeholder='Write a few sentences about yourself'
                    {...field}
                  />
                </SimpleFormItem>
              )}
            />
            {/* Gender */}
            <FormField
              name='gender'
              render={({ field }) => (
                <SimpleFormItem label='Gender' noControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='male'>Male</SelectItem>
                      <SelectItem value='female'>Female</SelectItem>
                    </SelectContent>
                  </Select>
                </SimpleFormItem>
              )}
            />
            {/* Date Of Birth */}
            <FormField
              name='dateOfBirth'
              render={({ field }) => (
                <SimpleFormItem
                  noControl
                  label='Date of birth'
                  desc='Your date of birth is used to calculate your age.'
                >
                  <DatePicker value={field.value} onChange={field.onChange} />
                </SimpleFormItem>
              )}
            />
            {/* Phone */}
            <FormLabel>Phone</FormLabel>
            <div className='mt-1 flex space-x-2'>
              <FormField
                name='phoneCountryCode'
                render={({ field }) => (
                  <SimpleFormItem className='w-20'>
                    <Input {...field} placeholder='+1' />
                  </SimpleFormItem>
                )}
              />
              <FormField
                name='phoneNumber'
                render={({ field }) => (
                  <SimpleFormItem className='flex-1'>
                    <Input {...field} placeholder='+1' />
                  </SimpleFormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormLabel className='font-bold'>Address</FormLabel>
            <div className='mt-2 flex space-x-2'>
              <FormField
                name='addressCountry'
                render={({ field }) => (
                  <SimpleFormItem className='flex-1' label='Country'>
                    <Input {...field} />
                  </SimpleFormItem>
                )}
              />
              <FormField
                name='addressCity'
                render={({ field }) => (
                  <SimpleFormItem className='flex-1' label='City'>
                    <Input {...field} />
                  </SimpleFormItem>
                )}
              />
            </div>
            <div className='mt-1 flex space-x-2'>
              <FormField
                name='addressArea'
                render={({ field }) => (
                  <SimpleFormItem className='flex-1' label='Area'>
                    <Input {...field} />
                  </SimpleFormItem>
                )}
              />
              <FormField
                name='addressZip'
                render={({ field }) => (
                  <SimpleFormItem className='w-40' label='Zip'>
                    <Input {...field} />
                  </SimpleFormItem>
                )}
              />
            </div>
            {/* Is Active */}
            <FormField
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                  <div className='space-y-0.5'>
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Activate or deactivate this user.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/*  */}
          </div>
        </div>
        <DialogFooter className='border-t px-6 py-4'>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </DialogClose>

          <Button type='submit' loading={updateUserMutation.isPending}>
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function UserEditModal({
  userId,
  children
}: { userId: string } & PropsWithChildren) {
  const [open, setOpen] = useState(false);

  const { data: user, isError } = useQuery<User>({
    queryKey: ["users", userId],
    queryFn: () => apiRoutes.getUser(userId),
    enabled: !!userId
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-2xl [&>button:last-child]:top-3.5'>
        <DialogHeader className='contents space-y-0 text-left'>
          <DialogTitle className='border-b px-6 py-4 text-base'>
            Edit profile
          </DialogTitle>
        </DialogHeader>
        {user && !isError && (
          <UserEditDialogInner user={user} closeModal={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
