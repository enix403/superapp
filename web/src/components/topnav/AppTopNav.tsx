import { AvatarDropdown } from "./AvatarDropdown";
import { Bell, MessageSquareMore, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { useAuthState } from "@/stores/auth-store";

export function AppTopNav() {
  const { token } = useAuthState();
  const isLoggedIn = Boolean(token);
  return (
    <nav className='flex shrink-0 items-center bg-[#1D212C] px-4 py-2.5 text-white'>
      <Link to={isLoggedIn ? "/app" : "/"}>
        <h1 className='font-graph-editor text-xl tracking-tighter'>
          <span className='font-extrabold text-[#FFF331]'>frame</span>
          <span className=''>craft</span>
        </h1>
      </Link>

      {isLoggedIn ? (
        <div className='ml-auto flex items-center'>
          {/* <button className='rounded-md bg-[#333847] p-2.5 tc hover:bg-[#272c3b]'>
            <Search className='size-5' strokeWidth={2} />
          </button>
          <Separator
            orientation='vertical'
            className='mx-2.5 !h-6 bg-[#414654]'
          />
          <button className='mr-1.5 rounded-md bg-[#333847] p-2.5 tc hover:bg-[#272c3b]'>
            <MessageSquareMore className='size-5' strokeWidth={2} />
          </button>
          <button className='mr-3.5 rounded-md bg-[#333847] p-2.5 tc hover:bg-[#272c3b]'>
            <Bell className='size-5' strokeWidth={2} />
          </button> */}

          <AvatarDropdown />
        </div>
      ) : (
        <div className='ml-auto flex items-center gap-x-2'>
          <Link to='/auth/login'>
            <button className='flex rounded bg-[#FFF331] px-2.5 py-1.5 font-medium tracking-wide text-[#333847] tc hover:bg-yellow-300'>
              Login
            </button>
          </Link>
          <Link to='/auth/sign-up'>
            <button className='flex rounded bg-[#FFF331]/20 px-2.5 py-1.5 tracking-wide text-[#FFF331] tc hover:bg-[#FFF331]/30'>
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
