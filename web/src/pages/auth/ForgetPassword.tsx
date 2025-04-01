import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { apiRoutes } from "@/lib/api-routes";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AppTopNav } from "@/components/topnav/AppTopNav";

function ForgetPasswordForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const forgetPassMut = useMutation({
    mutationFn: apiRoutes.forgetPasswordInit,
    onSuccess: (data, variables, context) => {
      const { email } = variables;
      navigate("./sent", { state: { email } });
    }
  });

  const onSubmit = handleSubmit(values => {
    forgetPassMut.mutate(values as any);
  });

  return (
    <Card className='max-w-sm flex-1 shrink-0'>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Forgot Your Password ?</CardTitle>
        <CardDescription>
          Enter your email to get a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className='grid gap-6'>
            <div className='grid gap-6'>
              <ErrorDisplay
                error={forgetPassMut.error}
                map={{
                  val_err: "Please fill all the input fields"
                }}
              />
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter email'
                  {...register("email")}
                />
              </div>
              <Button
                loading={forgetPassMut.isPending}
                type='submit'
                className='w-full'
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function ForgetPasswordPage() {
  return (
    <div className='flex h-full max-h-full flex-col overflow-hidden bg-muted'>
      <AppTopNav />
      <div className='flex flex-1-y flex-col items-stretch px-6 py-10 lg:pt-[10vh] xl:pt-[14vh] 2xl:pt-[16vh]'>
        <div className='flex justify-center'>
          <ForgetPasswordForm />
        </div>
      </div>
    </div>
  );
}

export function ForgetPasswordEmailSentPage() {
  const { state } = useLocation();

  return (
    <div className='flex h-full max-h-full flex-col overflow-hidden bg-muted'>
      <AppTopNav />
      <div className='flex flex-1-y flex-col items-stretch px-6 py-10 lg:pt-[10vh] xl:pt-[14vh] 2xl:pt-[16vh]'>
        <div className='flex justify-center'>
          <Alert variant='default' className="flex-1 max-w-lg">
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Email Sent</AlertTitle>
            <AlertDescription className='max-w-full'>
              <p>
                An email has been sent to your inbox at{" "}
                <strong className='text-foreground'>{state?.email}</strong>
              </p>
              <p>Kindly check your inbox</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
