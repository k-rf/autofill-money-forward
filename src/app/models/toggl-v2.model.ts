import { z } from "zod";

export const TogglV2 = z.tuple([
  z.literal("Description"),
  z.literal("Duration"),
  z.literal("User"),
  z.literal("Email"),
  z.literal("Project"),
  z.literal("Tags"),
  z.literal("Start date"),
]);
export type TogglV2 = z.infer<typeof TogglV2>;
