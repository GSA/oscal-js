import chalk from "chalk";
import { ChildProcess, spawn } from "child_process";
import { existsSync, mkdirSync } from 'fs';
import fetch from 'node-fetch';
import createClient, { Client, Middleware } from "openapi-fetch";
import os from 'os';
import path, { join } from 'path';
import psList from 'ps-list';
import { findOscalServerPath, installOscalExecutor } from "./env.js";
import { paths } from "./open-api/oscal-server.js";
import { URL } from "url";

export async function stopServer() {
  try {
    const processes = await psList();
    const oscalProcesses = processes.filter(process => 
      process.name.toLowerCase().includes('oscal-server') || 
      (process.cmd && process.cmd.toLowerCase().includes('oscal-server'))
    );

    if (oscalProcesses.length === 0) {
      return ['No oscal-server processes found', ''];
    }

    for (const proc of oscalProcesses) {
      try {
        process.kill(proc.pid);
      } catch (error:any) {
        console.error(`Failed to kill process ${proc.pid}: ${error.message}`);
      }
    }

    return [`Stopped ${oscalProcesses.length} oscal-server process(es)`, ''];
  } catch (error:any) {
    throw new Error(`Failed to stop server: ${error.message}`);
  }
}



const loggingMiddleware: Middleware = {
  onRequest: async ({request}) => {
    const url = new URL(request.url);

    console.log(
      chalk.blue('oscal-server') + ' ' +decodeURIComponent(url.href)
    );

    return request;
  },onResponse: async ({ response, request }) => {
    const url = new URL(request.url);
    const documentParam = url.searchParams.get('document') || 'No document specified';
    const filename = path.basename(documentParam);
    let exitStatus=(response.headers.get("Exit-Status")||"NA").toString()
    const statusColor= exitStatus==="OK"?chalk.green:chalk.red
    console.log(
      chalk.blue('oscal-server') + ' ' + filename  +' '+chalk.blue(decodeURIComponent(url.pathname.replace("/","")))+' '+ statusColor(exitStatus)
    );
  }
};

export const getServerClient: (baseUrl?: string, port?: number) => Promise<Client<paths, `${string}/${string}`>> = async (
  baseUrl = "http://localhost",
  port: number = 8888
) => {
  const fullBaseUrl = `${baseUrl}:${port}/`;
  const client= createClient<paths>({
    baseUrl: fullBaseUrl,
  });
  client.use(loggingMiddleware);
  return client;
}


let serverProcess: ChildProcess | null = null;
const OSCAL_DIR = join(os.homedir(), '.oscal');

// Ensure .oscal directory exists
if (!existsSync(OSCAL_DIR)) {
  mkdirSync(OSCAL_DIR, { recursive: true });
}




export const executeOscalServerCommand = async (
  command: string,
  args: string[] = [],
  options: object = {}
): Promise<ChildProcess> => {
  return new Promise((resolve, reject) => {
    if(typeof command ==='undefined'){
      console.log("commands: [start,restart,stop,update,status]")
      return;
    }
      findOscalServerPath().then(async oscalServerPath => {
      const isWindows = process.platform === 'win32';
      const fullArgs = [...command.split(" "), ...args];

      if (await isServerRunning()) {
        const pid = await getServerPid();
        if (command === 'start') {
          reject(new Error('OSCAL SERVER is already running. Use the stop command to stop it or the restart command to restart it.'));
          return;
        } else if (command === 'restart') {
          try {
            process.kill(pid);
          } catch (error) {
            console.warn(`Failed to kill existing process (PID: ${pid}): ${error}`);
          }
        }
      }

      let spawnArgs: [string, string[], object];
      if (isWindows) {
        spawnArgs = [
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', 
           `& {&'${oscalServerPath}' ${fullArgs.map(arg => `'${arg}'`).join(' ')}}`],
          { windowsVerbatimArguments: true, ...options }
        ];
      } else {
        spawnArgs = [oscalServerPath, fullArgs, { shell: true, ...options }];
      }

      const oscalServerProcess = spawn(...spawnArgs);

      oscalServerProcess.stdout?.on('data', (data) => {
        console.info(data.toString());
      });

      oscalServerProcess.stderr?.on('data', (data) => {
        console.error(data.toString());
      });

      oscalServerProcess.on('error', (error) => {
        console.error(error.message.toString());
      });

      oscalServerProcess.on('exit', (exit) => console.log("Service process Exited (" + exit + ")"));
      
      serverProcess = oscalServerProcess;
      resolve(oscalServerProcess);
    }).catch(error => reject(error));
  });
};

export async function startServer(background: boolean = false) {
  const status = await checkServerStatus();
  if (status) {
    console.log("Server is already healthy");
    return;
  }

  console.log(`Starting server in ${background ? 'background' : 'foreground'} mode...`);
  
  let oscalServerProcess;
  
  if (background) {
    const oscalServerPath = await findOscalServerPath();
    const command = `"${oscalServerPath}" start &`;
    
    oscalServerProcess = spawn(command, [], {
      shell: true,
      detached: true,
      stdio: 'ignore'
    });
    oscalServerProcess.unref();
  } else {
    oscalServerProcess = await executeOscalServerCommand("start", []);
  }

  console.log("Waiting for server to become healthy...");
  const isHealthy = await waitForServerHealth();
  
  if (isHealthy) {
    console.log("Server is now healthy and ready to use.");
    if (background) {
      console.log("Server is running in the background.");
    } else {
      console.log("Server is running in the foreground. Press Ctrl+C to stop.");
    }
  } else {
    console.error("Server failed to become healthy within the timeout period.");
    if (!background) {
      oscalServerProcess.kill();
    }
  }

  // For foreground mode, we keep the process attached
  if (!background) {
    oscalServerProcess.on('exit', (code) => {
      console.log(`Server process exited with code ${code}`);
    });
  }
}

export async function checkServerStatus(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:8888/health');
    if(response.ok)
      {
        const data = await response.json()
        console.log(data);
      }
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function waitForServerHealth(timeout: number = 30000, interval: number = 1000): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await checkServerStatus()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  return false;
}

export const serverCommand = async (command: string, { background = false }: { background: boolean }) => {
  if(typeof command==='undefined'){
    console.log("commands: start,stop,restart,update,status")
    return 
  }
  let cmd = command.trim();
  if (cmd == 'start') {
    await startServer(background);
  } else if (cmd == 'restart') {
    await stopServer();
    await startServer(background);
  } else if (cmd == 'stop') {
    await stopServer();
  } else if (cmd == 'update') {
    await installOscalExecutor('oscal-server');
  } else if (cmd == 'status') {
    await checkServerStatus();
  }
}

async function isServerRunning() {
  const processes = await psList();
  const oscalProcesses = processes.filter(process => 
    process.name.toLowerCase().includes('oscal-server') || 
    (process.cmd && process.cmd.toLowerCase().includes('oscal-server'))
  );
  return oscalProcesses.length>0
}
async function getServerPid() {
  const processes = await psList();
  const oscalProcesses = processes.filter(process => 
    process.name.toLowerCase().includes('oscal-server') || 
    (process.cmd && process.cmd.toLowerCase().includes('oscal-server'))
  );
  return oscalProcesses[0].pid
}

