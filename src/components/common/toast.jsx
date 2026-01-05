import { toast } from "react-toastify";

let counter = 0;

class Toaster {
  showToast(message, type) {
    if (counter === 0) {
      counter = 1;
      toast[type](message, {
        style: {
          textTransform: "capitalize",
        },
      });
      timer = setTimeout(() => {
        counter = 0;
      }, 4000);
    }
  }

  success(message) {
    this.showToast(message, "success");
  }

  warning(message) {
    this.showToast(message, "warning");
  }

  error(message) {
    this.showToast(message, "error");
  }

  info(message) {
    this.showToast(message, "info");
  }
}

export const customToast = new Toaster();
