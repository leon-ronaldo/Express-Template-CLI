import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { createFile, createDirectory, createConfigFile, createControllerFile, createRouterFile, createModelFile } from './create.js'
import { ensurePackages } from './ensurePackages.js'

const createModuleAndLinkServerFile = (name, options) => {
    const baseDir = process.cwd();
    
    if (fs.existsSync(path.join(baseDir, 'controllers', `${name}Controller.js`)) || fs.existsSync(path.join(baseDir, 'models', `${name}Model.js`)) || fs.existsSync(path.join(baseDir, 'routes', `${name}Routes.js`))) {
        console.log(chalk.red("Module already exists aborting.."))
        return
    }

    const controllerPath = path.join(baseDir, 'controllers', `${name}Controller.js`);
    const routePath = path.join(baseDir, 'routes', `${name}Routes.js`);
    const modelPath = path.join(baseDir, 'models', `${name}Model.js`);
    const serverFilePath = path.join(baseDir, 'server.js');


    if (!fs.existsSync(path.join(baseDir, 'config'))) {
        createDirectory(path.join(baseDir, 'config'))
        createConfigFile()
    }
    if (!fs.existsSync(path.join(baseDir, 'controllers'))) createDirectory(path.join(baseDir, 'controllers'))
    if (!fs.existsSync(path.join(baseDir, 'routes'))) createDirectory(path.join(baseDir, 'routes'))
    if (!fs.existsSync(path.join(baseDir, 'models'))) createDirectory(path.join(baseDir, 'models'))

    // Create Controller File
    createControllerFile(controllerPath, name);

    // Create Router File
    createRouterFile(routePath, name);

    // Create Model File (if --model-none is not passed)
    if (!options.modelNone) {
        createModelFile(modelPath, name);
    }

    const routeImport = `const ${name}Routes = require('./routes/${name}Routes');`;
    const routeUse = `app.use('/${name}', require('./routes/${name}Routes'));`;

    // Link Route to server.js
    if (fs.existsSync(serverFilePath)) {


        let serverFileContent = fs.readFileSync(serverFilePath, 'utf8');

        if (!serverFileContent.includes(routeImport)) {
            // Add import and use statements to server.js
            serverFileContent = serverFileContent.replace(
                /(const express = require\('express'\);.*?app.use\(express.json\(\)\);)/s,
                `$1\n${routeUse}`
            );
            fs.writeFileSync(serverFilePath, serverFileContent, 'utf8');
            console.log(chalk.green(`Linked ${name}Routes to server.js`));
        } else {
            console.log(chalk.yellow(`${name}Routes is already linked to server.js`));
        }
    } else {
        console.log(chalk.red(`server.js not found. Creating server.js file`));
        createFile(serverFilePath, `
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
    `.trim());
    }

    ensurePackages(['mongoose', 'express', 'express-async-handler', 'nodemon']);
}

export default createModuleAndLinkServerFile