import { App } from "./app";
import { ServiceProvider } from "./services";

const service = ServiceProvider();

App(service).listen(service("env").PORT, () => {
  console.log(`API server listening to ${service("env").PORT}...`);
});
