import xml2js from 'xml2js';
const MAVEN_METADATA_URL = 'https://repo1.maven.org/maven2/dev/metaschema/oscal/oscal-cli-enhanced/maven-metadata.xml';
const DEVELOP_MAVEN_METADATA_URL = "https://raw.githubusercontent.com/metaschema-framework/maven2/refs/heads/main/dev/metaschema/oscal/oscal-cli-enhanced/maven-metadata.xml"


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
    const {versions:snapshots}=await getDevelopVersionsFromMaven()
    return { versions:[...versions,...snapshots.filter((x:string)=>x.includes("SNAPSHOT"))], latestVersion };
  } catch (error) {
    console.error('Error fetching versions from Maven:', error);
    throw error;
  }
}

export async function getDevelopVersionsFromMaven() {
  try {
    const response = await fetch(DEVELOP_MAVEN_METADATA_URL);
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
  const baseUrl = 'https://github.com/metaschema-framework/maven2';
  const artifactPath = 'dev/metaschema/oscal/oscal-cli-enhanced';

  async function getMetadata() {
    const response = await fetch(`${baseUrl}/blob/main/${artifactPath}/maven-metadata.xml`);
    if (!response.ok) throw new Error(`Failed to fetch metadata: ${response.status}`);
    return response.text();
  }

  async function getSnapshotMetadata(version) {
    const response = await fetch(`${baseUrl}/raw/refs/heads/main/${artifactPath}/${version}/maven-metadata.xml`);
    if (!response.ok) throw new Error(`Failed to fetch snapshot metadata: ${response.status}`);
    return response.text();
  }

  try {
    let downloadUrl;
    if (version.includes('SNAPSHOT')) {
      const snapshotMetadata = await getSnapshotMetadata(version);
      const match = snapshotMetadata.match(/value>([^<]+)</);
      if (!match) throw new Error('Could not parse snapshot version');
      const snapshotVersion = match[1];
      downloadUrl = `${baseUrl}/raw/refs/heads/main/${artifactPath}/${version}/oscal-cli-enhanced-${snapshotVersion}-oscal-cli.zip`;
    } else {
      downloadUrl = `https://repo1.maven.org/maven2/${artifactPath}/${version}/oscal-cli-enhanced-${version}-oscal-cli.zip`;
    }

    console.log(`Downloading from ${downloadUrl}`);
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    
    const data = await response.arrayBuffer();
    console.log(`Successfully downloaded version ${version}`);
    return data;
  } catch (error) {
    console.error(`Error downloading version ${version}:`, error);
    throw error;
  }
}