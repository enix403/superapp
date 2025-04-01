import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function HomePage() {
  return (
    <div className='p-4'>
      <h1 className='mb-8 text-3xl font-light tracking-widest text-black'>
        Home
      </h1>
      <div className='flex flex-col items-start gap-y-4'>
        <Button asChild>
          <Link to='/app'>Get started</Link>
        </Button>
        <Button asChild>
          <Link to='/auth/login'>Login</Link>
        </Button>
      </div>
    </div>
  );
}
