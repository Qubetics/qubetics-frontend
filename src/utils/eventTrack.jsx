import { ca } from "date-fns/locale";

export const trackEvent = ({ action, category, label, value }) => {
  console.log(action, category, label, value);
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.warn("gtag not available");
  }
};
