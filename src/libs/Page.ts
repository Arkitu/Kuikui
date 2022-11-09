import { Request } from "express";

export class Page {
  url: string;
  path: string;
  getArgs: (req: Request) => Promise<any>;

  constructor(url: string, path: string, getArgs?: (req: Request) => Promise<any>) {
    this.url = url;
    this.path = path;
    this.getArgs =
      getArgs ||
      (async () => {
        return {};
      });
  }
}
