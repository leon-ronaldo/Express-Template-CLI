import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { createFile, createDirectory } from './create.js'
import { authMiddlewareContent, userControllerContent, userControllerJWTContent, userModelContent, userRoutesContent, userRoutesContentJWT } from './file.contents.js'
import { ensurePackages } from './ensurePackages.js'
import createModuleAndLinkServerFile from './createModule.js';

const createUserSystem = (options) => {
    createModuleAndLinkServerFile("User", {})
    const userControllerPath = path.join(process.cwd(), "controllers", "UserController.js")
    const userRoutePath = path.join(process.cwd(), "routes", "UserRoutes.js")
    const userModelPath = path.join(process.cwd(), "models", "UserModel.js")

    if (fs.existsSync(userControllerPath) && fs.existsSync(userRoutePath) && fs.existsSync(userModelPath)) {
        fs.writeFileSync(userControllerPath, !options.jwtTokenNone ? userControllerJWTContent : userControllerContent)
        console.log(chalk.green(!options.jwtTokenNone ? "Created User Login, Register, CurrentUser functions in ./controllers/UserController.js" : "Created User Login, Register functions in ./controllers/UserController.js"));

        fs.writeFileSync(userModelPath, userModelContent)
        console.log(chalk.green("Created User model with fields Email, Username, Password and Phone at ./models/UserModel.js"));

        fs.writeFileSync(userRoutePath, !options.jwtTokenNone ? userRoutesContentJWT : userRoutesContent)
        console.log(chalk.green(!options.jwtTokenNone ? "Created User routes with routes '/login', '/register', '/current' at ./routes/UserRoutes.js" : "Created User routes with routes '/login', '/register', at ./routes/UserRoutes.js"));

        if (!options.jwtTokenNone) {
            const middlewareDirectory = path.join(process.cwd(), "middleware");
            const authMiddlewarePath = path.join(process.cwd(), "middleware", "authMiddleware.js");

            createDirectory(middlewareDirectory);
            createFile(authMiddlewarePath, authMiddlewareContent);

            ensurePackages(['jsonwebtoken', 'bcryptjs'])
        } else {
            ensurePackages(['bcryptjs'])
        }

        console.log(chalk.green("Successfully created simple user management!"));
        console.log(chalk.yellow("It is recommended to modify the code based on your project implementation.. Feel free to do so :)"));
    } else {
        console.log(chalk.red("User module files are either missing or the project is unstructured.. Aborting process.."));
        console.log(chalk.yellow("try again with ensuring the project has build correctly or run 'create-express-template express-basic template to create a new template' "))
    }
}

export default createUserSystem