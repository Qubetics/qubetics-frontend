import { ContractVerificationProvider } from "@/components/contexts/contractContext";
import { LatestDataProvider } from "@/components/contexts/latest_data";
import { NetworkProvider } from "@/components/contexts/networkChanged";
import { SerachingValueProvider } from "@/components/contexts/searchingData";
import { ThemeProvider } from "@/components/contexts/theme_context";
import Head from "next/head";
import Script from "next/script";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.scss";
import "./(routes)/dashboard/dashboard.scss";
import StyledComponentsRegistry from "./lib/AntdRegistry";
import LayoutProvider from "./lib/layoutProvider";
import Loading from "./loading";
import ErrorBoundary from "@/components/ErrorBoundry/ErrorBoundry";

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
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','G-1FNGC3ZMD6');
`}
      </Script>
      <body className="darkTheme">
        <Script
          strategy="lazyOnload"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-1FNGC3ZMD6"
        ></Script>
        <Script strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-1FNGC3ZMD6');`}
        </Script>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=G-1FNGC3ZMD6"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        <div className="bodyInner">
        <ErrorBoundary>
          <NetworkProvider>
            <ThemeProvider>
              <LatestDataProvider>
                <SerachingValueProvider>
                  <ContractVerificationProvider>
                    <StyledComponentsRegistry>
                      <Suspense fallback={<Loading />}>
                        <LayoutProvider>{children}</LayoutProvider>
                      </Suspense>
                    </StyledComponentsRegistry>
                  </ContractVerificationProvider>
                  <ToastContainer />
                </SerachingValueProvider>
              </LatestDataProvider>
            </ThemeProvider>
          </NetworkProvider>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
