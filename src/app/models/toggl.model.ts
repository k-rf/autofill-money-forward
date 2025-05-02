import { z } from "zod";

export const Toggl = z.tuple([
  z.literal("User"),
  z.literal("Email"),
  z.literal("Client"),
  z.literal("Project"),
  z.literal("Task"),
  z.literal("Description"),
  z.literal("Billable"),
  z.literal("Start date"),
  z.literal("Start time"),
  z.literal("End date"),
  z.literal("End time"),
  z.literal("Duration"),
  z.literal("Tags"),
]);
export type Toggl = z.infer<typeof Toggl>;
