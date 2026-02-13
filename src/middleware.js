import { NextResponse } from "next/server";
import { SHOW_FAUCET, HIDE_CHAIN_ABSTRACTION } from "./constant/constant";

export function middleware(request) {
  const cookies = request.cookies.get("isEVM")?.value;
  const evmPath = ["/contract", "/token", "/verify-contract"];
  const pathname = request.nextUrl.pathname;
  const isEvmPath = evmPath.some((path) => pathname.startsWith(path));
  if (cookies === "false" && isEvmPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname === "/faucet" && SHOW_FAUCET == 0) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const blockedPaths = ["/solver-listing", "/chain-abstraction"];
  const isBlockedPath = blockedPaths.some((path) => pathname.startsWith(path));
  if (isBlockedPath && HIDE_CHAIN_ABSTRACTION == 1) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/contract",
    "/verify-contract",
    "/token",
    "/contract/:address*",
    "/faucet",
    "/solver-listing/:path*",
    "/chain-abstraction/:path*",
  ],
};
