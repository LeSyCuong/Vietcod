// app/[locale]/user/layout.tsx
import Header from "../../modules/header/page";
import Footer from "../../modules/footer/footer";
import Sidebar from "./components/Sidebar";
import AuthGuard from "../../Auth/AuthGuard";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <div className="min-h-screen w-full flex flex-col md:flex-row">
        <div className="w-full md:w-72 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col lg:mt-15 p-5 mb-10 overflow-x-auto overflow-y-auto">
          <AuthGuard>{children}</AuthGuard>
        </div>
      </div>

      <Footer />
    </>
  );
}
