/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";
// const nacl = require('tweetnacl'); // Thư viện để xác thực chữ ký
const app = express();
app.use(express.json());

const { BOT_TOKEN } = process.env;
const PORT = process.env.PORT || 3000;
const PUBLIC_KEY = 'b39a33af8247082ed9f2097ec367313ab4be878117263b6b73ab57ede296fe2f'

app.post("/webhook", (req, res) => {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const rawBody = JSON.stringify(req.body);
    console.log('signature:',signature);
    console.log('timestamp:',timestamp);
    console.log('rawBody:',rawBody);

    // Xác thực chữ ký
    // console.log('rawBody:',rawBody);
    // if (!verifyRequest(signature, timestamp, rawBody)) {
    //     return res.status(401).send('Invalid request signature');
    // }

    // Xử lý yêu cầu PING từ Discord
    if (req.body.type === 1) {
        return res.status(200).json({ type: 1 });
    }

    // Xử lý các loại yêu cầu khác (như các tương tác từ người dùng)
    res.status(200).json({
        type: 4,
        data: {
            content: "This is a response to your command!"
        }
    });
});

// function verifyRequest(signature, timestamp, body) {
//     const message = Buffer.from(timestamp + body);
//     const signatureBuffer = Buffer.from(signature, 'hex');
//     const publicKeyBuffer = Buffer.from(PUBLIC_KEY, 'hex');
//
//     return nacl.sign.detached.verify(
//         message,
//         signatureBuffer,
//         publicKeyBuffer
//     );
// }
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
