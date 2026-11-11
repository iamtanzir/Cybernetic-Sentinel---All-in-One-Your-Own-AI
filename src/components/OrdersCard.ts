import * as xb from 'xrblocks';
import { INITIAL_ORDERS } from '../data/mockErpData.js';
import { ProductionOrder } from '../types.js';
import { AiService } from '../services/aiService.js';

export class OrdersCard {
  public card: xb.UICard;
  private orders: ProductionOrder[] = [...INITIAL_ORDERS];
  private listContainer: xb.UIPanel;
  private onSelectOrder?: (order: ProductionOrder) => void;

  constructor(onSelectOrder?: (order: ProductionOrder) => void) {
    this.onSelectOrder = onSelectOrder;

    const titlePanel = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'column',
        gap: 4,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
      },
      children: [
        new xb.UIText({
          text: '🗂️ ORDER MANAGEMENT // NEXT ERP',
          style: { fontSize: 20, fontWeight: 'bold', color: '#90caf9' },
        }),
        new xb.UIText({
          text: 'Consolidated Wash Production Batches & Sub-Factory Workflows',
          style: { fontSize: 13, color: '#b0bec5' },
        }),
      ],
    });

    this.listContainer = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
      },
      children: this.buildOrderItems(),
    });

    const scrollContainer = new xb.UIScrollView({
      style: {
        width: '100%',
        height: 250,
        backgroundColor: 'rgba(5, 12, 24, 0.6)',
        borderRadius: 10,
        padding: 8,
      },
      children: [this.listContainer],
    });

    const actionPanel = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
      },
      children: [
        new xb.UIButton({
          label: '➕ New NEXT Plan',
          icon: 'add_task',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.addNewMockOrder(),
        }),
        new xb.UIButton({
          label: '🔄 Re-balance Allocations',
          icon: 'sync_alt',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.rebalanceAllocations(),
        }),
      ],
    });

    this.card = new xb.UICard({
      size: { width: 0.64, height: 'auto' },
      manipulation: true,
      edge: true,
      style: {
        flexDirection: 'column',
        gap: 10,
        padding: 16,
        backgroundColor: 'rgba(8, 20, 36, 0.88)',
        borderColor: '#42a5f5',
        borderWidth: 1,
        borderRadius: 14,
      },
      children: [titlePanel, scrollContainer, actionPanel],
    });

    this.card.name = 'OrdersManagementCard';
    this.card.position.set(-0.84, 1.48, -1.05);
    this.card.rotation.y = 0.28;
  }

  private buildOrderItems(): xb.UIPanel[] {
    return this.orders.map((ord) => {
      const progressPercent = Math.round((ord.completedQuantity / ord.quantity) * 100);
      return new xb.UIPanel({
        style: {
          width: '100%',
          flexDirection: 'column',
          gap: 4,
          padding: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: ord.priority === 'Critical' ? '#ff5252' : '#69f0ae',
        },
        children: [
          new xb.UIPanel({
            style: {
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            children: [
              new xb.UIText({
                text: `${ord.orderNumber} • ${ord.buyer}`,
                style: { fontSize: 14, fontWeight: 'bold', color: '#ffffff' },
              }),
              new xb.UIText({
                text: `${progressPercent}% (${ord.completedQuantity.toLocaleString()} / ${ord.quantity.toLocaleString()})`,
                style: { fontSize: 12, color: '#64ffda', fontWeight: 'bold' },
              }),
            ],
          }),
          new xb.UIText({
            text: `Style: ${ord.styleName}`,
            style: { fontSize: 12, color: '#eceff1' },
          }),
          new xb.UIText({
            text: `Wash: ${ord.washType}`,
            style: { fontSize: 11, color: '#90caf9' },
          }),
          new xb.UIPanel({
            style: {
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            children: [
              new xb.UIText({
                text: `Facility: ${ord.subFactory}`,
                style: { fontSize: 11, color: '#b0bec5' },
              }),
              new xb.UIText({
                text: `Ship: ${ord.targetShipment}`,
                style: { fontSize: 11, color: '#ffb74d' },
              }),
            ],
          }),
        ],
      });
    });
  }

  private addNewMockOrder() {
    AiService.playHoloTone('confirm');
    const newOrd: ProductionOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `INCTL-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      buyer: 'Uniqlo LifeWear Japan',
      styleName: 'Ultra-Flex Selvedge Tapered',
      washType: 'Vintage Rinse + Mild Laser Abrasion',
      quantity: 50000,
      completedQuantity: 6200,
      subFactory: 'Pioneer CPL Processing Hub',
      targetShipment: '2026-12-15',
      status: 'In Wash Floor',
      priority: 'High',
    };
    this.orders.unshift(newOrd);
    this.refreshList();
    this.onSelectOrder?.(newOrd);
  }

  private rebalanceAllocations() {
    AiService.playHoloTone('scan');
    // Shift allocations to optimize line load
    this.orders.forEach((o, i) => {
      if (i % 2 === 0) {
        o.completedQuantity = Math.min(o.quantity, o.completedQuantity + 2500);
      }
    });
    this.refreshList();
  }

  private refreshList() {
    while (this.listContainer.children.length > 0) {
      this.listContainer.remove(this.listContainer.children[0]);
    }
    for (const item of this.buildOrderItems()) {
      this.listContainer.add(item);
    }
  }
}
