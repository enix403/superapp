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

import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useSetAuthState } from "@/stores/auth-store";
import { useForm } from "react-hook-form";
import { API_BASE_URL, apiRoutes } from "@/lib/api-routes";
import { AppTopNav } from "@/components/topnav/AppTopNav";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useLogin } from "@/hooks/useLogin";

export function LoginPage() {
  const { register, handleSubmit } = useForm();
  const loginApp = useLogin();

  const loginMut = useMutation({
    mutationFn: apiRoutes.login,
    onSuccess: ({ accessToken, user }) => {
      console.log(accessToken, user);
      loginApp(user, accessToken);
    }
  });

  const onSubmit = handleSubmit(values => {
    loginMut.mutate(values as any);
  });

  return (
    <div className='flex h-full max-h-full flex-col overflow-hidden bg-muted'>
      <AppTopNav />
      <div className='flex flex-1-fix md:p-10'>
        <div className='flex flex-1-fix overflow-hidden rounded-xl border border-border bg-white'>
          <div className='flex w-full flex-col gap-6 overflow-y-auto p-6 text-card-foreground max-lg:flex-1 sm:p-10 lg:max-w-lg'>
            <CardHeader className='text-center'>
              <CardTitle className='text-xl'>Welcome back</CardTitle>
              <CardDescription>Login with your Google account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-6'>
                <div className='flex flex-col gap-4'>
                  {/* <a href={`${API_BASE_URL}/auth/google`}>
                    <Button type='button' variant='outline' className='w-full'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='size-4'
                        viewBox='0 0 24 24'
                      >
                        <path
                          d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                          fill='currentColor'
                        />
                      </svg>
                      Login with Google
                    </Button>
                  </a> */}
                </div>
                <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                  <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                    continue with
                  </span>
                </div>
                <form onSubmit={onSubmit} className='grid gap-6'>
                  <ErrorDisplay
                    error={loginMut.error}
                    map={{
                      val_err: "Please fill all the input fields",
                      invalid_creds: "Invalid email or password"
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
                  <div className='grid gap-2'>
                    <div className='flex items-center'>
                      <Label htmlFor='password'>Password</Label>
                      <Link
                        to='/auth/forget-password'
                        className='ml-auto text-xs underline-offset-4 hover:underline'
                        tabIndex={-1}
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id='password'
                      type='password'
                      placeholder='Enter password'
                      {...register("password")}
                    />
                  </div>
                  <Button
                    loading={loginMut.isPending}
                    type='submit'
                    className='w-full'
                  >
                    Login
                  </Button>
                </form>
                <div className='text-center text-sm'>
                  Don&apos;t have an account?{" "}
                  <Link
                    to='/auth/sign-up'
                    className='underline underline-offset-4'
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </CardContent>
          </div>
          <div className='flex-1 max-lg:hidden'>
            <img
              src='/hero7.jpg'
              className='h-full w-full max-w-full object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
