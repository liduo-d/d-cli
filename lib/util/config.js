const fs = require('fs-extra');
const path = require('path');

const config = {
    "name": "d-cli",
    "mirror": "https://github.com/liduo-d/vue-template/archive/refs/heads/main.zip"
};

async function defConfig() {
    try {
        await fs.outputJson(path.resolve(__dirname,'../../d.config.json'), config);
    } catch (err) {
        console.error(err);
        process.exitCode = 1;
    }
}

module.exports = defConfig;
