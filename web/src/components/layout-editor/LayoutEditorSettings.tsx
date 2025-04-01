import { createContext, useContext } from "react";

interface LayoutEditorSettings {
  readOnly: boolean;
}

export const LayoutEditorSettingsContext = createContext<LayoutEditorSettings>({
  readOnly: false
});

export function useLayoutEditorSettings() {
  return useContext(LayoutEditorSettingsContext);
}
