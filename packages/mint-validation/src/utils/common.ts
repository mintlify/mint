export class MintValidationResults {
  status: "error" | "success";
  errors: string[];
  warnings: string[];

  constructor() {
    this.status = "success";
    this.errors = [];
    this.warnings = [];
  }
}
