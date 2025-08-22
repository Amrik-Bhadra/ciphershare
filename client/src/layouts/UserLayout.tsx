import Header from "../components/common/Header";
import { Outlet, useMatches } from "react-router-dom";
import Footer from "../components/common/Footer";
import { useEffect } from "react";

const UserLayout = () => {
  const matches = useMatches();

  useEffect(() => {
    const currentRoute = matches.find((route) => route?.handle?.title);
    if (currentRoute?.handle?.title) {
      document.title = currentRoute.handle.title;
    }
  }, [matches]);

  return (
    <main className="h-screen w-screen max-h-screen bg-gray-200 dark:bg-[#282828] flex flex-col">
      <Header />

      <section className="flex-1 overflow-y-auto">
        <Outlet />
      </section>

      <Footer />
    </main>
  );
};

export default UserLayout;
