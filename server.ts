import { Application } from "oak/mod.ts";
import { cyan } from "fmt/colors.ts";
import { error } from "./middleware/error.ts";
import { logger } from "./middleware/logger.ts";
import { responseTime } from "./middleware/responseTime.ts";
import { router } from "./router.ts";

// setup
const port = 8000;

const app = new Application();

// app:middlewares
error(app);

logger(app);
responseTime(app);

// init router
app.use(router.routes());
app.use(router.allowedMethods());

app.use((ctx) => {
  ctx.throw(404);
});

app.addEventListener("listen", () => {
  console.log(`Listening on ${cyan(`http://localhost:${port}`)}`);
});

await app.listen({ port });
