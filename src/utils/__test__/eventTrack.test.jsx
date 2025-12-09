import { trackEvent } from "@/utils/eventTrack";

describe("trackEvent", () => {
  let originalGtag;
  let originalWarn;

  beforeEach(() => {
    originalGtag = window.gtag;
    originalWarn = console.warn;

    console.warn = jest.fn();
  });

  afterEach(() => {
    window.gtag = originalGtag;
    console.warn = originalWarn;
  });

  test("calls window.gtag with correct parameters when gtag exists", () => {
    window.gtag = jest.fn();

    const payload = {
      action: "button_click",
      category: "Dashboard_Transaction",
      label: "7_days",
    };

    trackEvent(payload);

    expect(window.gtag).toHaveBeenCalledWith("event", payload.action, {
      event_category: payload.category,
      event_label: payload.label,
    });
  });

  test("logs warning when window.gtag is not available", () => {
    window.gtag = undefined;

    trackEvent({
      action: "click",
      category: "Test",
      label: "Testing",
    });

    expect(console.warn).toHaveBeenCalledWith("gtag not available");
  });
});
