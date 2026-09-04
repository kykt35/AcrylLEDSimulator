import { readFile } from "node:fs/promises";
import { expect, type Download } from "@playwright/test";

const signatures = {
  png: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  jpeg: Buffer.from([0xff, 0xd8, 0xff])
} as const;

export async function expectImageDownload(
  download: Download,
  expectedFileName: string,
  format: keyof typeof signatures
): Promise<void> {
  expect(download.suggestedFilename()).toBe(expectedFileName);

  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();

  const bytes = await readFile(downloadPath!);
  expect(bytes.length).toBeGreaterThan(signatures[format].length);
  expect(bytes.subarray(0, signatures[format].length)).toEqual(signatures[format]);
}
