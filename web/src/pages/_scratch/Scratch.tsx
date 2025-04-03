import {
  ChangeEvent,
  ComponentProps,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useState
} from "react";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { PasswordInputWithStrength } from "@/par/cmp/form/PasswordInput";

/* ============================ */

export function Scratch() {
  const [value, setValue] = useState("");

  return (
    <div className='max-h-full w-full max-w-full space-y-2 overflow-y-auto p-8'>
      <p>{value}</p>
      <PasswordInputWithStrength
        placeholder='Enter a good password'
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}
