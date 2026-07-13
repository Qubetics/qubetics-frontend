// Destination: qubetics-frontend/src/services/getChainAbstractionContracts.jsx
import { CHAIN_ABSTRACTION_API_URL } from "@/constant/constant";

/**
 * Fetches the curated list of Qubetics Chain Abstraction (QCA) contracts
 * (CAP Solver Registration, CAP Intent Transactions, CAP Solver Pool, ...).
 *
 * This is intentionally NOT a hardcoded frontend list — the curated set of
 * addresses/names lives on the chain-abstraction backend so a new QCA
 * contract can be added without a frontend deploy. See README "Backend work
 * needed" for the expected response shape.
 *
 *   GET {CHAIN_ABSTRACTION_API_URL}contracts
 *   -> {
 *        data: {
 *          contracts: [
 *            {
 *              name: "CAP Solver Registration",
 *              address: "0x...",
 *              verificationType: 2,      // same enum as contracts/contract-detail-by-address
 *              tag: "Chain Abstraction",
 *              balance: "1000000000000000000",
 *              txCount: 128,
 *              lastActivityAt: "2026-07-01T10:00:00.000Z",
 *            },
 *            ...
 *          ]
 *        }
 *      }
 */
export default async function getChainAbstractionContracts() {
  const response = await fetch(`${CHAIN_ABSTRACTION_API_URL}contracts`);
  const result = await response.json();
  return result;
}
