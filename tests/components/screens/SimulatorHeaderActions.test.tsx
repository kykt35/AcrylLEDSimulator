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

  it("opens the notice dialog after closing the mobile menu and returns focus to the toggle", async () => {
    const user = userEvent.setup();

    render(<SimulatorHeaderActions />);

    const toggle = screen.getByTestId("header-menu-toggle");
    await user.click(toggle);

    const menuPanel = screen.getByTestId("header-menu-panel");
    await user.click(within(menuPanel).getByRole("button", { name: "注意事項" }));

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("header-menu-panel")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "実物との差異について" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "閉じる" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "実物との差異について" })).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();

    await user.click(toggle);
    await user.click(
      within(screen.getByTestId("header-menu-panel")).getByRole("button", { name: "注意事項" })
    );
    await user.click(screen.getByRole("button", { name: "閉じる" }));

    expect(screen.queryByRole("dialog", { name: "実物との差異について" })).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });
});
