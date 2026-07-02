import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { seedData } from "@/lib/seed";

vi.mock("server-only", () => ({}));

const files = {
  users: "users.json",
  suppliers: "suppliers.json",
  rawMaterials: "raw_materials.json",
  finishedGoods: "finished_goods.json",
  boms: "bom.json",
  purchaseOrders: "purchase_orders.json",
  stockMovements: "stock_movements.json",
} as const;

let dataDirectory: string;

beforeAll(async () => {
  dataDirectory = await mkdtemp(path.join(tmpdir(), "forgeflow-integration-"));
  process.env.DATA_DIR = dataDirectory;

  await Promise.all(Object.entries(files).map(([key, file]) =>
    writeFile(path.join(dataDirectory, file), JSON.stringify(seedData[key as keyof typeof seedData])),
  ));
});

afterAll(async () => {
  delete process.env.DATA_DIR;
  await rm(dataDirectory, { recursive: true, force: true });
});

describe("file repository", () => {
  it("persists a transaction across all database files", async () => {
    const { readDatabase, transaction } = await import("@/lib/repository");
    const supplierId = seedData.suppliers[0].supplierId;

    await transaction((database) => {
      const supplier = database.suppliers.find((item) => item.supplierId === supplierId);
      if (!supplier) throw new Error("Supplier fixture is missing");
      supplier.rating = 4.75;
      return database;
    });

    const persisted = await readDatabase();
    expect(persisted.suppliers.find((item) => item.supplierId === supplierId)?.rating).toBe(4.75);
    expect(JSON.parse(await readFile(path.join(dataDirectory, files.suppliers), "utf8"))).toEqual(persisted.suppliers);
  });
});
