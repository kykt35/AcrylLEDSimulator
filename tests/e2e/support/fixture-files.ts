import { readFileSync } from "node:fs";
import { join } from "node:path";

const fixtureDirectory = join(process.cwd(), "tests", "fixtures");

function readFixture(fileName: string): Buffer {
  return readFileSync(join(fixtureDirectory, fileName));
}

export const releaseSourceFile = {
  name: "release-source.png",
  mimeType: "image/png",
  buffer: Buffer.from(readFixture("release-source.png.base64").toString("utf8").trim(), "base64")
};

export const brokenPngFile = {
  name: "broken.png",
  mimeType: "image/png",
  buffer: readFixture("broken.png")
};

export const nonPngFile = {
  name: "not-png.txt",
  mimeType: "text/plain",
  buffer: readFixture("not-png.txt")
};
