const updateNotifier = require('update-notifier');
const chalk = require('chalk');

const notifier = updateNotifier({
    pkg: require('../package.json'),
    updateCheckInterval: 60 * 1000,
});

function updateCheck() {
    if (notifier.update) {
        console.log(` Current version is: ${chalk.cyan(notifier.update.current)}\n New version available: ${chalk.cyan(notifier.update.latest)}, it's recommended that you update before using.`);
        const command = `npm i ${require('../package.json').name} -g`;
        notifier.notify({
            message: ` Run ${chalk.cyan(command)} to update`
        });
    } else {
        console.log('No new version is available.');
    }
}

module.exports = updateCheck;
