// src/app/[locale]/admin/config/page.tsx
import ConfigAdminPageClient from "./ConfigAdminPageClient";
import { notFound } from "next/navigation";
import { authAxiosInstance } from "../../utils/axiosInstance";

type PageProps = {
  params: { locale: string };
};

async function fetchConfigs(locale: string) {
  try {
    const response = await authAxiosInstance.get(`/config`, {
      headers: {
        "Cache-Control": "max-age=60",
      },
    });
    if (response?.status !== 200) throw new Error("Cannot fetch configs");
    const data = response?.data;
    return data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function ConfigAdminPage({ params }: PageProps) {
  const locale = params.locale;

  if (!locale) return notFound();

  const initialData = await fetchConfigs(locale);

  return <ConfigAdminPageClient initialData={initialData} />;
}
