import { Router } from "oak/mod.ts";
import { content, html } from "util/path.ts";

export const router = new Router();

const pathnames = ["profile", "projects"];

router.get("/favicon.ico", async (ctx) => {
  await ctx.send({ root: content, path: "assets/img/favicon.ico" });
});
router.get(`/:page(${pathnames.join("|")})?`, async (ctx) => {
  await ctx.send({ root: html, path: "index.html" });
});

router.get("/api/_html/pages/:page", async (ctx) => {
  await ctx.send({ root: html, path: `pages/${ctx.params.page}.html` });
});

router.get("/cdn/:path+", async (ctx) => {
  await ctx.send({ root: content, path: ctx.params.path });
});
