import { App } from "./app";
import { PORT } from "./env";

App().listen(PORT, () => {
  console.log(`API server listening to ${PORT}...`);
});
