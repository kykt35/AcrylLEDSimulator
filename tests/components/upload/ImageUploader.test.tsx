import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageUploader } from "@/components/upload/ImageUploader";

vi.mock("@/lib/image/loadPngTexture", () => ({
  loadPngTexture: vi.fn().mockResolvedValue({
    src: "data:image/png;base64,uploaded",
    name: "uploaded.png"
  })
}));

describe("ImageUploader", () => {
  it("uploads a png file and reports the selected image", async () => {
    const onImageSelected = vi.fn();
    const user = userEvent.setup();

    render(<ImageUploader onImageSelected={onImageSelected} />);

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "uploaded.png", { type: "image/png" });

    await user.upload(input, file);

    await waitFor(() => {
      expect(onImageSelected).toHaveBeenCalledWith({
        src: "data:image/png;base64,uploaded",
        name: "uploaded.png"
      });
    });

    expect(screen.getByText("uploaded.png を読み込みました。")).toBeInTheDocument();
  });
});
