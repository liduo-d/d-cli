const fs = require('fs-extra');
const path = require('path');
const symbols = require('log-symbols');
const chalk = require('chalk');
const ora = require('ora');

async function createApp(name, options) {
    try {
        const processPath = process.cwd();

        if (await fs.pathExists(name) && !options.force) {
            console.log(symbols.error, chalk.red('The app already exists'));
            process.exit();
        } else {
            if (options.force) {
                await fs.remove(name);
            }

            const createSpinner = ora(chalk.cyan('Initializing app...'));
            createSpinner.start();

            const templatePath = path.resolve(__dirname, '../template/');


            if (!await fs.pathExists(templatePath)) {
                if (options.offline) {
                    console.log();
                    createSpinner.fail(chalk.red(`Create app offline failed, no cached template found`));
                    process.exit();
                } else {
                    await require('./util/download')();
                }
            }

            try {
                await fs.copy(templatePath, `${processPath}/${name.toLowerCase()}`);
            } catch (err) {
                console.log(symbols.error, chalk.red(`Copy template failed. ${err}`));
                createSpinner.fail();
                process.exit();
            }

            createSpinner.text = `Initialize ${name.toLowerCase()} successful`;
            createSpinner.succeed();

            console.log(`\n To get started:

	        cd ${chalk.yellow(name.toLowerCase())}
	        ${chalk.yellow('npm install')}
	        ${chalk.yellow('npm run start')}`)
        }
    } catch (err) {
        console.log(symbols.error, `${err}`);
        process.exitCode = 1;
    }
}

module.exports = createApp;
