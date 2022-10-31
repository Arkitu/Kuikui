import { Config } from "../config.js";

declare global {
    var config: Config;
    var projectDirname: string;
}

export {};