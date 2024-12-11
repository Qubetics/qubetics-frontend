import { NextResponse } from "next/server";
import { SHOW_FAUCET } from "./constant/constant";

export function middleware(request) {
  if (SHOW_FAUCET == 0) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/faucet",
};
