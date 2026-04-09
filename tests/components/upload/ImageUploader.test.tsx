import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageUploader } from "@/components/upload/ImageUploader";

describe("ImageUploader", () => {
  it("passes the selected file to the container", async () => {
    const onFileSelected = vi.fn();
    const user = userEvent.setup();

    render(<ImageUploader onFileSelected={onFileSelected} />);

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "uploaded.png", { type: "image/png" });

    await user.upload(input, file);

    expect(onFileSelected).toHaveBeenCalledWith(file);
    expect(screen.getByText("uploaded.png を選択しました。")).toBeInTheDocument();
  });

  it("shows a validation error for non-png files and supports drag state", async () => {
    const onFileSelected = vi.fn();

    render(<ImageUploader onFileSelected={onFileSelected} />);

    const dropzone = screen.getByText("ここにドロップ または クリックして選択").closest("label");
    expect(dropzone).not.toBeNull();

    fireEvent.dragOver(dropzone!);
    expect(dropzone).toHaveClass("is-dragging");

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["jpg"], "uploaded.jpg", { type: "image/jpeg" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileSelected).not.toHaveBeenCalled();
    expect(screen.getByText("PNG ファイルを選択してください。")).toBeInTheDocument();
  });
});
