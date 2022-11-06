import { Page } from "../libs/Page.js";
import { Request } from "express";

export default new Page(
  "/test",
  "pug/test.pug",
  async (req: Request) => {
    return {
      title: "Test",
      message: `Voici votre user agent : ${req.get("User-Agent")}}`,
    };
});
