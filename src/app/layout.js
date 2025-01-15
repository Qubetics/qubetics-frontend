import { ContractVerificationProvider } from "@/components/contexts/contractContext";
import { LatestDataProvider } from "@/components/contexts/latest_data";
import { NetworkProvider } from "@/components/contexts/networkChanged";
import { SerachingValueProvider } from "@/components/contexts/searchingData";
import { ThemeProvider } from "@/components/contexts/theme_context";
import ErrorBoundary from "@/components/ErrorBoundry/ErrorBoundry";
import Head from "next/head";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.scss";
import "./(routes)/dashboard/dashboard.scss";
import StyledComponentsRegistry from "./lib/AntdRegistry";
import LayoutProvider from "./lib/layoutProvider";
import Loading from "./loading";
export async function generateMetadata({ params, searchParams }) {
  return {
    title: "Qubetics",
    description: "This is an explorer",
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <body className="darkTheme">
        <script
          id="ze-snippet"
          src="https://static.zdassets.com/ekr/snippet.js?key=9e461708-e3c9-4a86-ad58-37330b0244e8"
        ></script>
        <div className="bodyInner">
          <NetworkProvider>
            <ThemeProvider>
              <LatestDataProvider>
                <SerachingValueProvider>
                  <Toaster position="bottom-center" reverseOrder={false} />
                  <ContractVerificationProvider>
                    <StyledComponentsRegistry>
                      <Suspense fallback={<Loading />}>
                        <LayoutProvider>
                          <ErrorBoundary>{children}</ErrorBoundary>
                        </LayoutProvider>
                      </Suspense>
                    </StyledComponentsRegistry>
                  </ContractVerificationProvider>
                  <ToastContainer />
                </SerachingValueProvider>
              </LatestDataProvider>
            </ThemeProvider>
          </NetworkProvider>
        </div>
      </body>
    </html>
  );
}
