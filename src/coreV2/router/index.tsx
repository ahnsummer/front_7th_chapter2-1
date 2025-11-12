import { DomNode } from "@core/jsx/factory";
import { useEffect } from "@core/state/useEffect";
import { useMemo } from "@core/state/useMemo";
import { useState } from "@core/state/useState";
import { isNil, isNotNil } from "es-toolkit";
import qs from "query-string";

export type Route = {
  path: string;
  component: (props?: {
    pathParams?: Record<string, string>;
    queryParams?: Record<string, string>;
  }) => DomNode;
};

type RouterProps = {
  fallback: {
    notFound: () => DomNode;
    error: (error: unknown) => DomNode;
  };
};

type PathParams<
  Routes extends Record<string, Route>,
  RouteName extends keyof Routes,
> = Parameters<Routes[RouteName]["component"]>[0] extends {
  pathParams: infer PathParams;
}
  ? PathParams
  : {};

type QueryParams<
  Routes extends Record<string, Route>,
  RouteName extends keyof Routes,
> = Parameters<Routes[RouteName]["component"]>[0] extends {
  queryParams: infer QueryParams;
}
  ? QueryParams
  : {};

export function createRouter<Routes extends Record<string, Route>>(
  routes: Routes,
) {
  function useInternalRouter<RouteName extends keyof Routes = keyof Routes>() {
    const [route, setRoute] = useState<RouteName | undefined>(
      detectCurrentRoute(routes) as RouteName | undefined,
    );

    if (isNil(route)) {
      return {
        route: undefined as unknown as RouteName,
        pathParams: {} as PathParams<Routes, RouteName>,
        queryParams: {} as QueryParams<Routes, RouteName>,
        push: (() => {}) as <NextRouteName extends keyof Routes>(
          routeName: NextRouteName,
          options?: Parameters<Routes[NextRouteName]["component"]>[0],
        ) => void,
        replace: (() => {}) as <NextRouteName extends keyof Routes>(
          routeName: NextRouteName,
          options?: Parameters<Routes[NextRouteName]["component"]>[0],
        ) => void,
        back: () => {},
        forward: () => {},
      };
    }

    const path = useMemo(() => routes[route].path, [route]);

    const pathParams = useMemo<PathParams<Routes, RouteName>>(
      () => extractPathParams(path) as PathParams<Routes, RouteName>,
      [path],
    );
    const queryParams = useMemo<QueryParams<Routes, RouteName>>(
      () => qs.parse(window.location.search) as QueryParams<Routes, RouteName>,
      [window.location.search],
    );

    const [error, setError] = useState<unknown>(null);

    const getUrl = (
      routeName: keyof Routes,
      options?: {
        pathParams?: PathParams<Routes, keyof Routes>;
        queryParams?: QueryParams<Routes, keyof Routes>;
      },
    ) => {
      const route = routes[routeName];
      const appliedPath = applyPathParams(
        route.path,
        options?.pathParams ?? {},
      );
      const queryString = qs.stringify(options?.queryParams ?? {});
      return `${appliedPath}${queryString === "" ? "" : `?${queryString}`}`;
    };

    const push = <NextRouteName extends keyof Routes>(
      routeName: NextRouteName,
      options?: {
        pathParams?: PathParams<Routes, NextRouteName>;
        queryParams?: QueryParams<Routes, NextRouteName>;
      },
    ) => {
      const url = getUrl(routeName, options);
      window.history.pushState({}, "", url);
      setRoute(routeName as unknown as RouteName);
    };

    const replace = <NextRouteName extends keyof Routes>(
      routeName: NextRouteName,
      options?: {
        pathParams?: PathParams<Routes, NextRouteName>;
        queryParams?: QueryParams<Routes, NextRouteName>;
      },
    ) => {
      const url = getUrl(routeName, options);
      window.history.replaceState({}, "", url);
      setRoute(routeName as unknown as RouteName);
    };

    const back = () => {
      window.history.back();
      setRoute(detectCurrentRoute(routes) as RouteName);
    };

    const forward = () => {
      window.history.forward();
      setRoute(detectCurrentRoute(routes) as RouteName);
    };

    useEffect(() => {
      window.addEventListener("popstate", () => {
        setRoute(detectCurrentRoute(routes) as RouteName);
      });

      window.addEventListener("unhandledrejection", (event) => {
        setError(event.reason);
      });

      window.addEventListener("error", (event) => {
        console.log("error", event.error);
        if (event.error === error) return;

        setError(event.error);
      });
    }, []);

    return {
      route,
      error,
      pathParams,
      queryParams,
      push,
      replace,
      back,
      forward,
    };
  }

  const useRouter: typeof useInternalRouter = () => {
    return (window as any).__router;
  };

  function Router({ fallback }: RouterProps) {
    const router = useInternalRouter();
    const { route, error, pathParams, queryParams } = router;

    if (isNotNil(error)) {
      return fallback.error(error);
    }

    if (isNil(route)) {
      return fallback.notFound();
    }

    const RouteComponent = routes[route].component;

    useEffect(() => {
      (window as any).__router = router;
    }, []);

    return (
      <>
        <div>
          <RouteComponent pathParams={pathParams} queryParams={queryParams} />
        </div>
      </>
    );
  }

  return {
    Router,
    useRouter,
  };
}

function applyPathParams(path: string, pathParams: Record<string, string>) {
  return path.replace(/:(\w+)/g, (match, p1) => pathParams[p1] ?? match);
}

function extractPathParams(path: string) {
  const splittedWindowPath = window.location.pathname.split("/");
  const result: Record<string, string> = {};

  for (const [idx, token] of path.split("/").entries()) {
    if (token.startsWith(":")) {
      result[token.slice(1)] = splittedWindowPath[idx];
    }
  }

  return result;
}

function detectCurrentRoute<Routes extends Record<string, Route>>(
  routes: Routes,
): keyof Routes | undefined {
  const splittedPath = window.location.pathname.split("/");

  return Object.entries(routes).find(([_, route]) =>
    route.path
      .split("/")
      .every(
        (token, idx) =>
          token === splittedPath[idx] ||
          (token.startsWith(":") && isNotNil(splittedPath[idx])),
      ),
  )?.[0];
}
