import express, { Request, Response } from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    "origin": "http://localhost:5173",
    "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
app.use(cookieparser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

export default app;