import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";
import FormData from "form-data";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathToFiles = path.join(
  __dirname,
  "ORDENS DE SERVICO",
  "ISMAEL",
  "19-04-2025"
);

function getPDFFiles() {
  const files = fs.readdirSync(pathToFiles);
  const pdfFiles = files.filter(file => file.endsWith(".pdf"));
  return pdfFiles;
}

async function sendPDFFilesToTelegram() {
  const pdfFiles = getPDFFiles();

  if (!pdfFiles.length) {
    return;
  }

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramToken || !telegramChatId) {
    console.log(
      "Vari veis de ambiente TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID n o definidas."
    );
    return;
  }

  const telegramApiUrl = `https://api.telegram.org/bot${telegramToken}/sendDocument`;

  pdfFiles.forEach(file => {
    const filePath = path.join(pathToFiles, file);
    const formData = new FormData();
    formData.append("chat_id", telegramChatId);
    formData.append("document", fs.createReadStream(filePath));

    axios
      .post(telegramApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      })
      .then(_ => {
        console.log(`Arquivo ${file} enviado com sucesso.`);
      })
      .catch(error => {
        console.error(`Erro ao enviar arquivo ${file}:`, error);
      });
  });
}

sendPDFFilesToTelegram();
