import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import contactsRouter from "./routes/contacts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/contacts", contactsRouter);

if (process.env.NODE_ENV !== "serverless" && process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 9001;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
export const handler = serverless(app);
