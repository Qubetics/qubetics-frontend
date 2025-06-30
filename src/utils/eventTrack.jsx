export const trackEvent = ({ action, category, label }) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  } else {
    console.warn("gtag not available");
  }
};
