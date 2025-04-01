import { RectPreview } from "@/components/RectPreview";
import { Stat } from "@/components/Stat";

export function PlotDetails() {
  return (
    <div className='shrink-0 border-t p-4 pb-16'>
      <h2 className='mb-4 font-semibold'>Plot Details</h2>

      <RectPreview
        className='mb-4'
        rectangles={[{ left: 0, top: 0, width: 100, height: 110 }]}
      />

      <Stat label='Length' value='110 ft.' />
      <Stat label='Width' value='100 ft.' />
      <Stat label='Area' value='11000 ft. sq' />
    </div>
  );
}
