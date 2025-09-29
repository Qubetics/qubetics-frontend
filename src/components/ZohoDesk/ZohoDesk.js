import Script from "next/script";
import React from "react";

export default function ZohoDesk() {
  return (
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
  );
}
