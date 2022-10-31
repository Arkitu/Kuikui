import { promises as fs } from "fs";
import "./projectDirname.js";
import * as path from "path";
global.config = JSON.parse((await fs.readFile(path.join(projectDirname, "config.json"))).toString());
