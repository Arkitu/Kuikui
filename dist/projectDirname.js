import { dirname } from "dirname-filename-esm";
import * as path from "path";
const __dirname = dirname(import.meta);
global.projectDirname = path.dirname(__dirname);
