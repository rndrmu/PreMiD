var chalk = require("chalk");

/**
 * Show info message in console
 * */
export function info(message: string) {
	//* Return if app packaged
	//* Show debug
	console.log(`${chalk.bgBlue(chalk.white("  INFO   "))} ${message}`);
}

/**
 * Show success message in console
 * */
export function success(message: string) {
	//* Return if app packaged
	//* Show debug
	console.log(`${chalk.bgGreen(" SUCCESS ")} ${message}`);
}

/**
 * Show error message in console
 * */
export function error(message: string) {
	//* Return if app packaged
	//* Show debug
	console.log(`${chalk.bgRed("  ERROR  ")} ${message}`);
}
