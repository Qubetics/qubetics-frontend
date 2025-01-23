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
import Script from "next/script";
import Link from "next/link";
import { DM_Sans } from "next/font/google";

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
  // const generateNonce = () => crypto.randomBytes(16).toString("base64");
  // const nonce = generateNonce();
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-49RXC6H5G3"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', 'G-49RXC6H5G3');
            `,
          }}
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@100..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        {/* <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
          as="style"
        /> */}
      </Head>

      <body className={`${dmSans.className} darkTheme`}>
        {/* <script
          id="ze-snippet"
          src="https://static.zdassets.com/ekr/snippet.js?key=9e461708-e3c9-4a86-ad58-37330b0244e8"
        ></script> */}

        <Script
          id="zohodeskasap"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function () {
              var d = document;
              var s = d.createElement("script");
              s.type = "text/javascript";
              s.id = "zohodeskasapscript";
              s.defer = true;
              s.nonce = "your-actual-nonce-value"; // Replace if needed
              s.src = "https://desk.zoho.com/portal/api/web/asapApp/1081916000000316236?orgId=876694471";
              var t = d.getElementsByTagName("script")[0];
              t.parentNode.insertBefore(s, t);

              window.ZohoDeskAsapReady = function (callback) {
                var asyncCalls = (window.ZohoDeskAsap__asyncalls = window.ZohoDeskAsap__asyncalls || []);
                if (window.ZohoDeskAsapReadyStatus) {
                  if (callback) {
                    asyncCalls.push(callback);
                  }
                  asyncCalls.forEach(function (cb) {
                    if (cb) cb();
                  });
                  window.ZohoDeskAsap__asyncalls = null;
                } else if (callback) {
                  asyncCalls.push(callback);
                }
              };
            })();
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
