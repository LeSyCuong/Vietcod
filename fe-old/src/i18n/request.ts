import { getRequestConfig } from "next-intl/server";
import fs from "fs";
import path from "path";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

function loadMessages(locale: string) {
  const dir = path.join(process.cwd(), "src", "i18n", "messages", locale);
  const messages: Record<string, any> = {};

  if (!fs.existsSync(dir)) {
    return {};
  }

  fs.readdirSync(dir).forEach((file) => {
    const key = file.replace(".json", "");
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    messages[key] = JSON.parse(raw);
  });

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = hasLocale(routing.locales, requestLocale)
    ? requestLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: loadMessages(locale),
  };
});
