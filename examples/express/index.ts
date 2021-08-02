import express from "express";
import { BlogPost, Comment } from "./model";
import { checkerMiddleware } from "./checkerMiddleware";

const app = express();

app.post(
    '/create',
    express.raw({ type: "application/json" }),
    checkerMiddleware("BlogPost", "./model"),

    (req, res) => {
        // safe assignment since body is parsed and typechecked by checkerMiddlewar
        const post: BlogPost = req.body;

        console.log("Creating blog post", post.title);

        return res.json({ success: true }).end();
    });

app.post(
    '/comment',
    express.raw({ type: "application/json" }),
    checkerMiddleware("Comment", "./model"),

    (req, res) => {
        // safe assignment since body is parsed and typechecked by checkerMiddleware
        const comment: Comment = req.body;

        console.log("Saving comment from", comment.email);

        return res.json({ success: true }).end();
    });

app.listen(3000);
