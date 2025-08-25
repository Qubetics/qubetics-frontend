let blocksWebSocket = null;
let hb = null; // Heartbeat interval
let onBlocksIndexing = null;
let onBlocksNewBlock = null;
let onBlocksIndexingInternal = null;
let onTransactionReceived = null;

// Message handler function
function handleMessageArr(event) {
  try {
    const frame = JSON.parse(event.data);
    if (!Array.isArray(frame) || frame.length < 5) return;

    const [joinRef, ref, topic, ev, payload] = frame;
    // Handle join confirmation
    if (ev === "phx_reply" && topic === "blocks" && payload?.status === "ok") {
      return;
    }

    // Handle blocks events
    if (ev === "indexing" && onBlocksIndexing) {
      onBlocksIndexing(payload);
      return;
    }
    if (ev === "new_block") {
      onBlocksNewBlock(payload);
      return;
    }

    if (ev === "indexing_internal_transactions" && onBlocksIndexingInternal) {
      onBlocksIndexingInternal(payload);
      return;
    }
    if (topic === "transactions:new_transaction" && onTransactionReceived) {
      onTransactionReceived(payload);
      return;
    }
  } catch (error) {
    console.error("Error parsing WebSocket message:", error);
  }
}

export const initBlocksWebSocket = async (ws) => {
  // Close existing connection if any
  if (blocksWebSocket) {
    blocksWebSocket.close();
  }

  // Clear existing heartbeat
  if (hb) {
    clearInterval(hb);
    hb = null;
  }
  blocksWebSocket = new WebSocket(ws);

  blocksWebSocket.addEventListener("open", () => {
    // Join blocks topics
    sendBlocksMessage([3, 3, "blocks:new_block", "phx_join", {}]);
    // Join transaction
    sendBlocksMessage([8, 8, "transactions:new_transaction", "phx_join", {}]);

    // Setup heartbeat every 30 seconds
    hb = setInterval(() => {
      sendBlocksMessage([null, String(Date.now()), "phoenix", "heartbeat", {}]);
    }, 30000);
  });

  blocksWebSocket.addEventListener("message", (event) => {
    handleMessageArr(event);
  });

  blocksWebSocket.addEventListener("error", (e) => {
    console.error("❌ Blocks WebSocket ERROR:", e);
    console.error("📋 WebSocket readyState:", blocksWebSocket?.readyState);
  });

  blocksWebSocket.addEventListener("close", (e) => {
    console.log("🔴 Blocks WebSocket CLOSED");
    console.log("📋 Close code:", e.code);
    console.log("📄 Close reason:", e.reason);
    console.log("🔄 Was clean close:", e.wasClean);

    // Clear heartbeat on close
    if (hb) {
      clearInterval(hb);
      hb = null;
    }
  });

  function sendBlocksMessage(arr) {
    if (blocksWebSocket?.readyState === WebSocket.OPEN) {
      blocksWebSocket.send(JSON.stringify(arr));
    } else {
      console.warn(
        "⚠️ Cannot send message - WebSocket not open. ReadyState:",
        blocksWebSocket?.readyState
      );
    }
  }
};

// Cleanup function
export const disconnectBlocksWebSocket = () => {
  if (hb) {
    clearInterval(hb);
    hb = null;
  }

  if (blocksWebSocket) {
    blocksWebSocket.close();
    blocksWebSocket = null;
  }

  // Reset subscription handlers
  onBlocksIndexing = null;
  onBlocksNewBlock = null;
  onBlocksIndexingInternal = null;
  onTransactionReceived = null; // Updated name
};

// Subscription functions
export function subscribeBlocksIndexing(cb) {
  onBlocksIndexing = (payload) => {
    cb?.(payload);
  };
}

export function subscribeBlocksNewBlock(cb) {
  onBlocksNewBlock = (payload) => {
    cb?.(payload);
  };
}

export function subscribeBlocksIndexingInternalTransactions(cb) {
  onBlocksIndexingInternal = (payload) => {
    cb?.(payload);
  };
}
export function subscribeTransactionReceived(cb) {
  onTransactionReceived = (payload) => {
    cb?.(payload);
  };
}
// Utility function to check connection status
export const getBlocksWebSocketStatus = () => {
  const states = {
    0: "CONNECTING",
    1: "OPEN",
    2: "CLOSING",
    3: "CLOSED",
  };

  return {
    readyState: blocksWebSocket?.readyState,
    status: states[blocksWebSocket?.readyState] || "UNKNOWN",
    isConnected: blocksWebSocket?.readyState === WebSocket.OPEN,
  };
};
