#!/usr/bin/env node

import { program } from 'commander';
import createModuleAndLinkServerFile from './createModule.js';
import createTemplate from './createTemplate.js';
import createUserSystem from './createUserSystem.js';
import chalk from 'chalk';


program
    .command('express-basic-template')
    .description('Generate a basic Express.js project structure')
    .action(() => {
        try {
            createTemplate()
        } catch (error) {
            console.log(chalk.red(`Error occured while performing tasks.. ${error}`))
        }
    });



//add module

program
    .command('express-module <name...>')
    .description('Generate a module (controller, route, and optional model)')
    .option('--model-none', 'Skip creating the model file')
    .action((name, options) => {
        try {
            name.forEach(module => {
                createModuleAndLinkServerFile(module, options);
            });
        } catch (error) {
            console.log(chalk.red(`Error occured while performing tasks.. ${error}`))
        }
    });


//simple user management

program
    .command('express-simple-user')
    .description('Generate simple user authentication system')
    .option('--jwt-token-none', 'Skip adding jwt token authentication')
    .action((args, options) => {
        try {
            createUserSystem(options)
        } catch (error) {
            console.log(chalk.red(`Error occured while performing tasks.. ${error}`))
        }
    })


// Parse the CLI arguments
program.parse(process.argv);

