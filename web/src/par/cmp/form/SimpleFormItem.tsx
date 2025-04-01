import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { PropsWithChildren, ReactNode } from "react";

export function SimpleFormItem({
  label,
  children,
  desc,
  noControl = false,
  className
}: {
  label?: ReactNode;
  desc?: ReactNode;
  noControl?: boolean;
  className?: string;
} & PropsWithChildren) {
  if (!noControl) {
    children = <FormControl>{children}</FormControl>;
  }

  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      {children}
      {desc && <FormDescription>{desc}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
