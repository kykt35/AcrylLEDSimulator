import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the mvp landing page and primary simulator entry", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: "LEDアクスタの見え方を ダウンロード前に確認する"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "試してみる" })).toHaveAttribute("href", "/simulator");
    expect(screen.getByText("ダウンロードまでの流れ")).toBeInTheDocument();
  });
});
