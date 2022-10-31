import * as https from 'https';
import * as http from 'http';
import { promises as fs, existsSync } from 'fs';
import { Page } from './lib/Page.js';
import "./projectDirname.js";
import "./config.js";
import * as path from 'path';
const requestListener = async (req, res) => {
    if (req.url === "/")
        req.url = "/index";
    if (!existsSync(path.join(projectDirname, "pages", req.url))) {
        res.writeHead(404);
        res.end();
        return;
    }
    let page = await (new Page(req.url)).init();
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(page.html);
};
const options = {
    key: await fs.readFile(path.join(projectDirname, "ssl", "key.pem")),
    cert: await fs.readFile(path.join(projectDirname, "ssl", "cert.pem"))
};
const server = https.createServer(options, requestListener);
server.listen(config.port, config.domain, () => {
    console.log(`Server is running on https://${config.domain}:${config.port}`);
});
http.createServer((req, res) => {
    res.writeHead(301, { "Location": `https://${config.domain}:${config.port}${req.url}` });
    res.end();
}).listen(8080, config.domain);
