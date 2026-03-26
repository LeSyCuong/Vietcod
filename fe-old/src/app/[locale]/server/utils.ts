// src/app/[locale]/server/utils.ts
import fs from "fs";
import path from "path";
import axiosInstance from "../utils/axiosInstance";
/**
 * Load i18n messages (server-side)
 */
export async function loadMessages(locale: string) {
  const dir = path?.join(process.cwd(), "src", "i18n", "messages", locale);
  const messages: Record<string, Record<string, string>> = {};

  if (!fs.existsSync(dir)) return {};

  fs.readdirSync(dir).forEach((file) => {
    const key = file.replace(".json", "");
    const filePath = path?.join(dir, file);
    const raw = fs?.readFileSync(filePath, "utf8");
    messages[key] = JSON.parse(raw || "");
  });

  return messages;
}

/**
 * Load config from backend (server-side)
 */
export async function loadConfig(locale: string) {
  try {
    console.log("locale", locale);
    const response = await axiosInstance.get(`/config/lang/${locale || "en"}`);
    const data = response?.data || [];
    return data?.[0] || {};
  } catch (error) {
    console.error(error);
    return {};
  }
}
