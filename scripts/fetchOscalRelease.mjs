import { downloadRelease } from '@terascope/fetch-github-release';

const user = 'usnistgov';
const repo = 'OSCAL';
const outputdir = 'content';
const leaveZipped = false;
const disableLogging = false;

// Define a function to filter releases.
function filterRelease(release) {
  // Filter out prereleases.
  return release.prerelease === false;
}

// Define a function to filter assets.
function filterAsset(asset) {
  // Select assets that contain the string 'windows'.
  return asset.name.includes('complete');
}

downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped, disableLogging)
  .then(function() {
    console.log('Latest oscal downloaded.');
  })
  .catch(function(err) {
    console.error(err.message);
  });