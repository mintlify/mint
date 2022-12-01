export class MintValidationResults {
  status: "error" | "success" | undefined;
  errors: string[];
  warnings: string[];

  constructor() {
    this.errors = [];
    this.warnings = [];
  }
}
