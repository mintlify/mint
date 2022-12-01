import { z } from "zod";

export const nameSchema = z
  .string({ required_error: "Name is missing" })
  .min(1, "Name cannot be empty")
  .trim();
