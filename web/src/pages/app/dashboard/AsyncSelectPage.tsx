import { useState } from "react";
import { AsyncSelect } from "@/components/ui/async-select";
import { apiRoutes } from "@/lib/api-routes";
import { AppLayout } from "@/components/app-layout/AppLayout";

function AsyncSelectDemo() {
  const [selectedUser, setSelectedUser] = useState<any>();
  return (
    <AsyncSelect<any>
      fetcher={query => apiRoutes.getUsers({ fullName: query })}
      renderOption={user => (
        <div className='flex items-center gap-2'>
          <img
            src={"/profile_img_01.png"}
            alt={user.name}
            width={24}
            height={24}
            className='rounded-full'
          />
          <div className='flex flex-col'>
            <div className='font-medium'>{user.fullName}</div>
            <div className='text-xs text-muted-foreground'>{user.role}</div>
          </div>
        </div>
      )}
      getOptionValue={user => user.id}
      getDisplayValue={user => (
        <div className='flex items-center gap-2'>
          <img
            src={"/profile_img_01.png"}
            alt={user.name}
            width={24}
            height={24}
            className='rounded-full'
          />
          <div className='flex flex-col'>
            <div className='font-medium'>{user.fullName}</div>
          </div>
        </div>
      )}
      notFound={<div className='py-6 text-center text-sm'>No users found</div>}
      label='User'
      placeholder='Search users...'
      value={selectedUser}
      onChange={setSelectedUser}
      width='375px'
    />
  );
}

export function AsyncSelectPage() {
  return (
    <AppLayout>
      <div className='pb-40'>
        <AsyncSelectDemo />
      </div>
    </AppLayout>
  );
}
