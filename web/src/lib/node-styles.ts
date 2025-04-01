// Node styles (colors) are defined in a separate file since they change based on theme

import { BedDouble, Droplet, Eclipse, Grape, LogIn, Tv } from "lucide-react";
import { NodeTypeId } from "./nodes";

// Hack
type LucideIconType = typeof BedDouble;

interface NodeStyle {
  Icon: LucideIconType;
  iconColor: string;
  mapRectColor: string;
}

export const appNodeStyle: Record<string, NodeStyle> = {
  living: {
    Icon: Tv,
    // iconColor: "#ed6f4f",
    iconColor: "#e56f78",
    mapRectColor: "#ffc5b4"
  },
  bedroom: {
    Icon: BedDouble,
    iconColor: "#936b94",
    mapRectColor: "#f3def3"
  },
  kitchen: {
    Icon: Grape,
    iconColor: "#76bf43",
    mapRectColor: "#caf2aa"
  },
  bathroom: {
    Icon: Droplet,
    iconColor: "#358aa7",
    mapRectColor: "#d3e7f0"
  },
  balcony: {
    Icon: Eclipse,
    iconColor: "#c49049",
    mapRectColor: "#ffe192"
  },
  fdoor: {
    Icon: LogIn,
    iconColor: "#2d4043",
    mapRectColor: "#000000"
  }
} satisfies Record<NodeTypeId, NodeStyle>;
