import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

vi.mock("@/components/simulator/SimulatorCanvas", () => ({
  SimulatorCanvas: () => <div data-testid="simulator-canvas" />
}));

describe("HomePage", () => {
  it("renders the poc shell and milestone summary", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: "LEDアクスタの見え方を その場で検証する"
      })
    ).toBeInTheDocument();
    expect(screen.getByText("M2 PoC 完了")).toBeInTheDocument();
    expect(screen.getByTestId("simulator-canvas")).toBeInTheDocument();
  });
});
