// Real-time stock socket handler
export const initStockSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a product room to receive stock updates for that product
    socket.on('join:product', (productId) => {
      socket.join(`product:${productId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
};

// Helper to emit stock change from anywhere (e.g. order service)
export const emitStockUpdate = (io, productId, stock) => {
  io.to(`product:${productId}`).emit('stock:update', { productId, stock });
};
