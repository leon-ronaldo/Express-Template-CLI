import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { createFile, createDirectory, createConfigFile, createControllerFile, createRouterFile, createModelFile } from './create.js'
import { ensurePackages } from './ensurePackages.js'
import { exit } from 'process';

const createModuleAndLinkServerFile = (name, options) => {
    const baseDir = process.cwd();
    const isTSProject = fs.existsSync(path.join(process.cwd(), 'tsconfig.json'))

    if (
        fs.existsSync(path.join(baseDir, 'controllers', isTSProject ? `${name}Controller.ts` : `${name}Controller.js`))
        ||
        fs.existsSync(path.join(baseDir, 'models', isTSProject ? `${name}Model.ts` : `${name}Model.js`))
        ||
        fs.existsSync(path.join(baseDir, 'routes', isTSProject ? `${name}Routes.ts` : `${name}Routes.js`))
    ) {
        console.log(chalk.red("Module already exists aborting.."))
        exit(-1)
    }

    const controllerPath = path.join(baseDir, 'controllers', isTSProject ? `${name}Controller.ts` : `${name}Controller.js`);
    const routePath = path.join(baseDir, 'routes', isTSProject ? `${name}Routes.ts` : `${name}Routes.js`);
    const modelPath = path.join(baseDir, 'models', isTSProject ? `${name}Model.ts` : `${name}Model.js`);
    const serverFilePath = path.join(baseDir, isTSProject ? 'server.ts' : 'server.js');


    if (!fs.existsSync(path.join(baseDir, 'config'))) {
        createDirectory(path.join(baseDir, 'config'))
        createConfigFile({ forTS: isTSProject })
    }
    if (!fs.existsSync(path.join(baseDir, 'controllers'))) createDirectory(path.join(baseDir, 'controllers'))
    if (!fs.existsSync(path.join(baseDir, 'routes'))) createDirectory(path.join(baseDir, 'routes'))
    if (!fs.existsSync(path.join(baseDir, 'models'))) createDirectory(path.join(baseDir, 'models'))

    // Create Controller File
    createControllerFile(controllerPath, name, { forTS: isTSProject });

    // Create Router File
    createRouterFile(routePath, name, { forTS: isTSProject });

    // Create Model File (if --model-none is not passed)
    if (!options.modelNone) {
        createModelFile(modelPath, name, { forTS: isTSProject });
    }

    const routeImport = isTSProject
        ? `import ${name}Routes from './routes/${name}Routes';`
        : `const ${name}Routes = require('./routes/${name}Routes');`;

    const routeUse = isTSProject
        ? `app.use('/${name}', ${name}Routes);\n\n`
        : `app.use('/${name}', require('./routes/${name}Routes'));`;


    // Link Route to server.js
    if (fs.existsSync(serverFilePath)) {
        let serverFileContent = fs.readFileSync(serverFilePath, 'utf8');

        if (!serverFileContent.includes(routeImport)) {
            // Add import and use statements to server file
            const importRegex = isTSProject
                ? /(import express(?:, \{.*?\})? from 'express';.*?app.use\(express.json\(\)\);)/s
                : /(const express = require\('express'\);.*?app.use\(express.json\(\)\);)/s;

            serverFileContent = serverFileContent.replace(
                importRegex,
                `$1\n${routeImport}\n${routeUse}`
            );

            fs.writeFileSync(serverFilePath, serverFileContent, 'utf8');
            console.log(chalk.green(`Linked ${name}Routes to server.${isTSProject ? "ts" : "js"}`));
        } else {
            console.log(chalk.yellow(`${name}Routes is already linked to server.${isTSProject ? "ts" : "js"}`));
        }
    } else {
        console.log(chalk.red(`server.js not found. Creating server.${isTSProject ? "ts" : "js"} file`));
        createFile(serverFilePath, isTSProject ? `
// Basic Express server
import express from 'express';
import connectDb from './config/dbConnection';

const app = express();

// DB config
// connectDb(); // Uncomment this after adding connection to DB

// Middleware
app.use(express.json());

// Routes (Add your routes here)
// Example: import apiRoutes from './routes/apiRoutes';
// app.use('/api', apiRoutes);
${routeImport}
${routeUse}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:${PORT}\`);
});
    `.trim() : `
// Basic Express.js server
const express = require('express');
const app = express();
const connectDb = require("./config/dbConnection");

//db config
// connectDb(); uncomment this after adding connection to DB

// Middleware
app.use(express.json());

// Routes (Add your routes here)
// Example: app.use('/api', require('./routes/apiRoutes'));
${routeUse}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:\${PORT}\`);
});
        `.trim())
    }

    ensurePackages(['mongoose', 'express', 'express-async-handler', 'nodemon'], { forTS: isTSProject });
}

export default createModuleAndLinkServerFile