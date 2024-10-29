import xml2js from 'xml2js';
import chalk from "chalk";
import { exec, execSync, spawn } from "child_process";
import fs,{ readFileSync } from "fs";
import path from "path";
import yaml from "js-yaml"
import { promisify } from "util";
import AdmZip from 'adm-zip';
import { getVersionsFromMaven, downloadFromMaven } from './maven.js';
import { homedir } from 'os';
import { OscalExecutorOptions } from './utils.js';
const GITHUB_API_URL = 'https://api.github.com/repos/metaschema-framework/oscal-server/releases/latest';

const execPromise = promisify(exec);

// Cross-platform which promise function
export const whichPromise = async (command: string): Promise<string | null> => {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execPromise(`where ${command}`);
      return stdout.split('\r\n')[0].trim() || null;
    } else {
      const { stdout } = await execPromise(`which ${command}`);
      return stdout.trim() || null;
    }
  } catch (error) {
    return null;
  }
};



export const installOscalExecutorIfNeeded = async (executor:OscalExecutorOptions)=>{
  let isInstalled = await isOscalExecutorInstalled(executor)
    if (!isInstalled) {
      executor==='oscal-cli'?installOscalCli():installOscalServer();
      return true;
    }else{
      throw("Error installing oscal executor")
    }
}

// Function to check if the OSCAL CLI is installed
export const isOscalExecutorInstalled = async (executor:OscalExecutorOptions): Promise<boolean> => {
  const oscalExecutorPath = await whichPromise(executor);
  if (oscalExecutorPath) return true;  
  const oscalExecutorInstallPath = './'+executor+'/';
  return fs.existsSync(oscalExecutorInstallPath);
};

export const installOscalExecutor = async (executor:OscalExecutorOptions): Promise<void> => {
  if(executor==='oscal-cli'){
    installOscalCli('latest')
  }else{
    installOscalServer('latest');
  }
};

export const isJavaInstalled = async (): Promise<boolean> => {
  const javaPath = await whichPromise('java');
  return !!javaPath;
};

export const installOscalCli = async (version = "latest"): Promise<void> => {
    try {
      const { versions, latestVersion } = await getVersionsFromMaven();
      
      if (version === "latest") {
        version = latestVersion;
      } else if (!versions.includes(version)) {
        console.error("Unknown OSCAL version: " + version);
        console.error(chalk.blue(versions.join(', ')));
        return;
      }
  
      console.log("Installing version:", chalk.blue(version));
  
      const isWindows = process.platform === 'win32';
      const npmPrefix = execSync('npm config get prefix').toString().trim();
  
      const binPath = isWindows ? npmPrefix : path.resolve(npmPrefix, 'bin');
      const oscalCliPath = path.resolve(npmPrefix, 'lib', 'node_modules', 'oscal-cli');
      const oscalCliExecutablePath = path.resolve(oscalCliPath, 'bin', 'oscal-cli');
  
      // Create necessary directories
      fs.mkdirSync(oscalCliPath, { recursive: true });
  
      // Download the zip file
      console.log(`Downloading OSCAL CLI...`);
      const zipBuffer = await downloadFromMaven(version);
  
      // Unzip the file to oscal-cli directory
      console.log(`Extracting OSCAL CLI...`);
      const zip = new AdmZip(Buffer.from(zipBuffer));
      zip.extractAllTo(oscalCliPath, true);
  
      // Make the CLI executable (for non-Windows systems)
      if (!isWindows) {
        console.log("Setting executable permissions for CLI at " + oscalCliExecutablePath);
        fs.chmodSync(oscalCliExecutablePath, '755');
      }
  
      // Create a shortcut (Windows) or symbolic link (other systems)
      console.log(`Creating OSCAL CLI symlink: oscal-cli => ${oscalCliExecutablePath}`);
      const sourceFile = isWindows ? `${oscalCliExecutablePath}.bat` : oscalCliExecutablePath;
      const aliasPath = path.resolve(binPath, 'oscal-cli' + (isWindows ? '.bat' : ''));
  
      if (fs.existsSync(aliasPath)) {
        fs.unlinkSync(aliasPath); // Remove existing alias if it exists
      }
  
      if (isWindows) {
        const batchContent = `@echo off\n"${sourceFile}" %*`;
        fs.writeFileSync(aliasPath, batchContent, { flag: "w" });
      } else {
        fs.symlinkSync(sourceFile, aliasPath, 'file');
      }
  
      console.log(`OSCAL CLI installed to ${oscalCliPath}`);
      console.log(`Alias created at ${aliasPath}`);
  
    } catch (error: any) {
      throw new Error(`Failed to install OSCAL CLI: ${error.message}`);
    }
  };



