import * as core from '@actions/core';
import { execSync } from 'child_process';
import semanticRelease, { Result } from 'semantic-release';
import installExtras from './installExtras';

async function dryRunRelease(): Promise<Result | null> {
    try {
        execSync(`git checkout ${process.env.GITHUB_HEAD_REF}`) 
        
        const extraPlugins = core.getInput('extra_plugins', { required: false });
        
        await installExtras(extraPlugins);

        const branch = process.env.GITHUB_HEAD_REF || (process.env.GITHUB_REF ?? '').replace('refs/heads/', '');

        return semanticRelease({
            ci: false,
            dryRun: true,
            branches: [
                branch
            ],
          }, {
            env: { ...process.env, GITHUB_ACTIONS: '' },
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
