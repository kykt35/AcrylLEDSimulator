import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the mvp landing page and primary simulator entry", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: "LEDアクスタの彫刻データと見え方を まとめて確認する"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "試してみる" })).toHaveAttribute("href", "/simulator");
    expect(screen.getByText("出力までの流れ")).toBeInTheDocument();
    expect(screen.getByText("Visual Preview")).toBeInTheDocument();
  });

  it("opens and closes the notice modal with keyboard support", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "注意事項を見る" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("実物との差異について");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
