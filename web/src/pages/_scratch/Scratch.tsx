import { useEffect, useState } from "react";

import {
  PasswordInput,
  PasswordInputWithStrength
} from "@/par/cmp/form/PasswordInput";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { SimpleFormItem } from "@/par/cmp/form/SimpleFormItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/par/cmp/form/DatePicker";

/* ============================ */

export function Scratch() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: ""
    },
    mode: "onBlur"
  });
  const { getValues } = form;

  const onSubmit = values => {
    console.log(values);
  };

  return (
    <div className='max-h-full w-full max-w-full overflow-y-auto p-8'>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name='name'
            rules={{
              required: "Please enter a name"
            }}
            render={({ field }) => (
              <SimpleFormItem
                label='Name'
                desc='This is your public display name'
              >
                <Input placeholder='Enter your name' {...field} />
              </SimpleFormItem>
            )}
          />
          <FormField
            name='email'
            rules={{
              required: "Please enter your email"
            }}
            render={({ field }) => (
              <SimpleFormItem label='Email'>
                <Input placeholder='Enter your email' {...field} />
              </SimpleFormItem>
            )}
          />
          <FormField
            name='password'
            rules={{
              required: "Please enter your password"
            }}
            render={({ field }) => (
              <SimpleFormItem label='Password'>
                <PasswordInputWithStrength
                  placeholder='Enter a good password'
                  {...field}
                />
              </SimpleFormItem>
            )}
          />
          <FormField
            name='confirmPassword'
            rules={{
              required: "Please confirm your password",
              validate: value =>
                value === getValues("password") || "Passwords do not match"
            }}
            render={({ field }) => (
              <SimpleFormItem label='Confirm Password'>
                <PasswordInput placeholder='Enter password again' {...field} />
              </SimpleFormItem>
            )}
          />
          <FormField
            name='dateOfBirth'
            rules={{
              required: "This is required"
            }}
            render={({ field }) => (
              <SimpleFormItem
                // noControl
                label='Date of birth'
                desc='Your date of birth is used to calculate your age.'
              >
                <DatePicker value={field.value} onChange={field.onChange} />
              </SimpleFormItem>
            )}
          />
          <Button>Done</Button>
        </form>
      </Form>
    </div>
  );
}
