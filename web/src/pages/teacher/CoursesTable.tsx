import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { AppDataTable } from "@/components/table/AppDataTable";
import { TextFilter } from "@/components/table/blocks/TextFilter";
import {
  uniqueValuesFilterFn,
  UniqueValuesFilter
} from "@/components/table/blocks/UniqueValuesFilter";
import { ColumnVisibilityControl } from "@/components/table/blocks/ColumnVisibilityControl";
import { DeleteRowsButton } from "@/components/table/blocks/DeleteRowsButton";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api-routes";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type Item = {
  id: string;
  title: string;
  desc: string;
  thumbnail: string;
  videos: any[];
  enrollments: any[];
};

const columns: ColumnDef<Item>[] = [
  {
    header: "Course",
    accessorKey: "title",
    cell: ({ row }) => (
      // <div className="font-medium">{row.getValue("name")}</div>
      <div className='flex items-center gap-3 truncate'>
        <img
          className='h-32 max-h-32'
          src={
            // "https://res.cloudinary.com/dlzlfasou/image/upload/v1736358071/avatar-40-02_upqrxi.jpg"
            row.original.thumbnail
          }
          alt={"User"}
        />
        <div>
          <div className='font-medium'>{row.original.title}</div>
        </div>
      </div>
    ),
    size: 100,
    enableHiding: false,
    filterFn: (row, columnId, filterValue) => {
      const searchableRowContent =
        `${row.original.title} ${row.original.desc}`.toLowerCase();
      const searchTerm = (filterValue ?? "").toLowerCase();
      return searchableRowContent.includes(searchTerm);
    }
  },
  {
    header: "Description",
    accessorKey: "desc",
    cell: ({ row }) => {
      return <div className='truncate text-ellipsis'>{row.original.desc}</div>;
    },
    size: 120
  },
  {
    header: "Enrolled Students",
    size: 40,
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            "inline-flex items-center justify-center rounded px-2.5 py-1 font-medium",
            "text-bold bg-pink-400/20 text-pink-500"
          )}
        >
          {row.original.enrollments?.length || 0}
        </div>
      );
    }
  },
  {
    header: "Videos Count",
    size: 40,
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            "inline-flex items-center justify-center rounded px-2.5 py-1 font-medium",
            "text-bold bg-emerald-400/20 text-emerald-500"
          )}
        >
          {row.original.videos?.length || 0}
        </div>
      );
    }
  }
];

const listQueryKey = ["courses", "list", "mine"];

const useOptimisticDelete = (
  mutationFn: (payload: any) => Promise<unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async userIds => {
      await queryClient.cancelQueries({ queryKey: listQueryKey });

      const previousUsers = queryClient.getQueryData(listQueryKey);

      // Ensure userIds is always an array (supports both single & batch deletes)
      const idsToDelete = Array.isArray(userIds) ? userIds : [userIds];

      queryClient.setQueryData<Item[]>(
        listQueryKey,
        oldUsers =>
          oldUsers?.filter(user => !idsToDelete.includes(user.id)) || []
      );

      return { previousUsers };
    },
    onError: (_err, _userIds, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(listQueryKey, context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listQueryKey });
    }
  });
};

export function CoursesTable() {
  const { data = [], isLoading } = useQuery({
    queryKey: listQueryKey,
    queryFn: () => apiRoutes.getMyCourses()
    // queryFn: () => apiRoutes.getCourses()
  });

  const deleteMutation = useOptimisticDelete(apiRoutes.deleteUser);
  const batchDeleteMutation = useOptimisticDelete((userIds: string[]) =>
    apiRoutes.deleteUsersBatch({ ids: userIds })
  );

  console.log(data);

  return (
    <AppDataTable
      data={data}
      loading={isLoading}
      columns={columns}
      initialSort={
        [
          // {
          //   id: "fullName",
          //   desc: false
          // }
        ]
      }
      enableRowSelect
      renderFilters={({ table }) => (
        <>
          <div className='flex items-center gap-3'>
            <TextFilter
              table={table}
              columnName='title'
              placeholder='Filter by name or email...'
            />
            <ColumnVisibilityControl table={table} />
          </div>
          <div className='ml-auto'>
            {table.getSelectedRowModel().rows.length > 0 && (
              <DeleteRowsButton
                table={table}
                onDelete={() => {
                  const rows = table.getSelectedRowModel().rows;
                  const userIds = rows.map(row => row.original.id);
                  table.resetRowSelection();
                  return batchDeleteMutation.mutate(userIds);
                }}
              />
            )}
            {/* <UserInfoModal mode='create'>
              <Button className='ml-2' variant='default'>
                <PlusIcon className='-ms-1' strokeWidth={3} size={18} aria-hidden='true' />
                Create User
              </Button>
            </UserInfoModal> */}
          </div>
        </>
      )}
      renderActions={row => (
        <>
          <DropdownMenuGroup>
            {/* <UserInfoModal mode='edit' userId={row.original.id}>
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                <span>Edit</span>
                <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
              </DropdownMenuItem>
            </UserInfoModal> */}
            <DropdownMenuItem>
              <span>Duplicate</span>
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Archive</span>
              <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Move to project</DropdownMenuItem>
                  <DropdownMenuItem>Move to folder</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Advanced options</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Add to favorites</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <ConfirmDialog
            onConfirm={() => deleteMutation.mutate(row.original.id)}
          >
            <DropdownMenuItem
              onSelect={e => e.preventDefault()}
              className='text-destructive focus:text-destructive'
            >
              <span>Delete</span>
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </ConfirmDialog>
        </>
      )}
    />
  );
}

// enableRowExpand
// canRowExpand={row => Boolean(row.original.note)}
/* renderExpandedRow={row => (
  <div className='flex max-w-full items-start py-2 text-primary/80'>
    <span
      className='me-3 mt-0.5 flex w-7 shrink-0 justify-center'
      aria-hidden='true'
    >
      <InfoIcon className='opacity-60' size={16} />
    </span>
    <p className='flex-1-fix text-sm text-wrap'>{row.original.note}</p>
  </div>
)} */
