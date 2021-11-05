import { Application } from "oak/mod.ts";
import { green, bold, cyan, white } from "fmt/colors.ts";

export function logger(app: Application) {
  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(
      `${white(String(ctx.response.status))} - ${green(
        ctx.request.url.protocol.toUpperCase() + ":" + ctx.request.method,
      )} ${cyan(ctx.request.url.pathname)} - ${bold(String(rt))}`,
    );
  });
}
