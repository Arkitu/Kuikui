import { promises as fs } from "fs";
export async function importJSON(path) {
    return JSON.parse((await fs.readFile(path)).toString());
}
export function log(...args) {
    const now = new Date();
    console.log(`\x1b[36m${now.getDay()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}\x1b[0m`, ...args);
}
