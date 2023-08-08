// installExtras.ts
import path from 'path';
import * as core from '@actions/core';
import { exec } from 'child_process';

/**
 * Execute a shell command and return a promise.
 * @param {string} cmd - The command to run.
 * @param {object} options - Options passed to exec.
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
function execute(cmd: string, options: object = {}): Promise<{ stdout: string, stderr: string }> {
    return new Promise((resolve, reject) => {
        exec(cmd, options, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

/**
 * Pre-install extra dependencies.
 * @param {string} extras - List of extra npm packages to install.
 * @returns {Promise<void>}
 */
async function installExtras(extras: string): Promise<void> {
    if (!extras) return;

    const sanitizedExtras = extras.replace(/['"]/g, '').replace(/[\n\r]/g, ' ');
    const silentFlag = process.env.RUNNER_DEBUG === '1' ? '' : '--silent';

    try {
        const { stdout, stderr } = await execute(`npm install ${sanitizedExtras} --no-audit ${silentFlag}`, {
            cwd: path.resolve(__dirname, '..')
        });

        if (stdout) core.debug(stdout);
        if (stderr) core.error(stderr);
    } catch (error) {
        if (error instanceof Error) {
            core.error(error.message);
        }
    }
}

export default installExtras;
