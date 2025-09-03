import { Server } from "http";
import mongoose from "mongoose";
import { envVariable } from "./app/config/enVariable";
import app from "./app";
import { seedAdmin } from "./app/utils/seedAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVariable.DB_URL);
    console.log(`Connected to mongoDB!`);

    server = app.listen(envVariable.PORT, () => {
      console.log(`Server is running at : ${envVariable.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

// ifi function
(async () => {
  await startServer();
  // admin
  await seedAdmin();
})();

// uncaught exception error
process.on("uncaughtException", (error) => {
  console.log(`Uncaught exception err..Server shutting down .... `, error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// sigterm ---> signal termination error
process.on("SIGTERM", () => {
  console.log(`Signal termination error, SIGTERM....Server shutting down`);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
