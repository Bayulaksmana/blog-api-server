import { clerkMiddleware } from '@clerk/express'
import express from "express"
import connectDB from "./lib/connectDB.js"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import webhookRouter from "./routes/webhook.route.js"
import daerahRouter from "./routes/daerah.route.js"
import cors from "cors"


const app = express();
app.use(cors(process.env.CLIENT_URL_FE))
app.use(clerkMiddleware())
app.use("/webhooks", webhookRouter);
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/daerah", daerahRouter);

app.use((error, req, res, next) => {
    res.status(error.status || 500);

    res.json({
        message: error.message || "❌ Access to Database is error (index.js):",
        status: error.status,
        stack: error.stack,
    });
});

app.listen(3000, () => {
    connectDB();
    console.log("✅ Server is Up");
})