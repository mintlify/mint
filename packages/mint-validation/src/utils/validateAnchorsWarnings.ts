import { AnchorsType } from "../types/anchors";
import { MintValidationResults } from "./common";

export function validateAnchorsWarnings(anchors?: AnchorsType) {
  let results = new MintValidationResults();
  if (anchors == undefined || anchors.length === 0) {
    results.warnings.push(
      "Mintlify runs without anchors but most sites look better with at least one."
    );
  }

  return results;
}
