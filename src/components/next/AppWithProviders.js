import { useMemo } from "react";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider, useSelector } from "react-redux";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StyledEngineProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { SnackbarProvider } from "notistack";

import BrowserRouter from "@fuse/core/BrowserRouter";
import CustomLoading from "@fuse/core/CustomLoading";
import FuseLayout from "@fuse/core/FuseLayout";
import FuseTheme from "@fuse/core/FuseTheme";
import themeLayouts from "app/theme-layouts/themeLayouts";
import { selectCurrentLanguageDirection } from "app/store/i18nSlice";
import { selectMainTheme } from "app/store/fuse/settingsSlice";
import store from "app/store";
import AppContext from "app/AppContext";
import routes from "app/configs/routesConfig";

import "../../i18n";

import HistoryNextSync from "./HistoryNextSync";

function shouldUseFuseChrome(pathname) {
  if (!pathname) return false;
  if (pathname.startsWith("/dashboards")) return true;
  if (pathname === "/sign-in") return true;
  if (pathname === "/signUp") return true;
  if (pathname.startsWith("/fastsignup")) return true;
  if (pathname === "/example" || pathname === "/loading" || pathname === "/404")
    return true;
  return false;
}

function NextFuseChrome({ Component, pageProps }) {
  const router = useRouter();
  const pathname = router.pathname || "";

  if (!shouldUseFuseChrome(pathname)) {
    return <Component {...pageProps} />;
  }

  return (
    <CustomLoading>
      <HistoryNextSync />
      <FuseLayout layouts={themeLayouts}>
        <Component {...pageProps} />
      </FuseLayout>
    </CustomLoading>
  );
}

function EmotionAndTheme({ children }) {
  const langDirection = useSelector(selectCurrentLanguageDirection);
  const mainTheme = useSelector(selectMainTheme);
  const insertionPoint =
    typeof document !== "undefined"
      ? document.getElementById("emotion-insertion-point")
      : undefined;

  const emotionCache = useMemo(() => {
    const opts =
      langDirection === "rtl"
        ? {
            key: "muirtl",
            stylisPlugins: [rtlPlugin],
            insertionPoint,
          }
        : {
            key: "muiltr",
            stylisPlugins: [],
            insertionPoint,
          };
    return createCache(opts);
  }, [langDirection, insertionPoint]);

  return (
    <CacheProvider value={emotionCache}>
      <FuseTheme theme={mainTheme} direction={langDirection}>
        {children}
      </FuseTheme>
    </CacheProvider>
  );
}

export default function AppWithProviders({ Component, pageProps }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ routes }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Provider store={store}>
            <StyledEngineProvider injectFirst>
              <EmotionAndTheme>
                <BrowserRouter>
                  <SnackbarProvider
                    maxSnack={1}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    classes={{
                      containerRoot:
                        "bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99",
                    }}
                  >
                    <NextFuseChrome
                      Component={Component}
                      pageProps={pageProps}
                    />
                  </SnackbarProvider>
                </BrowserRouter>
              </EmotionAndTheme>
            </StyledEngineProvider>
          </Provider>
        </LocalizationProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
