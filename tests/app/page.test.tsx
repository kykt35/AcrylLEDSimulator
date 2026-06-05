import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AboutPage from "@/app/about/page";
import HomePage from "@/app/page";
import UsagePage from "@/app/usage/page";

vi.mock("@/components/screens/SimulatorScreen", () => ({
  SimulatorScreen: ({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) => (
    <main data-testid="simulator-screen" data-resume={searchParams?.resume ?? ""}>
      LEDアクスタ シミュレーター
    </main>
  )
}));

describe("HomePage", () => {
  it("renders the simulator as the top page", async () => {
    render(await HomePage({ searchParams: Promise.resolve({ resume: "1" }) }));

    expect(screen.getByTestId("simulator-screen")).toHaveTextContent("LEDアクスタ シミュレーター");
    expect(screen.getByTestId("simulator-screen")).toHaveAttribute("data-resume", "1");
  });
});

describe("AboutPage", () => {
  it("renders the mvp landing page and primary simulator entry", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", {
        name: "LEDアクスタの彫刻データと見え方を まとめて確認する"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "試してみる" })).toHaveAttribute("href", "/");
    expect(screen.getByText("出力までの流れ")).toBeInTheDocument();
    expect(screen.getByText("Visual Preview")).toBeInTheDocument();
  });

  it("opens and closes the notice modal with keyboard support", async () => {
    const user = userEvent.setup();

    render(<AboutPage />);

    await user.click(screen.getByRole("button", { name: "注意事項を見る" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("実物との差異について");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("UsagePage", () => {
  it("renders the usage flow and simulator entry", () => {
    render(<UsagePage />);

    expect(screen.getByRole("heading", { name: "使い方" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "シミュレーターへ戻る" })).toHaveAttribute("href", "/");
    expect(screen.getByText("PNG を追加する")).toBeInTheDocument();
    expect(screen.getByText("彫刻とライトを調整する")).toBeInTheDocument();
    expect(screen.getByText("画像を書き出す")).toBeInTheDocument();
    expect(screen.getByText("事前に確認すること")).toBeInTheDocument();
  });
});
