import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ColorPalette } from "./ColorPalette";

const meta = {
  title: "Style System/Colors",
  component: ColorPalette,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
