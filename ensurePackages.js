import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';


/**
 * Function to check and install required packages
 * @param {Array<string>} packages - List of package names to check and install
 */
function ensurePackages(packages) {
    if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
        execSync(`npm init`, { stdio: 'inherit' });
        console.log(chalk.green(`Created new project`));
    }

    if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
        execSync(`npm install`, { stdio: 'inherit' });
        console.log(chalk.green(`Installed packages`));
    }

    console.log(chalk.yellow('Checking for required packages...'));
    packages.forEach((pkg) => {
        try {
            // Check if the package is installed locally or globally
            execSync(`npm list ${pkg}`, { stdio: 'ignore' });
            console.log(chalk.greenBright(`${pkg} is already installed.`));
        } catch (err) {
            console.log(chalk.red(`${pkg} is not installed. Installing...`));
            try {
                execSync(`npm install ${pkg}`, { stdio: 'inherit' });
                console.log(chalk.green(`${pkg} installed successfully.`));

                if (pkg === "nodemon") {
                    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
                    packageJson.scripts = {
                        ...packageJson.scripts,
                        dev: 'nodemon server.js',
                    };
                    fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(packageJson, null, 2));
                }
            } catch (installErr) {
                console.error(`Failed to install ${pkg}:`, installErr.message);
            }
        }
    });
}

export { ensurePackages }