import {
  createBrowserRouter,
  redirect,
  type RouteObject,
  type LazyRouteFunction,
} from "react-router";
import { layouts } from "@/presentation/layouts/layoutsMap";

interface RouteMeta {
  path: string;
  auth?: boolean;
  roles?: string[];
  layout?: keyof typeof layouts;
}

const metaModules = import.meta.glob<{ default: RouteMeta }>(
  "@/presentation/views/**/*.meta.ts",
  { eager: true }
);

// Страницы — лениво
const pageModules = import.meta.glob("@/presentation/views/**/*.page.tsx");

const createLazyRouteFunction = (
  filePath: string,
  meta: RouteMeta
): LazyRouteFunction<RouteObject> => {
  return async () => {
    const mod = await pageModules[filePath]() as { default: React.ComponentType };
    const Component = mod.default;
    const Layout = layouts[meta.layout || "default"] ?? layouts.default;

    return {
      Component: () => (
        <Layout>
          <Component />
        </Layout>
      ),
      loader: meta.auth
        ? async () => {
          const token = localStorage.getItem("token");
          if (!token) throw redirect("/login");

          const user = JSON.parse(localStorage.getItem("user") || "{}");
          if (meta.roles && !meta.roles.includes(user.role)) {
            throw redirect("/403");
          }
          return null;
        }
        : undefined,
    };
  };
};

const routes: RouteObject[] = Object.entries(metaModules)
  .map(([metaPath, metaModule]): RouteObject | null => {
    const meta = metaModule.default;
    const pagePath = metaPath.replace(/\.meta\.ts$/, ".page.tsx");

    const path = meta.path;
    if (!path || !(pagePath in pageModules)) return null;

    return {
      path,
      lazy: createLazyRouteFunction(pagePath, meta),
    } as RouteObject;
  })
  .filter((r): r is RouteObject => r !== null);


export const router = createBrowserRouter(routes);
