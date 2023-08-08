import * as core from '@actions/core';
import * as github from '@actions/github';
import semanticRelease from 'semantic-release';

async function run() {
  try {
    // Configuration for semantic-release
    const config = {
      branches: ['main'],
      plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/github'
      ],
      ci: true,
    };

    // Execute semantic-release
    const result = await semanticRelease(config);

    if (result) {
      const { lastRelease, commits, nextRelease, releases } = result;

      // Example: log the new version
      console.log(`Released version: ${nextRelease.version}`);

      // Set outputs for further steps in your workflow, if necessary
      core.setOutput('version', nextRelease.version);
    } else {
      console.log('No release published.');
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

run();
