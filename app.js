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
  console.log(req.body);

  // In ra header của yêu cầu
  console.log("api_key:",req.query.api_key);

  // Lấy tham số query string từ URL
  const apiKey = req.query.api_key;

  res.sendStatus(200);
});

app.get("/webhook", async (req, res) => {
  console.log("request:",req.query);
  const challenge = req.query.hub.challenge
  return challenge
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
