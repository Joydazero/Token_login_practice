const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const users = [
  {
    user_id: "test",
    user_password: "1234",
    user_name: "테스트 유저",
    user_info: "테스트 유저입니다",
  },
];

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5501", "http://localhost:3000"],
    methods: ["OPTIONS", "POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const secretKey = "ozcodingschool";

app.post("/", (req, res) => {
  const { userId, userPassword } = req.body;
  const userInfo = users.find(
    (el) => el.user_id === userId && el.user_password === userPassword
  );
  // 유저정보가 없는 경우
  if (!userInfo) {
    return res.status(401).send("로그인 실패");
  } else {
    // 1. 유저정보가 있는 경우 accessToken을 발급하는 로직을 작성하세요.(sign)
    const accessToken = jwt.sign({ userId: userInfo.user_id }, secretKey, {
      expiresIn: 1000 * 60 * 10,
    });
    // 2. 응답으로 accessToken을 클라이언트로 전송하세요. (res.send 사용)
    return res.send(accessToken);
  }
});


app.get("/", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("토큰 없음");

  const accessToken = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(accessToken, secretKey);
    const userInfo = users.find((el) => el.user_id === payload.userId);
    return res.send(userInfo);
  } catch (err) {
    return res.status(403).send("토큰 검증 실패");
  }
});

app.listen(3000, () => console.log("서버 실행!"));