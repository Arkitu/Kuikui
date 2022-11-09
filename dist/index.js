import express from "express";
import * as http from "http";
import * as https from "https";
import { promises as fs } from "fs";
import "./projectDirname.js";
import "./config.js";
import * as path from "path";
import favicon from "serve-favicon";
import { log } from "./libs/Utils.js";
const app = express();
const credentials = {
    key: await fs.readFile(path.join(projectDirname, "ssl", "key.pem")),
    cert: await fs.readFile(path.join(projectDirname, "ssl", "cert.pem")),
};
app.set("view engine", "pug");
app.use(favicon(path.join(projectDirname, "public", "img", "favicon.ico")));
const pageFiles = await fs.readdir(path.join(projectDirname, "dist", "pages"));
for (const pageFile of pageFiles) {
    const p = (await import(path.join(projectDirname, "dist", "pages", pageFile))).default;
    log(`Importing page ${p.url}`);
    let handlers = [];
    if (p.path.endsWith(".pug")) {
        handlers.push(async (req, res) => {
            log(`Rendering page ${p.url}`);
            res.render(path.join(projectDirname, "public", p.path), await p.getArgs(req));
        });
    }
    if (p.path.endsWith(".html")) {
        handlers.push(async (req, res) => {
            log(`Rendering page ${p.url}`);
            res.sendFile(path.join(projectDirname, "public", p.path));
        });
    }
    app.get(p.url, ...handlers);
}
app.get(/^((?!\.).)*$/g, (req, res) => {
    res.sendFile(path.join(projectDirname, "public", "html", "404.html"));
});
app.use(express.static(path.join(projectDirname, "public")));
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(config.httpPort, config.domain, () => {
    log(`HTTP server listening on port ${config.httpPort}`);
});
httpsServer.listen(config.httpsPort, config.domain, () => {
    log(`HTTPS server listening on port ${config.httpsPort}`);
});
