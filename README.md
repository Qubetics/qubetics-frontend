# Tics Scan - Qubetics Blockchain Explorer

Tics Scan is a high-performance, modern blockchain explorer built using **Next.js**. It allows users to explore qubetics blockchain data such as transactions, blocks, accounts, validators, and more in real-time.

## 🌐 Live Demo

[🔗 View Live Explorer](https://ticsscan.com) <!-- Replace with your actual domain -->

---

## 🚀 Features

- ✅ Real-time block and transaction updates 
- ✅ Address and transaction lookups
- ✅ Block, validator, and token information 
- ✅ Pagination and search support
- ✅ Mobile-responsive and fast-loading UI
- ✅ WebSocket and API integration for live data 
- ✅ Theme-friendly design using Tailwind CSS

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI**: [React.js](https://reactjs.org/)
- **Charting**: [Highcharts](https://www.highcharts.com/) – for rich, interactive blockchain data visualization
- **Blockchain SDKs**: Web3.js
- **Data Handling**: REST APIs, WebSockets

---

## 🧠 Architecture Overview

- **Frontend**: Built with Next.js
- **API Layer**: custom API routes
- **Real-time Data**: Uses WebSockets to reflect latest transactions/blocks
- **Wallet Support**: Cosmos-kit for Cosmos chains
- **Responsive Layout**: Built for both desktop and mobile with optimal load performance

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/qubetics-explorer.git
cd qubetics-explorer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Environment Variables

Create a `.env.local` file in the root and add your configuration:

```env
# Explorer API & Socket
NEXT_PUBLIC_EXPLORER_API_URL=         # URL for explorer API (EVM chain)
NEXT_PUBLIC_SOCKET_URL=               # WebSocket URL for EVM updates

# Metamask & Chain Info
NEXT_PUBLIC_METAMASK_NETWORK_URL=     # JSON-RPC URL for MetaMask
NEXT_PUBLIC_QUBETICS_CURRENCY_NAME=   # Currency symbol
NEXT_PUBLIC_QUBETICS_CHAIN_NAME=      # Name of the chain
NEXT_PUBLIC_QUBETICS_CHAINID=         # Chain ID
NEXT_PUBLIC_METAMASK_EXPLORER_NAVIGATE= # Block explorer base URL

# UI Labels & Timings
NEXT_PUBLIC_NETWORK_NAME=             # Public display name of the network
NEXT_PUBLIC_EXPLORER_BLOCK_TIME=      # Average block time in seconds

# Optional Feature Flags
NEXT_PUBLIC_SHOW_FAUCET=              # true/false for showing faucet option

# Native Chain Support (Non-EVM)
NEXT_PUBLIC_NATIVE_SOCKET_URL=        # WebSocket URL for native chain (e.g., Substrate)
NEXT_PUBLIC_NATIVE_EXPLORER_API_URL=  # API base for native chain explorer

# Miscellaneous
NEXT_PUBLIC_CONTRACT_VERIFY_URL=      # URL for contract verification API (if any)
NEXT_PUBLIC_GOOGLE_CAPTCHA_KEY=       # reCAPTCHA site key for forms
NEXT_PUBLIC_METAMASK_DAPP_URL=        # MetaMask DApp connection origin

```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
├── components/
│   ├── Card/
│   ├── Table/
│   └── ...
├── hooks/
├── pages/
│   ├── index.tsx
│   ├── block/
│   ├── tx/
├── public/
├── styles/
├── utils/
├── .env.local
└── README.md
```

---

## 🛡️ Security

- Uses HTTPS APIs for data fetching
- Validates and sanitizes all input parameters

---

## 📄 License

This project is licensed under the MIT License.
