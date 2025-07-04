import { NextResponse } from "next/server";
import { SHOW_FAUCET } from "./constant/constant";

export function middleware(request) {
  const cookies = request.cookies.get("isEVM")?.value;
  const evmPath = ["/contract", "/token", "/verify-contract"];
  const pathname = request.nextUrl.pathname;
  const isEvmPath = evmPath.some((path) => pathname.startsWith(path));

  if (cookies === "false" && isEvmPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (SHOW_FAUCET == 0) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/contract",
    "/token",
    "/verify-contract",
    "/contract/:address*",
    "/faucet",
  ],
};
