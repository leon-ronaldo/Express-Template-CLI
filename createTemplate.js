import path from 'path';
import { createFile, createDirectory, createConfigFile } from './create.js'
import { htmlContent, serverFileContent } from './file.contents.js'
import { ensurePackages } from './ensurePackages.js'
import chalk from 'chalk';

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

export default createTemplate;