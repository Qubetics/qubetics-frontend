import { ContractVerificationProvider } from "@/components/contexts/contractContext";
import { LatestDataProvider } from "@/components/contexts/latest_data";
import { NetworkProvider } from "@/components/contexts/networkChanged";
import { SerachingValueProvider } from "@/components/contexts/searchingData";
import { ThemeProvider } from "@/components/contexts/theme_context";
import ErrorBoundary from "@/components/ErrorBoundry/ErrorBoundry";
import ZohoDesk from "@/components/ZohoDesk/ZohoDesk";
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

import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});
export async function generateMetadata() {
  return {
    title: "Qubetics",
    description: "This is an explorer",
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} darkTheme`}>
        <div className="bodyInner">
          <NetworkProvider>
            <ThemeProvider>
              <LatestDataProvider>
                <SerachingValueProvider>
                  <Toaster
                    containerClassName="break-word-toast"
                    position="bottom-center"
                    reverseOrder={false}
                  />
                  <ZohoDesk />
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
