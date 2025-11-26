import { NextResponse } from "next/server";
import { EXPLORER_NETWORK_NAME, SHOW_FAUCET } from "./constant/constant";

export function middleware(request) {
  const cookies = request.cookies.get("isEVM")?.value;
  const evmPath = ["/contract", "/token", "/verify-contract"];
  const pathname = request.nextUrl.pathname;
  const isEvmPath = evmPath.some((path) => pathname.startsWith(path));

  if (cookies === "false" && isEvmPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    // pathname === "/faucet" &&
    SHOW_FAUCET == 0 &&
    EXPLORER_NETWORK_NAME === "Mainnet"
  ) {
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
  ],
};