export async function getLatestVersionFromGithub() {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const latestVersion = data.tag_name;
    
    return { latestVersion, releaseData: data };
  } catch (error) {
    console.error('Error fetching latest version from GitHub:', error);
    throw error;
  }
}

export async function downloadFromGithub(releaseData) {
  // Assuming the asset we want is a zip file
  const assetToDownload = releaseData.assets.find(asset => asset.name.endsWith('.zip')&&asset.name.includes("oscal-server"));

  if (!assetToDownload) {
    throw new Error('No suitable zip asset found in the release');
  }

  const downloadUrl = assetToDownload.browser_download_url;

  try {
    console.log(`Downloading latest release from ${downloadUrl}`);
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    console.log(`Successfully downloaded latest release`);
    return arrayBuffer;
  } catch (error) {
    console.error(`Error downloading latest release:`, error);
    throw error;
  }
}


// Function to install OSCAL server

export async function installOscalServer(tag: string = 'latest') {
  try {
    const { latestVersion, releaseData } = await getLatestVersionFromGithub();
    console.log(`Latest version: ${latestVersion}`);
    
    const zipBuffer = await downloadFromGithub(releaseData);
    console.log(`Downloaded ${zipBuffer.byteLength} bytes`);
    console.log(`Extracting OSCAL SERVER...`);

    const homeDir = homedir();
    const oscalDir = path.resolve(homeDir, '.oscal');
    const installDir = path.resolve(oscalDir, latestVersion);
    
    // Create .oscal directory if it doesn't exist
    if (!fs.existsSync(oscalDir)) {
      fs.mkdirSync(oscalDir, { recursive: true });
    }
        
    // Extract zip file
    const zip = new AdmZip(Buffer.from(zipBuffer));
    zip.extractAllTo(installDir, true);
    
    const isWindows = process.platform === 'win32';
    // Find the executable in the extracted files
    const executableName = isWindows ? 'oscal-server.bat' : 'oscal-server';
    const executablePath = await findExecutable(installDir, executableName);
    
    if (!executablePath) {
      throw new Error('Could not find OSCAL server executable in the extracted files');
    }
    
    // Make the executable file executable (for non-Windows systems)
    if (!isWindows) {
      execSync(`chmod +x "${executablePath}"`);
    }

    let aliasDir;
    if (isWindows) {
      aliasDir = path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WindowsApps');
    } else {
      aliasDir = path.join(homeDir, '.local', 'bin');
    }
    if (!fs.existsSync(aliasDir)) {
      fs.mkdirSync(aliasDir, { recursive: true });
    }
    const aliasPath = path.resolve(aliasDir, executableName);

    try {
      fs.unlinkSync(aliasPath);
    } catch(e) {
      // Ignore error if file doesn't exist
    }

    if (isWindows) {
      // Create a wrapper batch script that directly calls the original executable
      const wrapperContent = `@echo off
"${executablePath.replace(/\\/g, '\\\\')}" %*
`;
      fs.writeFileSync(aliasPath, wrapperContent);
    } else {
      fs.symlinkSync(executablePath, aliasPath);
      fs.chmodSync(aliasPath, '755'); // Make executable
    }

    console.log(`OSCAL server ${latestVersion} installed successfully`);
    console.log(`Executable: ${executablePath}`);
    console.log(`Alias created: ${aliasPath}`);
    
    return latestVersion;
  } catch (error) {
    console.error('Error installing latest release:', error);
    throw error;
  }
}
async function findExecutable(dir: string, name: string): Promise<string | null> {
  const files = await fs.promises.readdir(dir);
  for (const file of files) {
    const filePath = path.resolve(dir, file);
    const stats = await fs.promises.stat(filePath);
    if (stats.isDirectory()) {
      const result = await findExecutable(filePath, name);
      if (result) return result;
    } else if (file === name || file === name + '.exe') {
      return filePath;
    }
  }
  return null;
}
  
