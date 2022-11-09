import { Monitor } from "forever-monitor";
import "./config.js";
import { join } from "path";
import { dirname } from "dirname-filename-esm";
const __dirname = dirname(import.meta);
let monitor = new Monitor(join(__dirname, "index.js"), {
    max: Infinity,
    silent: false
});
monitor.start();
