import { io } from "socket.io-client";

let evmSocket;
let nativeSocket;
let mainSocket;

let chain = (typeof window) !== 'undefined' && localStorage.getItem('chainType');


export const initEvmSocket = async (ws) => {
  disconnectNativeSocket()

  if (!evmSocket?.status || !evmSocket) {
    evmSocket = io.connect(ws, {
      transports: ['websocket'],
      reconnect: true,
    });
  }
};


export const initNativeSocket = async (ws) => {
  disconnectEvmSocket()
  if (!nativeSocket || !nativeSocket?.status) {
    nativeSocket = io.connect(ws, {
      transports: ['websocket'],
      reconnect: true,
    });
  }
};

export const initMainSocket = async (ws) => {
  if (!mainSocket) {
    mainSocket = io.connect(ws, {
      transports: ["websocket"],
      reconnect: true,
    });
  }
};

export const disconnectEvmSocket = () => {
  if (evmSocket) evmSocket.disconnect();
  return null;
};

export const disconnectNativeSocket = () => {
  if (nativeSocket) {
    nativeSocket.disconnect();
  }
  return null;
};

export const disconnectMainSocket = () => {
  if (mainSocket) {
    mainSocket.disconnect();
  }
  return null;
};

export const subscribeLatestContractsGraph = (cb) => {
  evmSocket.on("CONTRACT_DEPLOYED_GRAPH", (data) => {
    cb(data);
  })
};

export const subscribeCoinTransferGraph = (cb) => {
  evmSocket.on("COIN_TRANSFER_GRAPH", (data) => {
    cb(data);
  });
};

export const subscribeAccountsGraph = (cb) => {
  evmSocket.on("ACCOUNT_TX_GRAPH", (data) => {
    cb(data);
  })
};

export const subscribeTokensGraph = (cb) => {
  evmSocket.on("TOKEN_TX_GRAPH", (data) => {
    cb(data);
  });
};

export const subscribeTransactionGraph = (cb) => {
  evmSocket.on("ALL_TRANSACTIONS_GRAPH", (data) => {
    cb(data);
  })
};
export const subscribeNativeTransactionGraph = (cb) => {
  nativeSocket.on("NATIVE_ALL_TRANSACTIONS_GRAPH", (data) => {
    cb(data);
  })
};

export const subscribeLatestBlocks = (cb) => {
  evmSocket.on("LATEST_BLOCK", (data) => {
    cb(data);
  });

};

export const subscribeNativeBlocks = (cb) => {
  nativeSocket.on("NATIVE_LATEST_BLOCK", (data) => {
    cb(data);
  });
}

export const subscribeLatestTransaction = (cb) => {
  evmSocket?.on("LATEST_TRANSACTION", (data) => {
    cb(data);
  })
};

export const subscribeNativeLatestTransaction = (cb) => {
  nativeSocket?.on("NATIVE_LATEST_TRANSACTIONS", (data) => {
    cb(data);
  });
};

export const subscribeAnalytics = (cb) => {
  evmSocket?.on("ANALYTICS", (data) => {
    cb(data);
  })
};

export const subscribeNativeAnalytics = (cb) => {
  nativeSocket?.on("NATIVE_ANALYTICS", (data) => {
    cb(data);
  });
};

export const subscribeOnChainMetrics = (cb) => {
  evmSocket?.on("TX_SUMMARY", (data) => {
    cb(data);
  })
};

export const subscribeNativeChainMetrics = (cb) => {
  nativeSocket?.on("NATIVE_TX_SUMMARY", (data) => {
    cb(data);
  });
};



// --------------------Native Sockets------------------------------//