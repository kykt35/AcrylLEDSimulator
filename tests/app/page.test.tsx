import React from "react";
import { render, screen } from "@testing-library/react";
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
  });
});
