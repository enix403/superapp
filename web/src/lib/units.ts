export const CELL_SIZE = 5;
export const snapToGrid = value => Math.round(value / CELL_SIZE) * CELL_SIZE;

// real unit will be METER

// meter-to-unit conversion factors
export const unitFactor = {
  m: 1,
  ft: 3.28084,
  in: 39.3701
};

// in meters
export const CELL_PHYSICAL_LENGTH = 0.2;
