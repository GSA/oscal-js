import { executeOscalCliCommand, installOscalCli, isOscalCliInstalled } from './commands.js';

export async function convert(
    document: string,
    output: string,
): Promise<void> {
    let oscalCliInstalled = await isOscalCliInstalled();

    if (!oscalCliInstalled) {
        // If OSCAL CLI is not installed, attempt to install it
        try {
            await installOscalCli();
            oscalCliInstalled = true;
        } catch (error) {
            console.error("Error installing CLI:", error);
            throw new Error("Failed to install OSCAL CLI");
        }
    }

    // Whether OSCAL CLI was already installed or just installed, proceed with conversion
    const args = ["--to=JSON", document, output,"--overwrite"];
    await executeOscalCliCommand("convert", args);
}