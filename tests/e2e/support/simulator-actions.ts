import { expect, type Page } from "@playwright/test";
import { releaseSourceFile } from "./fixture-files";

export const editorStorageKey = "acryl-led-simulator:editor";

export async function uploadReleaseSource(page: Page): Promise<void> {
  await page.getByLabel("3Dビュー画像アップロード").setInputFiles(releaseSourceFile);

  await expect(page.locator(".simulator-canvas-host canvas")).toBeVisible();
  await expect(page.getByRole("tab", { name: "配置" })).toBeVisible();
  await expect(page.locator("main > p[aria-live='polite']")).toContainText(
    "release-source.png の読み込みが完了しました。"
  );
}

export async function openControlPanel(page: Page, name: string): Promise<void> {
  const tab = page.getByRole("tab", { name });

  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
}
