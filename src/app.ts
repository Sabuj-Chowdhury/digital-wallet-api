import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// root route of the API
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "welcome to Digital wallet api!",
  });
});

export default app;
