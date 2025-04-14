import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import "~/styles/globals.css";
import { Loading } from "./shared/ui/Loading";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./shared/ui/AlertDialog";
import { deleteEverything } from "./shared/lib/data";

dayjs.locale("ru");

export function meta() {
  return [{ title: "Block — Тренировки, чтобы держать себя в форме" }];
}

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/icon-96x96.png", type: "image/png", sizes: "96x96" },
  {
    rel: "icon",
    href: "/icon.svg",
    type: "image/svg+xml",
  },
  {
    rel: "shortcut icon",
    href: "/icon.ico",
  },
  {
    rel: "apple-touch-icon",
    href: "/apple-touch-icon.png",
    sizes: "180x180",
  },
  {
    rel: "manifest",
    href: "/manifest.webmanifest",
  },

  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "preload",
    href: "/fonts/Medium.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/Medium.woff",
    as: "font",
    type: "font/woff",
    crossOrigin: "anonymous",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-title" content="Block" />
        <Meta />
        <Links />
      </head>
      <body>
        <div data-vaul-drawer-wrapper>{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <Loading />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center pb-28">
        <img src="/shah_i_mat.svg" alt="Александр Шахов I" />
        <h1 className="mt-5 text-center text-3xl font-black">
          Эта страница не найдена. Увы
        </h1>
        <Link
          to="/"
          className="bg-muted mt-5 rounded-2xl px-4 py-3 font-medium"
        >
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center pb-28">
      <img src="/lottie.svg" alt="lottie" />
      <h1 className="mt-5 text-center text-3xl font-black">
        Кажется, что-то пошло не так
      </h1>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="mt-5 rounded-2xl bg-red-500/30 px-4 py-3 font-medium text-red-500 transition-transform active:scale-[0.95]">
            Удалить все данные (крайний случай)
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить все данные?</AlertDialogTitle>
            <AlertDialogDescription>
              Это необратимое действие
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500/20 text-red-500"
              onClick={async () => {
                await deleteEverything();
                navigate("/onboarding");
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
