import { AppTopNav } from "@/components/topnav/AppTopNav";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLocation } from "react-router";

export function SignUpCompletedPage() {
  const { state } = useLocation();

  return (
    <div className='flex h-full max-h-full flex-col overflow-hidden bg-muted'>
      <AppTopNav />
      <div className='flex flex-1-y flex-col items-stretch px-6 py-10 lg:pt-[10vh] xl:pt-[14vh] 2xl:pt-[16vh]'>
        <div className='flex justify-center'>
          <Alert variant='default' className='max-w-md flex-1'>
            <AlertCircle className='!size-5' />
            <AlertTitle className='text-lg'>
              Verify Your Email Address
            </AlertTitle>
            <AlertDescription className='max-w-full space-y-5 text-base'>
              <p>
                Thank you for signing up! We've sent a verification email to{" "}
                <strong className='text-foreground'>{state?.email}</strong>
              </p>
              <p>
                Click the verification link in the email to activate your
                account.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
