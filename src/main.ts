import * as core from '@actions/core';
import { execSync } from 'child_process';
import semanticRelease, { Result } from 'semantic-release';

async function dryRunRelease(): Promise<Result> {
  execSync(`git checkout ${process.env.GITHUB_HEAD_REF}`)
  return semanticRelease({
    plugins: [
      '@semantic-release/git'
    ],
    dryRun: true,
    ci: false
  });
}

async function run() {
  const result = await dryRunRelease();
  if (result) {
    core.setOutput('version', result.nextRelease.version);
  }
}

run();




