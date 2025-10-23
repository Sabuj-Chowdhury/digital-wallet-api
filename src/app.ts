import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";
import { envVariable } from "./app/config/enVariable";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: envVariable.FRONTEND_URL,
    credentials: true,
  })
);

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
