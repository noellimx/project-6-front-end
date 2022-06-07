import { io as socketio } from "socket.io-client";
import { Socket } from "socket.io-client";
const io: Socket = socketio("", { withCredentials: true });

export default io;
