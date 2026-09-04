import React, { useRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { NoticeDialog, NoticeModal } from "@/components/modals/NoticeModal";

type ControlledNoticeDialogProps = {
  onCloseSpy?: () => void;
  onReturnFocus?: () => void;
  renderVersion?: number;
};

function ControlledNoticeDialog({
  onCloseSpy,
  onReturnFocus,
  renderVersion = 0
}: ControlledNoticeDialogProps) {
  const [open, setOpen] = useState(true);
  const returnFocusRef = useRef<HTMLButtonElement>(null);

  function closeDialog() {
    onCloseSpy?.();
    setOpen(false);
  }

  return (
    <>
      <button
        ref={returnFocusRef}
        type="button"
        data-render-version={renderVersion}
        onFocus={onReturnFocus}
      >
        メニューを開く
      </button>
      <NoticeDialog
        open={open}
        onClose={closeDialog}
        returnFocusRef={returnFocusRef}
      />
    </>
  );
}

describe("NoticeModal", () => {
  it("opens from its trigger and restores focus after Escape", async () => {
    const user = userEvent.setup();
    const onTriggerClick = vi.fn();

    render(<NoticeModal triggerLabel="注意事項を見る" onTriggerClick={onTriggerClick} />);

    const trigger = screen.getByRole("button", { name: "注意事項を見る" });
    await user.click(trigger);

    expect(onTriggerClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog", { name: "実物との差異について" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "閉じる" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "実物との差異について" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("traps focus, ignores dialog clicks, and closes from the backdrop", async () => {
    const user = userEvent.setup();
    const onCloseSpy = vi.fn();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "clip";

    try {
      render(<ControlledNoticeDialog onCloseSpy={onCloseSpy} />);

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

      expect(
        screen.queryByRole("dialog", { name: "実物との差異について" })
      ).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "メニューを開く" })).toHaveFocus();
      expect(document.body.style.overflow).toBe("clip");
      expect(onCloseSpy).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    } finally {
      document.body.style.overflow = previousOverflow;
    }
  });

  it("does not restore focus while an open controlled dialog rerenders", () => {
    const onReturnFocus = vi.fn();
    const { rerender } = render(
      <ControlledNoticeDialog renderVersion={1} onReturnFocus={onReturnFocus} />
    );

    const closeButton = screen.getByRole("button", { name: "閉じる" });
    expect(closeButton).toHaveFocus();

    rerender(<ControlledNoticeDialog renderVersion={2} onReturnFocus={onReturnFocus} />);

    expect(closeButton).toHaveFocus();
    expect(onReturnFocus).not.toHaveBeenCalled();
  });
});
