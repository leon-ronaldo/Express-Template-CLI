import path from 'path';
import { createFile, createDirectory, createConfigFile } from './create.js'
import { htmlContent, serverFileContent, serverFileContentTS } from './file.contents.js'
import { ensurePackages } from './ensurePackages.js'
import chalk from 'chalk';
import fs from 'fs'

const createTemplate = () => {
    const dirs = ['controllers', 'routes', 'models'];
    const serverFilePath = path.join(process.cwd(), 'server.js');

    //create config folder
    createDirectory(path.join(process.cwd(), 'config'))

    //create config file
    createConfigFile()

    // Create required directories
    dirs.forEach((dir) => createDirectory(path.join(process.cwd(), dir)));

    createFile(path.join(process.cwd(), 'index.html'), htmlContent);

    createFile(serverFilePath, serverFileContent.trim())

    ensurePackages(['mongoose', 'express', 'express-async-handler', 'nodemon']);

    console.log(chalk.greenBright("Project created successfully.."))
    console.log(chalk.greenBright('run "npm run dev" to run the server'))
}

const createTSTemplate = () => {
    const dirs = ['controllers', 'routes', 'models'];
    const serverFilePath = path.join(process.cwd(), 'server.ts');

    //create config folder
    createDirectory(path.join(process.cwd(), 'config'))

    //create config file
    createConfigFile({ forTS: true })

    // Create required directories
    dirs.forEach((dir) => createDirectory(path.join(process.cwd(), dir)));

    createFile(path.join(process.cwd(), 'index.html'), htmlContent);

    createFile(serverFilePath, serverFileContentTS.trim())

    ensurePackages(['mongoose', 'express', 'express-async-handler', 'nodemon'], { forTS: true });

    const packageJSON = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8');
    packageJSON.replace("index.js", "server.js")
    packageJSON.replace("index.ts", "server.js")
    fs.writeFileSync(path.join(process.cwd(), 'package.json'), packageJSON, "utf-8")

    console.log(chalk.greenBright("Project created successfully.."))
    console.log(chalk.greenBright('run "npm run dev" to run the server'))
}

export { createTemplate, createTSTemplate };