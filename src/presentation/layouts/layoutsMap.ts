import type { ReactNode, FC } from "react";
import DefaultLayout from "./default/DefaultLayout";
import Home from "./home/HomeLayout";

export type LayoutComponent = FC<{ children: ReactNode }>;

export const layouts: Record<string, LayoutComponent> = {
  default: DefaultLayout,
  home: Home
};