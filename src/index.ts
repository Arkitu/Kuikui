import express, { RequestHandler } from "express";
import * as http from "http";
import * as https from "https";
import { promises as fs } from "fs";
import "./projectDirname.js";
import "./config.js";
import * as path from "path";
import { Page } from "./libs/Page.js";

const app = express();

const credentials = {
  key: await fs.readFile(path.join(projectDirname, "ssl", "key.pem")),
  cert: await fs.readFile(path.join(projectDirname, "ssl", "cert.pem")),
};

app.set("view engine", "pug");

// Import pages

const pageFiles = await fs.readdir(path.join(projectDirname, "dist", "pages"));
for (const pageFile of pageFiles) {
  const p: Page = (
    await import(path.join(projectDirname, "dist", "pages", pageFile))
  ).default;

  console.debug(`Importing page ${p.url}`);

  let handlers: RequestHandler[] = [];

  if (p.path.endsWith(".pug")) {
    handlers.push(async (req, res) => {
      res.render(
        path.join(projectDirname, "public", p.path),
        await p.getArgs(req)
      );
    });
  }
  if (p.path.endsWith(".html")) {
    handlers.push(async (req, res) => {
      res.sendFile(path.join(projectDirname, "public", p.path));
    });
  }

  app.get(p.url, ...handlers);
}

// Match all requests except those with points in the path
app.get(/^((?!\.).)*$/g, (req, res) => {
  res.sendFile(path.join(projectDirname, "public", "html", "404.html"));
});

// Match requests for files in the public directory
app.use(
  express.static(path.join(projectDirname, "public"))
);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
