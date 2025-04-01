import { WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LayoutGraphTitle() {
  return (
    <nav className='flex items-center justify-between border-b px-4 py-2'>
      <p className='text-xl font-bold tracking-tight'>Plan Layout Graph</p>
      <Button
        variant='ghost'
        className='flex items-center gap-x-2 text-blue-600'
      >
        <WandSparkles size={20} />
        Use Auto Layout
      </Button>
    </nav>
  );
}
