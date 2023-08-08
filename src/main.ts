// main.ts
import * as core from '@actions/core';
import { execSync } from 'child_process';
import semanticRelease, { Result } from 'semantic-release';
import installExtras from './installExtras';

async function dryRunRelease(): Promise<Result | null> {
    try {
        const gitRef = process.env.GITHUB_HEAD_REF;
        if (!gitRef) {
            throw new Error('GITHUB_HEAD_REF environment variable is not set');
        }

        execSync(`git checkout ${gitRef}`);
        
        const extraPlugins = core.getInput('extra_plugins', { required: false });
        
        // Install the extras
        await installExtras(extraPlugins);

        return await semanticRelease({
            dryRun: true,
            ci: false
        });
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        return null;
    }
}

async function run() {
    try {
        const result = await dryRunRelease();
        if (result && result.nextRelease) {
            core.setOutput('version', result.nextRelease.version);
        } else {
            core.warning('No release version generated');
        }
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();
