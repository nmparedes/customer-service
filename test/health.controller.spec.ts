import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { HealthController } from "../src/health/health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, fallback: string) => fallback),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  it("returns liveness status", () => {
    expect(controller.health()).toEqual({
      status: "ok",
      service: "customer-service",
    });
  });

  it("returns readiness status with version", () => {
    expect(controller.ready()).toEqual({
      status: "ok",
      service: "customer-service",
      version: "0.1.0",
    });
  });

  it("exposes Prometheus metrics", async () => {
    await expect(controller.metrics()).resolves.toContain("# HELP");
  });
});
