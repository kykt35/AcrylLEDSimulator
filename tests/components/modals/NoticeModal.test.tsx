import React, { useRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoticeDialog, NoticeModal } from "@/components/modals/NoticeModal";

function ControlledNoticeDialog() {
  const [open, setOpen] = useState(true);
  const returnFocusRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button ref={returnFocusRef} type="button">
        メニューを開く
      </button>
      <NoticeDialog
        open={open}
        onClose={() => setOpen(false)}
        returnFocusRef={returnFocusRef}
      />
    </>
  );
}

describe("NoticeModal", () => {
  it("opens from its trigger and restores focus after Escape", async () => {
    const user = userEvent.setup();

    render(<NoticeModal triggerLabel="注意事項を見る" />);

    const trigger = screen.getByRole("button", { name: "注意事項を見る" });
    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "実物との差異について" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "閉じる" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "実物との差異について" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("traps focus, ignores dialog clicks, and closes from the backdrop", async () => {
    const user = userEvent.setup();

    render(<ControlledNoticeDialog />);

    const dialog = screen.getByRole("dialog", { name: "実物との差異について" });
    const closeButton = screen.getByRole("button", { name: "閉じる" });

    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(closeButton).toHaveFocus();

    await user.click(dialog);
    expect(dialog).toBeInTheDocument();

    const backdrop = dialog.parentElement;
    expect(backdrop).not.toBeNull();
    await user.click(backdrop!);

    expect(screen.queryByRole("dialog", { name: "実物との差異について" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "メニューを開く" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });
});
