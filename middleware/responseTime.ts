import { Application } from "oak/mod.ts";
import { difference } from "datetime/mod.ts";

export function responseTime(app: Application) {
  app.use(async (ctx, next) => {
    const time = Date.now();
    await next();
    ctx.response.headers.set(
      "X-Response-Time",
      `${Date.now() - time}ms`,
    );
  });
}
