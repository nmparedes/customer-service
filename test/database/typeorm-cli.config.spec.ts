describe("customerServiceDataSource", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      DB_HOST: "mysql",
      DB_PORT: "3307",
      DB_USERNAME: "customer_service",
      DB_PASSWORD: "local-password",
      DB_DATABASE: "customer_service",
      DB_SSL: "true",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("configures the service-owned MySQL data source for migrations", async () => {
    const { default: customerServiceDataSource } = await import(
      "../../src/database/typeorm-cli.config"
    );

    expect(customerServiceDataSource.options).toMatchObject({
      type: "mysql",
      host: "mysql",
      port: 3307,
      username: "customer_service",
      password: "local-password",
      database: "customer_service",
      synchronize: false,
      logging: false,
      ssl: { rejectUnauthorized: true },
    });
    expect(customerServiceDataSource.options.entities).toHaveLength(2);
    expect(customerServiceDataSource.options.migrations).toHaveLength(2);
  });
});
