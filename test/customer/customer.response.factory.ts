import { CustomerStatusResponseDto } from "../../src/customer/application/dto/customer-status-response.dto";

export function createCustomerStatusResponse(
  overrides: Partial<CustomerStatusResponseDto> = {},
): CustomerStatusResponseDto {
  return {
    id: "customer-1",
    cpf: "52998224725",
    active: true,
    status: "ACTIVE",
    ...overrides,
  };
}
