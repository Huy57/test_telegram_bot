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

app.post("/webhook", async (req, res) => {
  console.log(req.body);
  const chatId = req.body.message.chat.id; // ID của cuộc hội thoại
  const receivedText = req.body.message.text; // Nội dung tin nhắn

  // Xử lý và phản hồi lại tin nhắn
  const responseText = `Bạn đã nói: ${receivedText}`;
  await sendMessage(chatId, responseText);
  await sendMessage2(chatId, req.body);

  // Gửi phản hồi HTTP 200 để xác nhận đã nhận tin nhắn
  res.sendStatus(200);
});

// Hàm gửi tin nhắn qua Telegram API
async function sendMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const data = {
    chat_id: chatId,
    text: text,
  };

  await axios.post(url, data);
}

// Hàm gửi tin nhắn qua server
async function sendMessage2(chatId, body) {
  const url = `http://116.97.240.102:6969/webhook/telegram`;
  await axios.post(url, body);
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(8443, () => {
  console.log(`Server is listening on port: ${8443}`);
});
