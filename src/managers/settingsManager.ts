import ElectronStore from "electron-store";
import { platform } from "os";
import { info } from "../util/debug";

//* Import custom types
import ExtensionSettings from "../../@types/PreMiD/ExtensionSettings";

//* Export and set default settings
export let settings = new ElectronStore({
	defaults: {
		autoLaunch: true
	}
});
