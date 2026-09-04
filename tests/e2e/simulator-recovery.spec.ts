import { expect, test } from "@playwright/test";
import { expectImageDownload } from "./support/download-assertions";
import { brokenPngFile, nonPngFile } from "./support/fixture-files";
import { openControlPanel, uploadReleaseSource } from "./support/simulator-actions";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("recovers from a non-PNG upload", async ({ page }) => {
  const fileInput = page.getByLabel("3Dビュー画像アップロード");

  await fileInput.setInputFiles(nonPngFile);
  await expect(page.locator(".error-notice[role='alert']")).toContainText(
    "PNGファイルを選択してください。"
  );

  await uploadReleaseSource(page);
  await expect(page.locator(".error-notice[role='alert']")).toHaveCount(0);
});

test("recovers from a corrupt PNG upload", async ({ page }) => {
  const fileInput = page.getByLabel("3Dビュー画像アップロード");

  await fileInput.setInputFiles(brokenPngFile);
  await expect(page.locator(".error-notice[role='alert']")).toContainText(
    "画像の読み込みに失敗しました。"
  );

  await uploadReleaseSource(page);
  await expect(page.locator(".error-notice[role='alert']")).toHaveCount(0);
});

test("shows the WebGL fallback and recreates the canvas", async ({ page }) => {
  await uploadReleaseSource(page);

  const fallbackMessage = page.getByText("3D プレビューを表示できません");
  await expect
    .poll(async () => {
      if ((await fallbackMessage.count()) === 0) {
        await page.locator(".simulator-canvas-host canvas").evaluate((canvas) => {
          canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
        });
      }

      return fallbackMessage.count();
    })
    .toBe(1);

  await expect(fallbackMessage).toBeVisible();
  await page.getByRole("button", { name: "3Dプレビューを再読み込み" }).click();
  await expect(page.locator(".simulator-canvas-host canvas")).toBeVisible();
});

test("keeps editor state after an export failure and allows retry", async ({ page }) => {
  await uploadReleaseSource(page);
  await openControlPanel(page, "ライト");
  await page.getByRole("button", { name: "Lime" }).click();
  await page.getByLabel("明るさ").fill("1.8");
  await openControlPanel(page, "書出し");

  const canvas = page.locator(".simulator-canvas-host canvas");
  await canvas.evaluate((element) => {
    Object.defineProperty(element, "toBlob", {
      configurable: true,
      value: (callback: BlobCallback) => callback(null)
    });
  });

  await page.getByRole("button", { name: "画像をダウンロードする" }).click();
  await expect(page.locator(".error-notice[role='alert']")).toContainText(
    "画像の書き出しに失敗しました。"
  );

  await openControlPanel(page, "ライト");
  await expect(page.getByRole("button", { name: "Lime" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("明るさ")).toHaveValue("1.8");
  await openControlPanel(page, "書出し");

  await canvas.evaluate((element) => {
    Reflect.deleteProperty(element, "toBlob");
  });

  const retryDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "画像をダウンロードする" }).click();
  await expectImageDownload(await retryDownloadPromise, "release-source.png", "png");
});
