export type ValidationResultsType = {
  success?: boolean | string;
  warnings?: string[];
  errors?: string[];
};

export class ValidationResults {
  errors: string[];
  warnings: string[];
  status: "success" | "error";

  constructor() {
    this.errors = [];
    this.warnings = [];
    this.status = "success";
  }
}
