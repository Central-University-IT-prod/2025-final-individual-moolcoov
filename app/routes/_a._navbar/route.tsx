import { Outlet } from "react-router";
import { Navbar } from "~/shared/ui/Navbar";

export default function NavbarLayout() {
  return (
    <div className="flex gap-4 pb-[90px] lg:ml-20 lg:pb-8 xl:ml-72">
      <div className="m-auto w-full max-w-5xl">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
}
