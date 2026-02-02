import {
  createBrowserRouter,
  redirect,
  type RouteObject,
  type LazyRouteFunction,
} from "react-router";
import { layouts } from "@/presentation/layouts/layoutsMap";
import UserApiRepository from "@/data/repositories/user/remote/ApiUserRepository";
import type { User } from "@/domain/entities/user/User";
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
      loader: async () => {
          console.log(meta.path);
          if (meta.path === "/") {
          const api = new UserApiRepository();
          const auth: User = await api.getMe();
          if (auth.fullName != null) {
            if(auth.role == "User") throw redirect("/user");
            if(auth.role == "Administrator") throw redirect("/administator");
            if(auth.role == "Owner") throw redirect("/owner");
          }
        }
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          if (meta.roles && !meta.roles.includes(user.role)) {
            throw redirect("/403");
          }
          return null;
        },
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
