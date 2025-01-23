window.ZOHOIM =
  window.ZOHOIM ||
  function (a, b) {
    ZOHOIM[a] = b;
  };
window.ZOHOIM.prefilledMessage = "";
(function () {
  var d = document;
  var s = d.createElement("script");
  s.type = "text/javascript";
  s.nonce = "{place_your_nonce_value_here}";
  s.defer = true;
  s.src =
    "https://im.zoho.com/api/v1/public/channel/161069b264dd5f31b0e9f054a52ceb6d/widget";
  d.getElementsByTagName("head")[0].appendChild(s);
})();
