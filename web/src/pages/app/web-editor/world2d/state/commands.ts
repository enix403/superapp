import { Subject } from "rxjs";

export type Command =
  | { type: "recenter" }
  | { type: "set-zoom"; zoomPercent: number };

export const commandsSubject = new Subject<Command>();

export function sendEditorCommand(command: Command) {
  commandsSubject.next(command);
}
