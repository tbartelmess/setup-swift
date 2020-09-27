import getos from "getos";

export enum OS {
  MacOS,
  Ubuntu,
}

const AVAILABLE_OS: { [platform: string]: string[] } = {
  macOS: ["latest"],
  Ubuntu: ["20.04", "18.04", "16.04"],
};

export interface System {
  os: OS;
  version: string;
  name: string;
}

export async function getSystem(): Promise<System> {
  let detectedSystem = await new Promise<getos.Os>((resolve, reject) => {
    getos((error, os) => {
      os ? resolve(os) : reject(error || "No OS detected");
    });
  });

  let system: System;

  switch (detectedSystem.os) {
    case "darwin":
      system = { os: OS.MacOS, version: "latest", name: "macOS" };
      break;
    case "linux":
      if (detectedSystem.dist !== "Ubuntu") {
        throw new Error(
          `"${detectedSystem.dist}" is not a supported linux distribution`
        );
      }
      system = {
        os: OS.Ubuntu,
        version: detectedSystem.release,
        name: "Ubuntu",
      };
      break;
    default:
      throw new Error(`"${detectedSystem.os}" is not a supported platform`);
  }

  if (!AVAILABLE_OS[system.name].includes(system.version)) {
    throw new Error(
      `Version "${system.version}" of ${system.name} is not supported`
    );
  }

  return system;
}
