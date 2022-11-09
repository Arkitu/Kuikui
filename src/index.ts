import express, { RequestHandler } from "express";
import * as http from "http";
import * as https from "https";
import { promises as fs } from "fs";
import "./projectDirname.js";
import "./config.js";
import * as path from "path";
import { Page } from "./libs/Page.js";
import favicon from "serve-favicon";
import { log } from "./libs/Utils.js";

const app = express();

const credentials = {
  key: await fs.readFile(path.join(projectDirname, "ssl", "key.pem")),
  cert: await fs.readFile(path.join(projectDirname, "ssl", "cert.pem")),
};

app.set("view engine", "pug");

// Import favicon
app.use(favicon(path.join(projectDirname, "public", "img", "favicon.ico")));

// Import pages
const pageFiles = await fs.readdir(path.join(projectDirname, "dist", "pages"));
for (const pageFile of pageFiles) {
  const p: Page = (
    await import(path.join(projectDirname, "dist", "pages", pageFile))
  ).default;

  log(`Importing page ${p.url}`);

  let handlers: RequestHandler[] = [];

  if (p.path.endsWith(".pug")) {
    handlers.push(async (req, res) => {
      log(`Rendering page ${p.url}`);
      res.render(
        path.join(projectDirname, "public", p.path),
        await p.getArgs(req)
      );
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

// Match all requests except those with points in the path
app.get(/^((?!\.).)*$/g, (req, res) => {
  // Log 404 in red
  log(`\x1b[31m404\x1b[0m : Rendering page ${req.path}`);
  res.sendFile(path.join(projectDirname, "public", "html", "404.html"));
});

// Match requests for files in the public directory
app.use(express.static(path.join(projectDirname, "public")));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(config.httpPort, config.domain, () => {
  log(`HTTP server listening on port ${config.httpPort}`);
});

httpsServer.listen(config.httpsPort, config.domain, () => {
  log(`HTTPS server listening on port ${config.httpsPort}`);
});
