import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageControls } from "@/components/controls/ImageControls";

describe("ImageControls", () => {
  it("renders the acrylic size dropdown and emits selection changes", async () => {
    const user = userEvent.setup();
    const onAcrylicSizeChange = vi.fn();

    render(
      <ImageControls
        acrylicSizeId="medium"
        fileName="sample.png"
        hasImage={true}
        statusLabel="ready"
        errorMessage={null}
        imageLayout={{
          contentFit: "contain",
          scale: 1,
          offsetX: 0,
          offsetY: 0
        }}
        onAcrylicSizeChange={onAcrylicSizeChange}
        onImageLayoutChange={vi.fn()}
        onResetImageLayout={vi.fn()}
      />
    );

    expect(screen.getByRole("radio", { name: "M (120 x 180 mm)" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "S (100 x 150 mm)" })).toBeInTheDocument();
    expect(screen.getByText("画像の追加方法")).toBeInTheDocument();
    expect(screen.getByText("3D ビューに画像をドラッグするか、クリックして PNG を選択してください。")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "L (150 x 200 mm)" }));

    expect(onAcrylicSizeChange).toHaveBeenCalledWith("large");
  });

  it("keeps layout controls hidden until an image is uploaded", () => {
    render(
      <ImageControls
        acrylicSizeId="medium"
        fileName="未選択"
        hasImage={false}
        statusLabel="PNG をアップロードすると 3D プレビューへ反映されます。"
        errorMessage={null}
        imageLayout={{
          contentFit: "contain",
          scale: 1,
          offsetX: 0,
          offsetY: 0
        }}
        onAcrylicSizeChange={vi.fn()}
        onImageLayoutChange={vi.fn()}
        onResetImageLayout={vi.fn()}
      />
    );

    expect(screen.getByText("PNGを追加すると配置調整ができます。")).toBeInTheDocument();
    expect(screen.queryByText("コンテントフィット")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("画像サイズ")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("画像の横位置")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("画像の縦位置")).not.toBeInTheDocument();
  });

  it("forwards layout changes and reset actions", async () => {
    const user = userEvent.setup();
    const onImageLayoutChange = vi.fn();
    const onResetImageLayout = vi.fn();

    render(
      <ImageControls
        acrylicSizeId="medium"
        fileName="sample.png"
        hasImage={true}
        statusLabel="ready"
        errorMessage={null}
        imageLayout={{
          contentFit: "contain",
          scale: 1,
          offsetX: 0,
          offsetY: 0
        }}
        onAcrylicSizeChange={vi.fn()}
        onImageLayoutChange={onImageLayoutChange}
        onResetImageLayout={onResetImageLayout}
      />
    );

    await user.click(screen.getByRole("button", { name: "余白なく広げる" }));
    fireEvent.change(screen.getByLabelText("画像サイズ"), { target: { value: "130" } });
    await user.click(screen.getByRole("button", { name: "画像調整をリセット" }));

    expect(onImageLayoutChange).toHaveBeenCalledWith({ contentFit: "cover" });
    expect(onImageLayoutChange).toHaveBeenCalledWith({ scale: 1.3 });
    expect(onResetImageLayout).toHaveBeenCalled();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
