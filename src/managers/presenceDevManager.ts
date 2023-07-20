import { readdirSync, readFileSync, unwatchFile } from "fs";
import { socket } from "./socketManager";
import { extname } from "path";
import dialog from "node-file-dialog";

import chokidar from "chokidar";

let presenceDevWatchedFiles = [],
	currWatchPath = "",
	currWatcher: chokidar.FSWatcher = null;

export async function watchDir(path: string) {
	console.log("watchDir", path);
	currWatchPath = path + "/";
	let files = readdirSync(path);

	if (currWatcher) await currWatcher.close();

	currWatcher = chokidar.watch(currWatchPath, {
		ignoreInitial: true,
		ignored: ["*.ts"]
	});

	currWatcher.on("all", eventName => {
		files = readdirSync(currWatchPath);

		console.log(eventName, currWatchPath, files);

		readFiles(files, currWatchPath);
	});

	readFiles(files, path);
}

async function readFiles(files, path) {
	//* Send files to extension
	socket.emit("localPresence", {
		files: await Promise.all(
			files.map(f => {
				if (extname(f) === ".json")
					return {
						file: f,
						contents: JSON.parse(readFileSync(`${path}/${f}`).toString())
					};
				else if (extname(f) === ".js")
					return {
						file: f,
						contents: readFileSync(`${path}/${f}`).toString()
					};
				else return;
			})
		)
	});
}

export async function openFileDialog() {
	//* Open file dialog
	//* If user cancels
	//* Unwatch all still watched files
	//* Watch directory
	try {
		let oDialog = await dialog({ type: "directory" });
		watchDir(oDialog[0]);


	} catch (e) {
		if (presenceDevWatchedFiles.length > 0)
			await Promise.all(
				presenceDevWatchedFiles.map(f => unwatchFile(currWatchPath + f))
			);
	}



}
