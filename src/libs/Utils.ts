import { promises as fs } from "fs";

export async function importJSON(path: string): Promise<any> {
  return JSON.parse((await fs.readFile(path)).toString());
}

/**
 * Custom function to log with a time indicator and colors
 */
export function log(...args: string[]) {
  const now = new Date();
  console.log(
    `\x1b[36m${now.getDay()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}\x1b[0m`,
    ...args
  );
}
