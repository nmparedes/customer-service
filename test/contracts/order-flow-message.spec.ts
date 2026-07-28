import type { OrderFlowMessageEnvelope } from "../../src/contracts/order-flow-message.interface";

describe("Order flow message envelope", () => {
  it("keeps the ADR 005 metadata in the local contract", () => {
    const message: OrderFlowMessageEnvelope<
      "customer.contract.check",
      Record<string, never>
    > = {
      eventId: "event-001",
      eventName: "customer.contract.check",
      eventVersion: 1,
      occurredAt: "2026-01-01T00:00:00.000Z",
      correlationId: "correlation-001",
      causationId: "cause-001",
      sagaId: "saga-001",
      orderId: "order-001",
      payload: {},
    };

    expect(message).toMatchObject({
      eventVersion: 1,
      correlationId: "correlation-001",
      sagaId: "saga-001",
      orderId: "order-001",
    });
  });
});
