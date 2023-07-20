import { createServer, Server } from "http";
import socketIo from "socket.io";

import { error, success } from "../util/debug";
import { clearActivity, getDiscordUser, rpcClients, setActivity } from "./discordManager";

export let io: socketIo.Server;
export let socket: socketIo.Socket;
export let server: Server;
export let connected: boolean = false;

export function init() {
	return new Promise<void>(resolve => {
		//* Create server
		//* create SocketIo server, don't server client
		//* Try to listen to port 3020
		//* If that fails/some other error happens run socketError
		//* If someone connects to socket socketConnection
		server = createServer();
		io = new socketIo.Server(server, {
			serveClient: false,
			allowEIO3: true,
			allowRequest: (req, callback) => {
				const noOriginHeader = req.headers.origin === undefined;
				callback(null, noOriginHeader);
			}
		});
		server.listen(3020, () => {
			//* Resolve promise
			//* Debug info
			resolve();
			success("Opened socket");
		});
		server.on("error", socketError);
		io.on("connection", socketConnection);
	});
}

function socketConnection(cSocket: socketIo.Socket) {
	//* Show debug
	//* Set exported socket letiable to current socket
	//* Handle setActivity event
	//* Handle clearActivity event
	//* Handle settingsUpdate
	//* Handle presenceDev
	//* Handle version request
	//* Once socket user disconnects run cleanup
	success("Socket connection");
	socket = cSocket;
	getDiscordUser()
		.then(user => socket.emit("discordUser", user))
		.catch(_ => socket.emit("discordUser", null));
	socket.on("setActivity", setActivity);
	socket.on("clearActivity", clearActivity);
	//socket.on("selectLocalPresence", openFileDialog);
	socket.on("getVersion", () =>
		socket.emit("receiveVersion", "220")
	);
	socket.once("disconnect", () => {
		connected = false;
		//* Show debug
		//* Destroy all open RPC connections
		error("Socket disconnection.");
		rpcClients.forEach(c => c.destroy());
	});
	connected = true;
}

//* Runs on socket errors
function socketError(e: any) {
	//* Show debug
	//* If port in use
	error(e.message);
	if (e.code === "EADDRINUSE") {
		//* Focus app
		//* Show error dialog
		//* Exit app afterwards
		process.exit(1);
	}
}
