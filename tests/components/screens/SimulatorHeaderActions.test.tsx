import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SimulatorHeaderActions } from "@/components/screens/SimulatorHeaderActions";

describe("SimulatorHeaderActions", () => {
  it("shows desktop navigation links", () => {
    render(<SimulatorHeaderActions />);

    expect(screen.getByRole("navigation", { name: "サイトメニュー" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "使い方" })).toHaveAttribute("href", "/usage");
    expect(screen.getByRole("link", { name: "このアプリについて" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("button", { name: "注意事項" })).toBeInTheDocument();
  });

  it("opens and closes the mobile menu from the hamburger toggle", async () => {
    const user = userEvent.setup();

    render(<SimulatorHeaderActions />);

    const toggle = screen.getByTestId("header-menu-toggle");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("header-menu-panel")).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const menuPanel = screen.getByTestId("header-menu-panel");
    expect(menuPanel).toBeInTheDocument();
    expect(menuPanel).toHaveTextContent("使い方");
    expect(menuPanel).toHaveTextContent("このアプリについて");
    expect(within(menuPanel).getByRole("button", { name: "注意事項" })).toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("header-menu-panel")).not.toBeInTheDocument();
  });

  it("closes the mobile menu when a navigation link is selected", async () => {
    const user = userEvent.setup();

    render(<SimulatorHeaderActions />);

    await user.click(screen.getByTestId("header-menu-toggle"));

    const menuPanel = screen.getByTestId("header-menu-panel");
    await user.click(within(menuPanel).getByRole("menuitem", { name: "使い方" }));

    expect(screen.queryByTestId("header-menu-panel")).not.toBeInTheDocument();
  });
});
