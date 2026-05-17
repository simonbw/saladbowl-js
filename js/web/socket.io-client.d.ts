/**
 * socket.io-client 1.x ships no type declarations; treat it as `any`.
 */
declare module 'socket.io-client' {
  const io: any;
  export default io;
}
