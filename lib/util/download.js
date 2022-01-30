const download = require('download');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

const configPath = path.resolve(__dirname, '../../d.config.json');
const templatePath = path.resolve(__dirname, '../template');

async function downloadTemplate() {
    if (await fs.pathExists(configPath)) {
        await _downloadTemplate();
    } else {
        await require('./config')();
        await _downloadTemplate();
    }
}

async function _downloadTemplate() {
    try {
        await fs.remove(templatePath);
    } catch (err) {
        console.error(err);
        process.exit();
    }

    const config = await fs.readJson(configPath);
    const dlSpinner = ora(chalk.cyan(' Downloading template...'));

    dlSpinner.start();
    try {
        const _templatePath = await download(config.mirror, path.resolve(__dirname, '../../'), {extract: true});
        await fs.move(path.resolve(__dirname, `../../${_templatePath[0].path}`), path.resolve(__dirname, '../../template'));
    } catch (err) {
        dlSpinner.text = chalk.red(` Download template failed. ${err}`);
        dlSpinner.fail();
        process.exit();
    }
    dlSpinner.text = ' Download template successful.';
    dlSpinner.succeed();
}

module.exports = downloadTemplate;
