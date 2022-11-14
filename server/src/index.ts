import { PORT } from "./env";
import app from "./app";

app.listen(PORT, () => {
  console.log(`API server listening to ${PORT}...`);
});
