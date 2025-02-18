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
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});
export async function generateMetadata({ params, searchParams }) {
  return {
    title: "Qubetics",
    description: "This is an explorer",
  };
}
// const crypto = require("crypto");

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@100..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KZDPDB2J');

          `,
        }}
      />

      <body className={`${dmSans.className} darkTheme`}>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NPJSP6ZG"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>            
          `,
          }}
        />

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
                  <GoogleAnalytics />
                  <ZohoDesk />
                  {/* <ZohoBusinesschat /> */}
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
