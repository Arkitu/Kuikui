import {promises as fs} from "fs";
import "./projectDirname.js";
import * as path from "path";

export interface Config {
  domain: string;
  port: number;
}

global.config = JSON.parse(
  (await fs.readFile(path.join(projectDirname, "config.json"))).toString()
); //as unknown as Config;
