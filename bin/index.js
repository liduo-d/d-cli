#!/usr/bin/env node
const program = require('commander');
const semver = require('semver');
const chalk = require('chalk');
const leven = require('leven');
const minimist = require('minimist');

// Check node version first
(function () {
    const requires = require('../package.json').engines.node;
    if (!semver.satisfies(process.version, requires)) {
        console.log(chalk.red(
            'You are using Node ' + process.version + ', but this version of d-cli' +
            ' requires Node ' + requires + '.\nPlease upgrade your Node version.'
        ));
        process.exit(1);
    }
})();


// version
program.version(require('../package.json').version, '-v, --version');

// create
program
    .command('create <app-name>')
    .description('create a new project powered by d-cli')
    .option('-f, --force', 'overwrite target directory if it exists')
    .option('--offline', 'use cached template for create')
    .action((name, options) => {
        if (minimist(process.argv.slice(3))._.length > 1) {
            console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
        }
        require('../lib/create')(name, options)
    });

// template
program
    .command('template')
    .description('download template from mirror')
    .action(() => {
        require('../lib/template')()
    });


// mirror
program
    .command('mirror <template-mirror>')
    .description('set the template mirror')
    .action((mirror) => {
        if (minimist(process.argv.slice(3))._.length > 1) {
            console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the template mirror, the rest are ignored.'))
        }
        require('../lib/mirror')(mirror)
    });

// upgrade
program
    .command('upgrade')
    .description('check the d-cli version for latest')
    .action(() => {
        require('../lib/upgrade')()
    });

// tips
// 1.unknown commands
program.on('command:*', ([cmd]) => {
    program.outputHelp();
    console.log();
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
    console.log();
    commandTips(cmd);
    process.exitCode = 1;
});

// 2.help
program.on('--help', () => {
    console.log();
    console.log(`  Run ${chalk.cyan(`d <command> --help`)} for detailed usage of given command.`);
});

program.parse(process.argv);

function commandTips(unknownCmd) {
    const availableCommands = program.commands.map(cmd => cmd._name);
    let tips = '';
    availableCommands.forEach(cmd => {
        if (leven(unknownCmd, cmd) < 3 && leven(unknownCmd, cmd) < leven(unknownCmd, tips)) {
            tips = cmd;
        }
    });

    if (tips) {
        console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(tips)}?`));
    }
}
