import { Shell } from "@/components/shell";
import { readDatabase } from "@/lib/repository";

const itemTypes = { RAW_MATERIAL: "Сировина", FINISHED_GOOD: "Готова продукція" } as const;

export default async function Ledger() {
  const data = await readDatabase();
  const names = new Map([...data.rawMaterials.map((i) => [i.materialId, i.materialName] as const), ...data.finishedGoods.map((i) => [i.productId, i.productName] as const)]);
  return <Shell eyebrow="Незмінна історія" title="Журнал рухів"><section className="panel"><div className="panel-head"><div><p className="eyebrow">Аудиторський слід</p><h2>Записано рухів: {data.stockMovements.length}</h2></div><span className="badge neutral">Лише читання</span></div><div className="table-wrap"><table><thead><tr><th>Дата й час</th><th>Позиція</th><th>Рух</th><th>Причина</th><th>Документ</th><th>Виконавець</th></tr></thead><tbody>{[...data.stockMovements].sort((a,b) => b.timestamp.localeCompare(a.timestamp)).map((movement) => <tr key={movement.movementId}><td>{new Date(movement.timestamp).toLocaleString("uk-UA")}</td><td><strong>{names.get(movement.itemId) ?? movement.itemId}</strong><small>{itemTypes[movement.itemType]}</small></td><td><span className={`quantity ${movement.direction.toLowerCase()}`}>{movement.quantity > 0 ? "+" : ""}{movement.quantity}</span></td><td>{movement.reason}</td><td><code>{movement.associatedDocId}</code></td><td>{data.users.find((u) => u.userId === movement.userId)?.fullName ?? movement.userId}</td></tr>)}</tbody></table></div></section></Shell>;
}