export const findOscalCliPath = async (): Promise<string> => {
    const command = process.platform === 'win32' ? 'where oscal-cli' : 'which -a oscal-cli';
  
    try {
      const { stdout } = await execPromise(command);
      const paths = [...new Set(stdout.trim().split('\n'))]
      if (paths.length > 0) {
        // Filter paths that include 'node'
        const nodePaths = paths.filter(path => path.toLowerCase().includes('node'));
        
        if (nodePaths.length > 0) {
          // If node paths are found, use the first one
          if (nodePaths.length > 1) {
            console.warn(chalk.yellow(`Detected ${nodePaths.length} node-based installs of oscal-cli in PATH, using ${nodePaths[0]}`));
          }
          return nodePaths[0];
        } else {
          // If no node paths are found, fall back to the original behavior
          if (paths.length > 1) {
            console.warn(chalk.yellow(`Detected ${paths.length} installs of oscal-cli in PATH, defaulting to ${paths[0]} (no node-based install found)`));
          }
          return paths[0];
        }
      }  } catch (error) {
      // Command failed or oscal-cli not found
    }
  
    throw new Error("OSCAL CLI not found");
  };
  export const findOscalServerPath = async (): Promise<string> => {
    const command = process.platform === 'win32' ? 'where oscal-server' : 'which -a oscal-server';
  
    try {
      const { stdout } = await execPromise(command);
      const paths = [...new Set(stdout.trim().split('\n'))]
      if (paths.length > 0) {
        // Filter paths that include 'node'
        const nodePaths = paths.filter(path => path.toLowerCase().includes('node'));
        
        if (nodePaths.length > 0) {
          // If node paths are found, use the first one
          if (nodePaths.length > 1) {
            console.warn(chalk.yellow(`Detected ${nodePaths.length} node-based installs of oscal-server in PATH, using ${nodePaths[0]}`));
          }
          return nodePaths[0];
        } else {
          // If no node paths are found, fall back to the original behavior
          if (paths.length > 1) {
            console.warn(chalk.yellow(`Detected ${paths.length} installs of oscal-server in PATH, defaulting to ${paths[0]} (no node-based install found)`));
          }
          return paths[0];
        }
      }  } catch (error) {
      // Command failed or oscal-cli not found
    }
    // try default install location if its not in the path
    if (process.platform !== 'win32') {
      const localBinPath = path.join(homedir(), '.local', 'bin', 'oscal-server');
      if (fs.existsSync(localBinPath)) {
          const stats = await fs.promises.stat(localBinPath);
          if (stats.isFile()) {
              return localBinPath;
          }
      }
    }  
    throw new Error("OSCAL SERVER not found");
  };

  export type stdIn = string;
export type stdErr = string;

export const executeOscalCliCommand = async (command: string, args: string[], showLoader: boolean = false,quiet:boolean=false): Promise<[stdIn, stdErr]> => {
  return new Promise((resolve, reject) => {
    findOscalCliPath().then(oscalCliPath => {
      const isWindows = process.platform === 'win32';
      const fullArgs = [...command.split(" "), ...args];

      console.log(chalk.green("oscal-cli ") + chalk.blue(command)+' '+(args.join(" ")));

      let spawnArgs: [string, string[], object];
      if (isWindows) {
        // On Windows, we need to spawn cmd.exe and pass the command as an argument
        spawnArgs = [
          'cmd.exe',
          ['/c', oscalCliPath, ...fullArgs],
          { windowsVerbatimArguments: true }
        ];
      } else {
        spawnArgs = [oscalCliPath, fullArgs,{shell:true}];
      }
      const oscalCliProcess = spawn(...spawnArgs);

      let stdout = '';
      let stderr = '';

      // Indeterminate loading glyph
      const loadingGlyph = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      let loadingIndex = 0;

      let loading: NodeJS.Timeout | null = null;
      if (showLoader) {
        loading = setInterval(() => {
          process.stdout.write(`\r\x1b[36m${loadingGlyph[loadingIndex]}\x1b[0m`);
          loadingIndex = (loadingIndex + 1) % loadingGlyph.length;
        }, 100);
      }

      oscalCliProcess.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      oscalCliProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      oscalCliProcess.on('error', (error) => {
        if (loading) clearInterval(loading);
        reject(new Error(`Failed to start OSCAL CLI process: ${error.message}`));
      });

      oscalCliProcess.on('close', (code) => {
        if (loading) {
          clearInterval(loading);
          process.stdout.write('\r\x1b[K'); // Clear the loading glyph line
        }

        if (code === 0) {
          resolve([stdout, stderr]);
        } else {
          reject(new Error(`OSCAL CLI process exited with code ${code}:\n${stderr}`));
        }
      });
    }).catch(error => reject(error));
  });
};
