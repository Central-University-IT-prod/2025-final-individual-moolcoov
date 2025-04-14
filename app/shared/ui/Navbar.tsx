import { Link, useLocation, useNavigation } from "react-router";
import { BulletListIcon, DumbBellIcon, HeartIcon, PersonIcon } from "./icons";
import { cn } from "~/shared/lib/utils";
import { BlockIcon, BlockLogo } from "./icons/Block";

const links = [
  {
    label: "Тренировки",
    icon: <DumbBellIcon size={30} />,
    href: "/workouts",
  },
  {
    label: "Упражнения",
    icon: <BulletListIcon size={30} />,
    href: "/exercises",
  },
  {
    label: "Профиль",
    icon: <PersonIcon size={30} />,
    href: "/profile",
  },
];

export const Navbar = () => {
  const pathname = useLocation().pathname;

  return (
    <>
      <div className="fixed bottom-0 z-40 w-full px-5 pb-(--bottom-navbar) lg:hidden">
        <nav className="bg-navbar flex h-[70px] w-full items-center rounded-full px-2.5 backdrop-blur-lg">
          <div className="flex w-full items-center">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  "text-navbar-inactive flex flex-1 flex-col items-center gap-1 transition-transform active:scale-[0.9]",
                  {
                    "text-navbar-active": pathname === link.href,
                  },
                )}
              >
                {link.icon}
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="bg-background-200 fixed top-0 left-0 hidden h-screen flex-col items-start gap-5 border-r px-3 py-6 lg:flex lg:w-20 xl:w-2xs xl:px-4">
        <Link to="/workouts" className="hidden xl:block">
          <div className="px-2 py-1 transition-transform active:scale-[0.95]">
            <BlockLogo size={55} />
          </div>
        </Link>
        <Link to="/workouts" className="xl:hidden">
          <div className="transition-transform active:scale-[0.95]">
            <BlockIcon size={55} />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-1.5">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-muted-foreground flex aspect-square h-auto items-center justify-center gap-5 rounded-2xl px-4 py-3 transition-transform active:scale-[0.95] xl:aspect-auto xl:justify-start [&>svg]:w-6 xl:[&>svg]:w-7",
                {
                  "bg-muted text-white": pathname === link.href,
                },
              )}
            >
              {link.icon}
              <span className="hidden font-medium xl:block">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
