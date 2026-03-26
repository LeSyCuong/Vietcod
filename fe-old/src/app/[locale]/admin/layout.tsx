import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AuthGuard from "../Auth/AuthGuard";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar locale={locale} />
        <main className="flex-1 overflow-y-auto px-5">
          <AuthGuard>{children}</AuthGuard>
        </main>
      </div>
    </div>
  );
}
