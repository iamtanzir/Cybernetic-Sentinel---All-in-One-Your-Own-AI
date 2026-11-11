import * as THREE from 'three';
import * as xb from 'xrblocks';

import { HoloAvatarPedestal } from './components/HoloAvatarPedestal.js';
import { TerminalCard } from './components/TerminalCard.js';
import { OrdersCard } from './components/OrdersCard.js';
import { FabricsCard } from './components/FabricsCard.js';
import { WashFloorCard } from './components/WashFloorCard.js';
import { AnalyticsBuyerAdminCard } from './components/AnalyticsBuyerAdminCard.js';
import { AiService } from './services/aiService.js';

class SentinelWorkstationScene extends xb.Script {
  private pedestal!: HoloAvatarPedestal;
  private terminal!: TerminalCard;
  private ordersCard!: OrdersCard;
  private fabricsCard!: FabricsCard;
  private washFloorCard!: WashFloorCard;
  private analyticsCard!: AnalyticsBuyerAdminCard;
  private gridHelper!: THREE.GridHelper;

  init() {
    // 1. Scene Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x112233, 2.5);
    const dirLight = new THREE.DirectionalLight(0x64ffda, 1.8);
    dirLight.position.set(2, 6, 3);
    const blueBackLight = new THREE.DirectionalLight(0x0091ea, 1.2);
    blueBackLight.position.set(-3, 3, -4);
    this.add(hemiLight, dirLight, blueBackLight);

    // 2. Futuristic Grid Floor
    this.gridHelper = new THREE.GridHelper(16, 32, 0x00e5ff, 0x0d2847);
    this.gridHelper.position.y = 0.005;
    (this.gridHelper.material as THREE.Material).transparent = true;
    (this.gridHelper.material as THREE.Material).opacity = 0.45;
    this.add(this.gridHelper);

    // 3. Central Holographic Avatar Pedestal
    this.pedestal = new HoloAvatarPedestal();
    this.add(this.pedestal);

    // 4. Central Terminal Card (AI Intelligence & Web Scraper)
    this.terminal = new TerminalCard(() => {
      this.pedestal.pulseAvatar();
    });
    this.add(this.terminal.card);

    // 5. Left Cards: Order Management & Fabrics CPL Tracking
    this.ordersCard = new OrdersCard((order) => {
      this.terminal.runQuery(
        `Analyze production workflow for order ${order.orderNumber} (${order.buyer} - ${order.styleName}). Wash Recipe: ${order.washType}. Check sub-factory allocation readiness at ${order.subFactory}.`,
        'thinking'
      );
    });
    this.add(this.ordersCard.card);

    this.fabricsCard = new FabricsCard();
    this.add(this.fabricsCard.card);

    // 6. Right Cards: Garments Tracking Wash Floor & Buyer Analytics/Admin
    this.washFloorCard = new WashFloorCard();
    this.add(this.washFloorCard.card);

    this.analyticsCard = new AnalyticsBuyerAdminCard();
    this.add(this.analyticsCard.card);
  }

  update() {
    const delta = xb.getDeltaTime ? xb.getDeltaTime() : 0.016;
    if (this.pedestal) {
      this.pedestal.update(delta);
    }
  }

  onSelectEnd(event: xb.SelectEvent) {
    // If user clicks or taps near the avatar pedestal, pulse avatar and play holo tone
    if (event.intersection && event.intersection.point.distanceTo(new THREE.Vector3(0, 1.2, -1.9)) < 1.0) {
      this.pedestal.pulseAvatar();
      this.terminal.runQuery(
        'Execute instant health check on all INCTL Wash ERP modules: Order Management, Fabrics CPL, Floor Tracking, Buyer Consolidation, and Local Data Vault.',
        'fast'
      );
    }
  }

  dispose() {
    this.gridHelper.geometry.dispose();
    if (Array.isArray(this.gridHelper.material)) {
      this.gridHelper.material.forEach((m) => m.dispose());
    } else {
      this.gridHelper.material.dispose();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const options = new xb.Options();
  options.setAppTitle('INCTL Cybernetic Sentinel ERP');
  options.setAppDescription(
    'Cross-platform PC and WebXR spatial intelligence workstation for INCTL Wash ERP.'
  );
  options.enableReticles();

  xb.add(new SentinelWorkstationScene());
  xb.init(options);
});
