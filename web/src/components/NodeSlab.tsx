import { appNodeStyle } from "@/lib/node-styles";
import { idToNodeType } from "@/lib/nodes";
import clsx from "clsx";
import { Package } from "lucide-react";
import { ComponentProps } from "react";

// #04ACB0

export function NodeSlab({
  title,
  subtitle,
  className,
  typeId,
  showBorder = false,
  ...divProps
}: {
  title: string;
  subtitle?: string;
  typeId: string;
  showBorder?: boolean;
} & ComponentProps<"div">) {
  const style = appNodeStyle[typeId];

  const color = style.iconColor;

  return (
    <div
      {...divProps}
      className={clsx(
        "flex flex-row items-center gap-x-2.5 rounded-[8px] border bg-white p-2.5 pr-6",
        "transition-colors",
        className
      )}
      style={{
        borderColor: showBorder ? color : undefined
      }}
    >
      <div
        className='rounded-[6px] p-1.5 text-white'
        style={{
          backgroundColor: color
        }}
      >
        {/* <Package size={26} /> */}
        <style.Icon size={26} />
      </div>

      <div className='flex-1-fit space-y-1.5 font-graph-editor'>
        <p className='text-sm leading-[1] font-semibold text-[color:#1B1B2E]'>
          {title}
        </p>
        {subtitle && (
          <p className='text-[size:0.7rem] leading-[1] font-medium text-[color:#7C7D87]'>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
