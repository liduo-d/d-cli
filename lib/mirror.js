const fs = require('fs-extra');
const path = require('path');
const chalk =require('chalk');
const symbols = require('log-symbols');

const configPath = path.resolve(__dirname, '../d.config.json');

async function setMirror(mirror) {
    if (await fs.pathExists(configPath)) {
        await _setMirror(mirror);
    } else {
        await require('./util/config')();
        await _setMirror(mirror);
    }
}

async function _setMirror(mirror) {
    try {
        const config = await fs.readJson(configPath);
        config.mirror = mirror;
        await fs.writeJson(configPath, config);
        console.log(symbols.success, ` Set the mirror ${chalk.cyan(mirror)} successful.`);
    } catch (err) {
        console.log(symbols.error, chalk.red(`Set the mirror ${chalk.cyan(mirror)} failed. ${err}`));
        process.exitCode = 1;
    }
}

module.exports = setMirror;
