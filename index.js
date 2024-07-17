const express = require('express')
const app = express()
const {Client} = require("undici");
const {wasmEnc} = require("./utils/LoadWasm");
app.use(express.json());

const client = new Client("https://online.mbbank.com.vn");
const defaultHeaders = {
    'Cache-Control': 'no-cache',
    'Accept': 'application/json, text/plain, */*',
    'Authorization': 'Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm',
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Origin": "https://online.mbbank.com.vn",
    "Referer": "https://online.mbbank.com.vn/",
    "Content-Type": "application/json; charset=UTF-8",
    app: "MB_WEB",
};
let wasmData = null;

async function request(options) {

    if (!wasmData) {
        const wasm = await client.request({
            method: "GET",
            path: "/assets/wasm/main.wasm",
            headers: defaultHeaders,
        });
        wasmData = Buffer.from(await wasm.body.arrayBuffer());
    }
}

request().then(() => {
        console.log("Wasm loaded");
    }
).catch((err) => {
        console.log(err);
    }
)
app.get('/', (req, res) => {
    res.send('hello world')
})
app.post('/', async (req, res) => {
    const receivedData = req.body;
    let data = await wasmEnc(wasmData, receivedData.data, "0")
    res.status(200).json({
        data: data
    });
})
app.listen(1811, () => {
    console.log('Server is running on port 3000')
})
