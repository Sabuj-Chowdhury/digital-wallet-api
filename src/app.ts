import express, { Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1", router);

// root route of the API
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "welcome to Digital wallet api!",
  });
});

// global error Handler
app.use(globalErrorHandler);

// NOT found
app.use(notFound);

export default app;
