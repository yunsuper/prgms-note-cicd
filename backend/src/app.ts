import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import { settings, PORT, CORS_ALLOWED_ORIGIN } from "./settings";
import userRouter from "./routes/users";
import noteRouter from "./routes/notes";
import healthRouter from "./routes/healthcheck";

const app = express();

app.use(
    cors({
        origin: CORS_ALLOWED_ORIGIN,
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/", (req, res) => {
    res.send("Dev-Connect 백엔드 서버 정상 작동 중!");
});

app.use("/users", userRouter);

app.use("/notes", noteRouter); // Base: /notes
app.use("/healthcheck", healthRouter); // Base: /healthcheck

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.sendStatus(500);
});

export { app };
