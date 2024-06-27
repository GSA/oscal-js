import { downloadRelease } from '@terascope/fetch-github-release';
import { existsSync } from 'fs';

const user = 'usnistgov';
const repo = 'OSCAL';
const outputdir = 'content';
const leaveZipped = false;
const disableLogging = false;

// Define interfaces for the GitHub API responses
interface Release {
  prerelease: boolean;
  // Add other properties as needed
}

interface Asset {
  name: string;
  // Add other properties as needed
}

// Define a function to filter releases.
function filterRelease(release: Release): boolean {
  // Filter out prereleases.
  return release.prerelease === false;
}

// Define a function to filter assets.
function filterAsset(asset: Asset): boolean {
  // Select assets that contain the string 'complete'.
  return asset.name.includes('complete');
}

if (!existsSync(outputdir)) {
  downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped, disableLogging)
    .then(() => {
      console.log('Latest oscal downloaded.');
    })
    .catch((err: Error) => {
      console.error(err.message);
    });
}