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

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, BOT_TOKEN } = process.env;

app.post("/webhook", async (req, res) => {
  // Log yêu cầu
  console.log('Received webhook:', JSON.stringify(req.body, null, 2));

  // Kiểm tra xem có message không
  if (!req.body.message) {
    return res.sendStatus(200); // Trả về 200 nếu không có message
  }

  const chatId = req.body.message.chat.id; // ID của cuộc hội thoại
  const receivedText = req.body.message.text; // Nội dung tin nhắn

  // Xử lý và phản hồi lại tin nhắn
  const responseText = `Bạn đã nói: ${receivedText}`;
  await sendMessage(chatId, responseText);

  // Gửi phản hồi HTTP 200 để xác nhận đã nhận tin nhắn
  res.sendStatus(200);
});

async function sendMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const data = {
    chat_id: chatId,
    text: text,
  };

  await axios.post(url, data);
}

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  console.log("receive get method");
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
