import { expect, test } from "@playwright/test";
import { expectImageDownload } from "./support/download-assertions";
import {
  editorStorageKey,
  openControlPanel,
  uploadReleaseSource
} from "./support/simulator-actions";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LEDアクスタ シミュレーター" })).toBeVisible();
  await expect(page.getByTestId("preview-empty-state")).toBeVisible();
});

test("uploads, adjusts, crops, and downloads release images", async ({ page }) => {
  await uploadReleaseSource(page);

  await openControlPanel(page, "配置");
  await page.getByRole("radio", { name: "L (150 x 200 mm)" }).click();
  await page.getByRole("button", { name: "余白なく広げる" }).click();
  await page.getByLabel("画像サイズ").fill("125");
  await page.getByLabel("画像の横位置").fill("20");
  await expect(page.getByRole("radio", { name: "L (150 x 200 mm)" })).toHaveAttribute(
    "aria-checked",
    "true"
  );
  await expect(page.getByLabel("画像サイズ")).toHaveValue("125");

  await openControlPanel(page, "ライト");
  await page.getByRole("button", { name: "Lime" }).click();
  await page.getByLabel("明るさ").fill("1.8");
  await expect(page.getByRole("button", { name: "Lime" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("明るさ")).toHaveValue("1.8");

  await openControlPanel(page, "カメラ");
  await page.getByRole("button", { name: "Rose Glow" }).click();
  await page.getByRole("button", { name: "接写" }).click();
  await expect(page.getByRole("button", { name: "Rose Glow" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(page.getByRole("button", { name: "接写" })).toHaveAttribute("aria-pressed", "true");

  await openControlPanel(page, "彫刻");
  await page.getByText("彫刻モード", { exact: true }).click();
  await page.getByRole("radio", { name: "黒を導光" }).click();
  await page.getByRole("radio", { name: "階調" }).click();
  await page.getByLabel("しきい値 数値入力").fill("0.45");
  await page.getByLabel("階調数 数値入力").fill("4");
  await expect(page.getByLabel("彫刻モード")).toBeChecked();
  await expect(page.getByAltText("彫刻用画像プレビュー")).toBeVisible();

  const engravingDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "彫刻用 PNG をダウンロード" }).click();
  await expectImageDownload(
    await engravingDownloadPromise,
    "release-source-engraving.png",
    "png"
  );

  await page.getByText("書出範囲", { exact: true }).click();
  await expect(page.getByLabel("書出範囲を表示")).toBeChecked();
  const cropBox = page.locator(".export-crop-overlay__box");
  const initialCropStyle = await cropBox.getAttribute("style");
  const southeastHandle = page.getByRole("button", { name: "右下を調整" });
  const handleBounds = await southeastHandle.boundingBox();
  expect(handleBounds).not.toBeNull();
  await page.mouse.move(handleBounds!.x + handleBounds!.width / 2, handleBounds!.y + handleBounds!.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBounds!.x - 80, handleBounds!.y - 80, { steps: 5 });
  await page.mouse.up();
  await expect(cropBox).not.toHaveAttribute("style", initialCropStyle ?? "");

  await openControlPanel(page, "書出し");
  await expect(page.getByAltText("書き出しプレビュー")).toBeVisible();

  const pngDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "画像をダウンロードする" }).click();
  await expectImageDownload(await pngDownloadPromise, "release-source.png", "png");
  await expect(page.getByRole("heading", { name: "ダウンロードを開始しました" })).toBeVisible();
  await page.getByRole("button", { name: "閉じる" }).click();

  await page.getByRole("radio", { name: "JPG" }).click();
  const jpgDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "画像をダウンロードする" }).click();
  await expectImageDownload(await jpgDownloadPromise, "release-source.jpg", "jpeg");
});

test("resumes a saved editor and clears it through both reset paths", async ({ page }) => {
  await uploadReleaseSource(page);
  await openControlPanel(page, "ライト");
  await page.getByRole("button", { name: "Lime" }).click();
  await page.getByLabel("明るさ").fill("1.8");

  await openControlPanel(page, "書出し");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "画像をダウンロードする" }).click();
  await expectImageDownload(await downloadPromise, "release-source.png", "png");

  const savedSnapshot = await page.evaluate((key) => window.sessionStorage.getItem(key), editorStorageKey);
  expect(savedSnapshot).not.toBeNull();

  await page.goto("/?resume=1");
  await expect(page.getByRole("tab", { name: "配置" })).toBeVisible();
  await openControlPanel(page, "ライト");
  await expect(page.getByRole("button", { name: "Lime" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("明るさ")).toHaveValue("1.8");

  await page.getByRole("button", { name: "リセット" }).click();
  await expect(page.getByTestId("preview-empty-state")).toBeVisible();
  await expect
    .poll(() => page.evaluate((key) => window.sessionStorage.getItem(key), editorStorageKey))
    .toBeNull();

  await page.evaluate(
    ([key, value]) => window.sessionStorage.setItem(key, value),
    [editorStorageKey, savedSnapshot!]
  );
  await page.goto("/?reset=1");
  await expect(page.getByTestId("preview-empty-state")).toBeVisible();
  await expect
    .poll(() => page.evaluate((key) => window.sessionStorage.getItem(key), editorStorageKey))
    .toBeNull();
});
