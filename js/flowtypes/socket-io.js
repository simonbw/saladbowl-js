type SocketIO = {
  use: (handler:(socket:Socket, next:Function) => void) => void
}

type Socket = any;