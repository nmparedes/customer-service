import { DomainException } from "../../../common/exceptions/domain.exception";

export class YearInvalidException extends DomainException {
  constructor(year: number) {
    super("YEAR_INVALID", "Vehicle year is invalid.", {
      year,
    });
  }
}
