import { InventoryHealthDashboard } from "./InventoryHealthDashboard";
import { InventoryAuditWidget } from "./InventoryAuditWidget";

export function InventoryAuditTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inventory Audit</h2>
        <p className="text-muted-foreground mt-1">
          Monitor inventory accuracy and sync health across all clients
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InventoryHealthDashboard />
        <InventoryAuditWidget />
      </div>
    </div>
  );
}
