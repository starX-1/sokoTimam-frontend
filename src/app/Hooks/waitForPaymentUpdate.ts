// utils/waitForPaymentUpdate.ts
import { getSocket } from './socket'; // adjust path if needed

type PaymentUpdatePayload = {
  orderId: number;
  status: string;
  message?: string;
};

/**
 * Wait for a payment_update for the given orderId.
 * Resolves with payload or rejects on timeout / socket error.
 */
export const waitForPaymentUpdate = (orderId: number | string, timeoutMs = 2 * 60 * 1000) => {
  const socket = getSocket();

  return new Promise<PaymentUpdatePayload>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      socket.off('payment_update', handler);
      socket.off('connect', onConnect);
      clearTimeout(timeoutId);
    };

    const handler = (payload: PaymentUpdatePayload) => {
      if (payload?.orderId !== Number(orderId)) return;
      if (settled) return;
      settled = true;
      cleanup();
      resolve(payload);
    };

    const onConnect = () => {
      socket.emit('joinOrderRoom', { orderId });
    };

    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('Timed out waiting for payment confirmation'));
    }, timeoutMs);

    socket.on('payment_update', handler);
    socket.on('connect', onConnect);

    // if already connected, join immediately
    if (socket.connected) {
      socket.emit('joinOrderRoom', { orderId });
    }
  });
};
