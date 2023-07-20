import "source-map-support/register";


import { init as initSocket } from "./managers/socketManager";
import { checkForUpdate } from "./util/updateChecker";


(async () => {

	await Promise.all([checkForUpdate(), initSocket()]);

})();