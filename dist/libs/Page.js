export class Page {
    url;
    path;
    getArgs;
    constructor(url, path, getArgs) {
        this.url = url;
        this.path = path;
        this.getArgs = getArgs;
    }
}
