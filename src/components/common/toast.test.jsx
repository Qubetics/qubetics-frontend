import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.useFakeTimers();

describe("Toaster Class Tests", () => {
  let customToast;
  let toast;

  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-toastify", () => ({
      toast: {
        success: jest.fn(),
        warning: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
      },
    }));
    jest.clearAllMocks();
    jest.clearAllTimers();
    const toastModule = require("react-toastify");
    toast = toastModule.toast;
    const { customToast: ct } = require("./toast");
    customToast = ct;
  });

  test("should call toast.success on success()", () => {
    customToast.success("Success message");

    expect(toast.success).toHaveBeenCalledWith("Success message", {
      style: { textTransform: "capitalize" },
    });

    // Should NOT call again immediately
    customToast.success("Another message");
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  test("should call toast.error on error()", () => {
    customToast.error("Error message");

    expect(toast.error).toHaveBeenCalledWith("Error message", {
      style: { textTransform: "capitalize" },
    });

    customToast.error("Another message");
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  test("should call toast.warning on warning()", () => {
    customToast.warning("Warning message");

    expect(toast.warning).toHaveBeenCalledWith("Warning message", {
      style: { textTransform: "capitalize" },
    });

    customToast.warning("Another");
    expect(toast.warning).toHaveBeenCalledTimes(1);
  });

  test("should call toast.info on info()", () => {
    customToast.info("Info message");

    expect(toast.info).toHaveBeenCalledWith("Info message", {
      style: { textTransform: "capitalize" },
    });

    customToast.info("Another");
    expect(toast.info).toHaveBeenCalledTimes(1);
  });

  test("should reset counter after 4 seconds and allow a new toast", () => {
    customToast.success("Initial");

    // simulate time passing
    jest.advanceTimersByTime(4000);

    customToast.success("Next toast");

    expect(toast.success).toHaveBeenCalledTimes(2);
  });

  test("should NOT allow multiple toasts before timer expires", () => {
    customToast.error("Error 1");

    customToast.error("Error 2");
    customToast.error("Error 3");

    expect(toast.error).toHaveBeenCalledTimes(1);

    // Allow timer to finish
    jest.advanceTimersByTime(4000);

    customToast.error("Error 4");

    expect(toast.error).toHaveBeenCalledTimes(2);
  });

  test("should call correct toast type based on showToast()", () => {
    customToast.showToast("Msg", "info");
    expect(toast.info).toHaveBeenCalledWith("Msg", {
      style: { textTransform: "capitalize" },
    });
  });
});
