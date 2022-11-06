import { promises as fs } from "fs";
import { addToHtmlHead } from "./Utils.js";
import * as path from "path";
import "../projectDirname.js";
import { parse as htmlParse } from "node-html-parser";
const fileTypeFolders = {
    css: "styles"
};
export class Page {
    html;
    parsedHtml;
    imports;
    url;
    path;
    constructor(url) {
        this.url = url;
        this.path = path.join(projectDirname, "pages", url);
    }
    async init() {
        this.html = (await fs.readFile(path.join(this.path, "index.html"))).toString();
        this.parsedHtml = htmlParse(this.html);
        this.imports = JSON.parse((await fs.readFile(path.join(this.path, "imports.json"))).toString());
        for (let importName of this.imports) {
            this.import(importName);
        }
        for (let element of this.parsedHtml.querySelectorAll("[snippet]")) {
            this.importSnippet(element);
        }
        return this;
    }
    set css(css) {
        this.html = addToHtmlHead(this.html, `<style>${css}</style>`);
    }
    async getCssFromPath(cssPath) {
        return (await fs.readFile(cssPath)).toString();
    }
    async import(importName) {
        let importPath = "";
        if (importName.startsWith("./")) {
            importPath = path.join(this.path, importName.slice(2));
        }
        else {
            let fileType = importName.split(".")[importName.split(".").length - 1];
            importPath = path.join(projectDirname, fileTypeFolders[fileType], importName);
        }
        if (importPath.endsWith(".css")) {
            this.css = await this.getCssFromPath(importPath);
        }
        else {
            throw new Error(`Unknown import type: ${importName}`);
        }
    }
    async importSnippet(element) {
        let snippetName = element.getAttribute("snippet");
        let snippetPath = path.join(projectDirname, "snippets", snippetName);
    }
}
