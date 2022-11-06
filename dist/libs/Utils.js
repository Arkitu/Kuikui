import { promises as fs } from "fs";
export async function importJSON(path) {
    return JSON.parse((await fs.readFile(path)).toString());
}
