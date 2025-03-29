import chalk from 'chalk';
import fs from 'fs';
import path from 'path';


const createFile = (filePath, content = '') => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(chalk.green(`Created file: ${filePath}`));
    } else {
        console.log(chalk.yellow(`File already exists: ${filePath}`));
    }
};

const createDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
        console.log(chalk.green(`Created directory ${dirPath}`))
    } else {
        console.log(chalk.yellow(`Skipped directory ${dirPath} as exists`))
    }
}

const createConfigFile = () => {
    const content = `const mongoose = require("mongoose");

const connectDb = async () => {
    try {
    const connect = await mongoose.connect("mongodb srv string here!!");
    console.log(
        "Database connected: ",
        connect.connection.host,
        connect.connection.name
    );
    } catch (err) {
    console.log(err);
    }
};

module.exports = connectDb;`

    const configFilePath = path.join(process.cwd(), 'config', 'dbConnection.js')

    if (!fs.existsSync(configFilePath)) {
        fs.writeFileSync(configFilePath, content, 'utf8');
        console.log(chalk.green(`Created config file: ${configFilePath}`));
    } else {
        console.log(chalk.yellow(`Skipped config file: ${configFilePath} already exists`));
    }
}

const createControllerFile = (filePath, module) => {
    const content = `const asyncHandler = require("express-async-handler")


const ${module}Origin = asyncHandler(async (req, res) => {
    console.log("created ${module} successfully")
    res.status(200).json({module: ${module}})
});

module.exports = { ${module}Origin }
    `

    if (!fs.existsSync(filePath, module)) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(chalk.green(`Created controller file: ${filePath}`));
    } else {
        console.log(chalk.yellow(`Skipped controller file: ${filePath} already exists`));
    }
}

const createRouterFile = (filePath, module) => {
    const content = `const express = require("express")
const router = express.Router()
const {
    ${module}Origin
} = require("../controllers/${module}Controller")

router.get('/', ${module}Origin)

module.exports = router
    `

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(chalk.green(`Created: ${filePath}`));
    } else {
        console.log(chalk.yellow(`Skipped: ${filePath} already exists`));
    }
}

const createModelFile = (filePath, module) => {
    const content = `const mongoose = require('mongoose');

// Define the schema here
const ${module}Schema = mongoose.Schema(
    {
        ${module}: String,
    }, 
    {
        timestamps: true,
    }
);

// Check if the model already exists to prevent redefining
const ${module} = mongoose.model('${module}', ${module}Schema);

module.exports = ${module};
    `

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(chalk.green(`Created model file: ${filePath}`));
    } else {
        console.log(chalk.yellow(`Skipped model file: ${filePath} already exists`));
    }
}

export { createFile, createDirectory, createConfigFile, createControllerFile, createModelFile, createRouterFile }