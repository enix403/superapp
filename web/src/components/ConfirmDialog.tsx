import isPromise from "p-is-promise";
import { CircleAlertIcon } from "lucide-react";

import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  title = "Are you absolutely sure?",
  subtitle = "This action cannot be undone.",
  actionButton = "Delete",
  onConfirm,
  children
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actionButton?: ReactNode;
  onConfirm?: () => unknown;
} & PropsWithChildren) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className='flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4'>
          <div
            className='flex size-9 shrink-0 items-center justify-center rounded-full border'
            aria-hidden='true'
          >
            <CircleAlertIcon className='opacity-80' size={16} />
          </div>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className='mt-4'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            loading={loading}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              let result: unknown = onConfirm?.();
              if (isPromise(result)) {
                setLoading(true);
                result.finally(() => {
                  setOpen(false);
                });
              } else {
                setOpen(false);
              }
            }}
          >
            {actionButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
