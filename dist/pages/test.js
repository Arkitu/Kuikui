import { Page } from "../libs/Page.js";
export default new Page("/test", "pug/test.pug", async (req) => {
    return {
        title: "Test",
        message: `Voici votre user agent : ${req.get("User-Agent")}}`,
    };
});
