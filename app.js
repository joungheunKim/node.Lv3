const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const postRouter = require("./routes/post.js");
// const commentRouter = require("./routes/comment.js");
// const userRouter = require("./routes/users.js")
// const authRouter = require("./routes/auth.js")

// const connect = require("./schemas");
// connect();

// body-parser Middleware를 쓰기위한 문법
app.use(express.json())
// urlencoded 브라우저 접속시 폼데이터를 받을 수있게해줌
app.use(express.urlencoded({ extended: false }));
// 브라우저가 서버에 전달하는 쿠키는 req.cookies 에 저장된다
app.use(cookieParser());
// POST메소드로 들어오는 바디 데이터를 사용하기위해 필요한 문법
// 인줄 알았으나, use 는 모든 메소드(get post put delete)에 적용이 된다
app.use("/",[postRouter]);//,commentRouter,userRouter,authRouter

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});