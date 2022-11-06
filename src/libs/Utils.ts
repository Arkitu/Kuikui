import { promises as fs } from "fs";

export async function importJSON (path: string): Promise<any> {
  return JSON.parse((await fs.readFile(path)).toString());
}