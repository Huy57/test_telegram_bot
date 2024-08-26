/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const { BOT_TOKEN } = process.env;
const PORT = process.env.PORT || 3000;

app.post("/webhook", async (req, res) => {
  console.log("Tôi đã nhận được tin:",req.body);
  // Trả về phản hồi từ API được chuyển tiếp
  // Kiểm tra loại yêu cầu (type) từ Discord
  if (req.body.type === 1) {
    // Phản hồi cho một ping từ Discord
    res.status(200).json({ type: 1 });
  } else {
    // Xử lý các yêu cầu khác (nếu cần)
    res.status(200).json({
      type: 4,
      data: {
        content: "Your message has been received!"
      }
    });
  }
});

app.get("/webhook", async (req, res) => {
  console.log("request:", req.query);
  const challenge = req.query['hub.challenge'];

  if (challenge) {
    res.send(challenge);
  } else {
    res.status(400).send("Challenge not found");
  }
});



// Hàm gửi tin nhắn qua server
async function sendMessage(chatId, body, api_key) {
  const params = {
    api_key: api_key // Thay thế với giá trị thực tế
  };
  // const url = `http://116.97.240.102:6969/webhook/telegram`;
  const url = `http://116.97.240.102:6969/webhook/discord`;
  axios.post(url, body, {
      params: params // Tham số query được truyền trong cấu hình
    });
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
