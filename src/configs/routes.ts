import React from "react";

export interface RouteConfig {
  path: string;
  exact: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?:
    | React.LazyExoticComponent<(_props: any) => JSX.Element>
    | ((_props: any) => JSX.Element);
  redirect?: boolean;
  to?: string;
  animation?: string;
  layout?: LayoutType;
  disableInProduction?: boolean;
}

export const LayoutOptions = {
  BLANK: "BlankLayout",
  MAIN: "MainLayout",
};

export type LayoutType = "BlankLayout" | "MainLayout";

export default [
  {
    path: "/getting-started",
    exact: true,
    component: React.lazy(() => import("src/pages/home")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/holder/identity",
    exact: true,
    component: React.lazy(() => import("src/pages/holder/Identity")),
    layout: LayoutOptions.MAIN,
  },

  {
    path: "/holder/identity/provider",
    exact: true,
    component: React.lazy(() => import("src/pages/holder/Identity/Provider")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/holder/identity/provider/request/:requestID",
    exact: true,
    component: React.lazy(
      () => import("src/pages/holder/Identity/Provider/Requestv2")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/holder/identity/provider/requestv2",
    exact: true,
    component: React.lazy(
      () => import("src/pages/holder/Identity/Provider/Requestv2")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/holder/identity/provider/request/portal/:requestID",
    exact: true,
    component: React.lazy(() => import("src/pages/Portal")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/holder/identity/provider/request/kyc/:requestID",
    exact: true,
    component: React.lazy(
      () => import("src/pages/holder/Identity/Provider/Kyc")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/holder/identity/verification/:id",
    exact: true,
    component: React.lazy(
      () => import("src/pages/holder/Identity/verification")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/holder/services",
    exact: true,
    component: React.lazy(() => import("src/pages/holder/Services")),
    layout: LayoutOptions.MAIN,
  },

  {
    path: "/holder/services/attestation/:id",
    exact: true,
    component: React.lazy(
      () => import("src/pages/holder/Services/Attestation")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/holder",
    exact: true,
    redirect: true,
    to: "/holder/identity",
  },
  //issuer
  {
    path: "/issuer/profile/signin",
    exact: true,
    component: React.lazy(
      () => import("src/pages/issuer/Profile/components/SignIn")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/issuer/profile/register",
    exact: true,
    component: React.lazy(
      () => import("src/pages/issuer/Profile/components/Register")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/issuer/profile/detail",
    exact: true,
    component: React.lazy(
      () => import("src/pages/issuer/Profile/components/Detail")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/issuer/profile",
    exact: true,
    component: React.lazy(() => import("src/pages/issuer/Profile")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/issuer/claims",
    exact: true,
    component: React.lazy(() => import("src/pages/issuer/Claims")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/issuer/claims/new-claims",
    exact: true,
    component: React.lazy(() => import("src/pages/issuer/Claims/NewClaims")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/issuer/registries",
    exact: true,
    component: React.lazy(() => import("src/pages/issuer/Registries")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/issuer/registries/new-registry",
    exact: true,
    component: React.lazy(
      () => import("src/pages/issuer/Registries/NewRegistries")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/issuer/schemas",
    exact: true,
    component: React.lazy(() => import("src/pages/issuer/Schemas")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/issuer*",
    exact: true,
    redirect: true,
    to: "/issuer/profile",
  },
  //verifier
  {
    path: "/verifier/profile/signin",
    exact: true,
    component: React.lazy(
      () => import("src/pages/verifier/Profile/components/SignIn")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/verifier/profile/register",
    exact: true,
    component: React.lazy(
      () => import("src/pages/verifier/Profile/components/Register")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/verifier/profile/detail",
    exact: true,
    component: React.lazy(
      () => import("src/pages/verifier/Profile/components/Detail")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/verifier/profile",
    exact: true,
    component: React.lazy(() => import("src/pages/verifier/Profile")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/verifier/services",
    exact: true,
    component: React.lazy(() => import("src/pages/verifier/Services")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/verifier/services/new-service",
    exact: true,
    component: React.lazy(
      () => import("src/pages/verifier/Services/NewServices")
    ),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/verifier*",
    exact: true,
    redirect: true,
    to: "/verifier/profile",
  },
  {
    path: "/test",
    exact: true,
    component: React.lazy(() => import("src/components/TestComponent")),
    layout: LayoutOptions.MAIN,
  },
  {
    path: "/",
    exact: true,
    redirect: true,
    to: "/getting-started",
  },
] as RouteConfig[];
