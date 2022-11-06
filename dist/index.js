import express from "express";
import * as http from "http";
import * as https from "https";
import { promises as fs } from "fs";
import "./projectDirname.js";
import "./config.js";
import * as path from "path";
const app = express();
const credentials = {
    key: await fs.readFile(path.join(projectDirname, "ssl", "key.pem")),
    cert: await fs.readFile(path.join(projectDirname, "ssl", "cert.pem")),
};
app.set("view engine", "pug");
const pageFiles = await fs.readdir(path.join(projectDirname, "dist", "pages"));
for (const pageFile of pageFiles) {
    const p = (await import(path.join(projectDirname, "dist", "pages", pageFile))).default;
    console.debug(`Importing page ${p.url}`);
    let handlers = [];
    if (p.path.endsWith(".pug")) {
        handlers.push(async (req, res) => {
            res.render(path.join(projectDirname, "public", p.path), await p.getArgs(req));
        });
    }
    if (p.path.endsWith(".html")) {
        handlers.push(async (req, res) => {
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
httpServer.listen(8080);
httpsServer.listen(8443);
