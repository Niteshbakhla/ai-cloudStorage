import axios from "axios";

export async function getFileAsBase64(url) {
            const response = await axios.get(url, { responseType: "arraybuffer" });

            const base64 = Buffer.from(response.data).toString("base64");

            return base64;
}


export async function downloadFileAsBuffer(url) {
            const response = await axios.get(url, { responseType: "arraybuffer" });
            return Buffer.from(response.data);
}