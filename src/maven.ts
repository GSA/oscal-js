import xml2js from 'xml2js';
const MAVEN_METADATA_URL = 'https://repo1.maven.org/maven2/dev/metaschema/oscal/oscal-cli-enhanced/maven-metadata.xml';



export async function getVersionsFromMaven() {
  try {
    const response = await fetch(MAVEN_METADATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xmlData = await response.text();
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);

    const versions = result.metadata.versioning[0].versions[0].version.sort();
    const latestVersion = result.metadata.versioning[0].release[0];

    return { versions, latestVersion };
  } catch (error) {
    console.error('Error fetching versions from Maven:', error);
    throw error;
  }
}

export async function downloadFromMaven(version) {
  const downloadUrl = `https://repo1.maven.org/maven2/dev/metaschema/oscal/oscal-cli-enhanced/${version}/oscal-cli-enhanced-${version}-oscal-cli.zip`;
  try {
    console.log(`Downloading version ${version} from ${downloadUrl}`);
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return  await response.arrayBuffer();
    console.log(`Successfully downloaded version ${version}`);
  } catch (error) {
    console.error(`Error downloading version ${version}:`, error);
    throw error;
  }
}