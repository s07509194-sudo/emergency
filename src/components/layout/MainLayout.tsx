import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="w-full min-w-0 flex-1 p-3 sm:p-4 md:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}