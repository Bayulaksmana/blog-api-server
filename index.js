import { clerkMiddleware } from '@clerk/express'
import express from "express"
import connectDB from "./lib/connectDB.js"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import webhookRouter from "./routes/webhook.route.js"
import daerahRouter from "./routes/daerah.route.js"
import univRouter from "./routes/univ.route.js"
import upRouter from "./routes/signup.route.js"
import inRouter from "./routes/signin.route.js"
import googleRoute from './routes/google.route.js'
// import mahasiswaRouter from './routes/mahasiswa.route.js'
// import cors from "cors"


const server = express();
// server.use(cors(process.env.CLIENT_URL_FE))
server.use(clerkMiddleware())
server.use("/webhooks", webhookRouter);
server.use(express.json());


server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173")
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.path.startsWith('/google-auth')) {
        res.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        res.header("Cross-Origin-Resource-Policy", "cross-origin");
    }
    next();
});


server.use("/google-auth", googleRoute)
server.use("/signup", upRouter)
server.use("/signin", inRouter)


// server.use("/mahasiswa", mahasiswaRouter)
server.use("/users", userRouter);
server.use("/posts", postRouter);
server.use("/comments", commentRouter);
server.use("/daerah", daerahRouter);
server.use("/universitas", univRouter)


server.use((error, req, res, next) => {
    res.status(error.status || 500);

    res.json({
        message: error.message || "❌ Access to Database is error (index.js):",
        status: error.status,
        stack: error.stack,
    });
});

server.listen(3000, () => {
    console.log("✅ Server is Up");
    connectDB();
})