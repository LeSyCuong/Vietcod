import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "./globals.css";
import { loadMessages, loadConfig } from "./server/utils";
import { AuthProvider } from "./Auth/context/AuthContext";
import { fontMap } from "./fonts";
import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";

const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export async function generateMetadata(props: any): Promise<Metadata> {
  const { locale } = await props.params;

  if (!locale) notFound();

  const config = await loadConfig(locale);

  return {
    title: config.title || "Vina Elastic",
    description: config.description || "",
    openGraph: {
      title: config.ogTitle || config.title || "Vina Elastic",
      description:
        config.description?.trim() ||
        "Vina Elastic | Providing international-standard plastic production and packaging solutions.",
      locale: `${locale}_VN`,
      type: "website",
      url: config.url || "https://vinaelastic.site",
      siteName: config.name || "Vina Elastic",
      images: [
        {
          url: config.img || "/assets/images/lightblack.jpg",
          width: 1200,
          height: 630,
          alt: config.name || "Vina Elastic Preview",
        },
      ],
    },
    metadataBase: new URL(config.url || "https://vinaelastic.site"),
    icons: {
      icon: {
        url: config.logo || "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
    },
  };
}

export default async function LocaleLayout(props: any) {
  const locale = (await props.params).locale;

  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await loadMessages(locale);
  const config = await loadConfig(locale);
  const fontConfig = fontMap[config.font as keyof typeof fontMap];
  const fontClass = fontConfig?.className || "";

  return (
    <html lang={locale} suppressHydrationWarning className={fontClass}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GoogleOAuthProvider clientId={client_id}>
            <ThemeProvider attribute="class" defaultTheme="light">
              <AuthProvider>{props.children}</AuthProvider>
            </ThemeProvider>
          </GoogleOAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
