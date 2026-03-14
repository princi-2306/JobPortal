import express from 'express';
import 'dotenv/config'
import cors from 'cors' // if the whiteListing is required from backend to deliver the data to forntend
import cookieParser from "cookie-parser"
// routes imports
import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"
import jobRouter from "./routes/job.routes.js"
import applicationRouter from "./routes/application.routes.js"

const app = express();

// middlewares
app.use(express.json());       // accepting this size of amount of json data here
app.use(express.urlencoded({
    extended:true,
    limit: "16kb"
}));
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.CORS_ORIGIN
    ],
    credentials: true
})) // if cors is requested for backend to deliver the data



// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/job", jobRouter)
app.use("/api/v1/applications", applicationRouter)

app.get("/", (req, res) => res.send(`Server running on port`));

export default app;