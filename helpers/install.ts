import spawn from "cross-spawn";
import { yellow } from "picocolors";

export async function install(): Promise<void> {
  const packageManager = "pnpm";
  const args: string[] = ["install"];

  return new Promise((resolve, reject) => {
    /**
     * Spawn the installation process.
     */
    const child = spawn(packageManager, args, {
      stdio: "inherit",
      env: {
        ...process.env,
        ADBLOCK: "1",
        // we set NODE_ENV to development as pnpm skips dev
        // dependencies when production
        NODE_ENV: "development",
        DISABLE_OPENCOLLECTIVE: "1",
      },
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject({ command: `${packageManager} ${args.join(" ")}` });

        return;
      }
      resolve();
    });
  });
}
