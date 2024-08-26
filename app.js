import express from 'express';
import nacl from 'tweetnacl'; // Thư viện để xác thực chữ ký
import { Buffer } from 'buffer'; // Thư viện Buffer để xử lý dữ liệu nhị phân

const app = express();
app.use(express.json());

const { PORT = 3000, PUBLIC_KEY } = process.env; // Đảm bảo PUBLIC_KEY được cung cấp qua biến môi trường
const DISCORD_PUBLIC_KEY = 'b39a33af8247082ed9f2097ec367313ab4be878117263b6b73ab57ede296fe2f';

// Xác thực chữ ký
function verifyRequest(signature, timestamp, body) {
    const message = Buffer.from(timestamp + body);
    const signatureBuffer = Buffer.from(signature, 'hex');
    const publicKeyBuffer = Buffer.from(DISCORD_PUBLIC_KEY, 'hex');

    return nacl.sign.detached.verify(message, signatureBuffer, publicKeyBuffer);
}

app.post('/webhook/interactions', (req, res) => {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const rawBody = JSON.stringify(req.body);

    console.log('signature:', signature);
    console.log('timestamp:', timestamp);
    console.log('rawBody:', rawBody);

    // Xác thực chữ ký
    if (!verifyRequest(signature, timestamp, rawBody)) {
        return res.status(401).send('Invalid request signature');
    }

    // Xử lý yêu cầu PING từ Discord
    if (req.body.type === 1) {
        return res.status(200).json({ type: 1 });
    }

    console.log('Handling interaction of type', req.body.type);

    // Xử lý các yêu cầu từ người dùng
    if (req.body.type === 2) {
        const commandName = req.body.data.name;
        console.log(`Received interaction with command ${commandName}`);

        return res.status(200).json({
            type: 4,
            data: {
                content: `You sent the command: ${commandName}!`
            }
        });
    }

    res.status(200).send('Received request');
});

app.get('/webhook/interactions', (req, res) => {
    console.log("req.body:", req.body)
    console.log("req.headers:", req.headers)

    res.status(200).send('Received request');
});

// Cấu hình CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
