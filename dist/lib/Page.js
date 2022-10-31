import { promises as fs } from "fs";
import { addToHtmlHead } from "./Utils.js";
import * as path from "path";
export class Page {
    html;
    stylesNames;
    url;
    path;
    constructor(url) {
        this.url = url;
        this.path = path.join(projectDirname, "pages", url);
    }
    async init() {
        this.html = (await fs.readFile(path.join(this.path, "index.html"))).toString();
        this.stylesNames = JSON.parse((await fs.readFile(path.join(this.path, "styles.json"))).toString());
        for (let styleName of this.stylesNames) {
            this.css = await this.getCssFromName(styleName);
        }
        return this;
    }
    set css(css) {
        this.html = addToHtmlHead(this.html, `<style>${css}</style>`);
    }
    async getCssFromName(name) {
        let cssPath = "";
        if (name.startsWith("./")) {
            cssPath = `${this.path}${name.slice(2)}`;
        }
        else {
            cssPath = path.join(projectDirname, "styles", name);
        }
        return (await fs.readFile(cssPath)).toString();
    }
}
