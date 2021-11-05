import { Application, Status, isHttpError } from "oak/mod.ts";
import { red, bold } from "fmt/colors.ts";
import { html } from "util/path.ts";

export function error(app: Application) {
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (isHttpError(err)) {
        switch (err.status) {
          case Status.NotFound:
            ctx.response.status = 200;
            ctx.response.headers.set("cache-control", "no-cache");
            ctx.response.type = "text/html; charset=utf-8";
            await ctx.send({ root: html, path: "pages/404.html", gzip: true });
            break;

          default:
            ctx.response.status = err.status;
            ctx.response.body = `<!DOCTYPE html>
              <html>
                <head>
                <style>
                  h1, p {
                    white-space: pre-wrap;
                  }
                </style>
                </head>
                <body>
                  <h1>${err.status} - ${err.name}</h1>
                </body>
              </html>`;
            break;
        }
        console.log("Error:", red(bold(`${err.status} - ${err.message}`)));
      } else if (err instanceof Error) {
        ctx.response.status = 500;
        ctx.response.body = `<!DOCTYPE html>
        <html>
          <body>
            <h1>500 - Internal Server Error</h1>
          </body>
        </html>`;
        console.log("Unhandled Error:", red(bold(err.message)));
        console.log(err.stack);
      }
    }
  });
}
