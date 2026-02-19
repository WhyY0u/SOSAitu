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
          const api = new UserApiRepository();
          const auth: User = await api.getMe();
          
          if (meta.path === "/") {
            if (auth.fullName != null && auth.fullName.length > 2) {
              if(auth.role == "ROLE_USER") throw redirect("/user");
              if(auth.role == "ROLE_ADMINISTATOR") throw redirect("/administator");
              if(auth.role == "ROLE_OWNER") throw redirect("/owner");
              if(auth.role == "ROLE_OBLASTI_ADMINISTATOR") throw redirect("/region-admin");
              if(auth.role == "ROLE_CITY_ADMINISTRATOR") throw redirect("/city-admin");
              if(auth.role == "ROLE_SUPERVISOR") throw redirect("/supervisor");
              if(auth.role == "ROLE_SUPPORT") throw redirect("/support");
            }
          }
          
          if (meta.roles && !meta.roles.includes(auth.role)) {
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
