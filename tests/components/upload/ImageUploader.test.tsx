import React from "react";
import { render, screen } from "@testing-library/react";
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
});
