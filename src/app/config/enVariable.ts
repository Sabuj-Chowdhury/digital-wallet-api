import dotenv from "dotenv";

dotenv.config();

interface IEnv {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
}

const requiredVariables = ["PORT", "DB_URL", "NODE_ENV"];

const loadEnv = (): IEnv => {
  requiredVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required env variables :${key} `);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const envVariable = loadEnv();
