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

const createConfigFile = (options = { forTS: false }) => {
    const { forTS } = options
    const content = !forTS ? `const mongoose = require("mongoose");

const connectDb = async () => {
    try {
    const connection = await mongoose.connect("mongodb srv string here!!");
    console.log(
        "Database connected: ",
        connect.connection.host,
        connect.connection.name
    );
    } catch (err) {
    console.error(err);
    }
};

module.exports = connectDb;` : `import mongoose from 'mongoose'

const connectDb = async () => {
    try {
    const connection = await mongoose.connect("mongodb srv string here!!");
    console.log(
        "Database connected: ",
        connect.connection.host,
        connect.connection.name
    );
    } catch (err) {
    console.error(err);
    }
};

export default connectDb`

    const configFilePath = path.join(process.cwd(), 'config', !forTS ? 'dbConnection.js' : 'dbConnection.ts')

    if (!fs.existsSync(configFilePath)) {
        fs.writeFileSync(configFilePath, content, 'utf8');
        console.log(chalk.green(`Created config file: ${configFilePath}`));
    } else {
        console.log(chalk.yellow(`Skipped config file: ${configFilePath} already exists`));
    }
}

const createControllerFile = (filePath, module, options = { forTS: false }) => {
    const { forTS } = options

    const content = forTS
        ? `import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const ${module}Origin = asyncHandler(async (req: Request, res: Response) => {
    console.log("created ${module} successfully");
    res.status(200).json({ route: "${module}" });
});

export { ${module}Origin };
`
        : `const asyncHandler = require("express-async-handler");

const ${module}Origin = asyncHandler(async (req, res) => {
    console.log("created ${module} successfully");
    res.status(200).json({ route: "${module}" });
});

module.exports = { ${module}Origin };
`;



    if (!fs.existsSync(filePath, module)) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(chalk.green(`Created controller file: ${filePath}`));
    } else {
        console.log(chalk.yellow(`Skipped controller file: ${filePath} already exists`));
    }
}

const createRouterFile = (filePath, module, options = { forTS: false }) => {
    const { forTS } = options

    const content = forTS ?
        `import express from "express"
import {
    ${module}Origin
} from "../controllers/${module}Controller"

const router = express.Router()

router.get('/', ${module}Origin)

export default router;
    `
        :
        `const express = require("express")
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

const createModelFile = (filePath, module, options = { forTS: false }) => {
    const { forTS } = options

    const content = forTS ? `import mongoose, { Schema, Document } from "mongoose";

    // Define the schema interface
    interface I${module} extends Document {
        ${module}: string;
    }
    
    // Define the schema
    const ${module}Schema = new Schema<I${module}>(
        {
            ${module}: { type: String, required: true },
        },
        {
            timestamps: true,
        }
    );
    
    // Check if the model already exists to prevent redefining
    const ${module} = mongoose.models.${module} || mongoose.model<I${module}>("${module}", ${module}Schema);
    
    export default ${module};
        `
        :
        `const mongoose = require('mongoose');

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