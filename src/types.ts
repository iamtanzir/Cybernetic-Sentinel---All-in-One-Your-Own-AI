export type AiMode = 'general' | 'thinking' | 'fast' | 'scrape';

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  buyer: string;
  styleName: string;
  washType: string;
  quantity: number;
  completedQuantity: number;
  subFactory: string;
  targetShipment: string;
  status: 'In Cutting' | 'In Wash Floor' | 'Drying & Curing' | 'QC Inspection' | 'Ready for Pack';
  priority: 'High' | 'Normal' | 'Critical';
}

export interface FabricRollBatch {
  rollId: string;
  millName: string;
  fabricType: string;
  shadeLot: string;
  totalYards: number;
  receivedDate: string;
  warpShrinkage: number; // e.g. -2.8%
  weftShrinkage: number; // e.g. -1.5%
  gsm: number;
  cplStatus: 'Passed' | 'Under Test' | 'Conditional';
  subFactoryAllocation: string;
  gatePassNo: string;
}

export interface WashMachineFloor {
  id: string;
  floor: 'Floor A (Main Heavy)' | 'Floor B (Specialty Finish)' | 'Floor C (Eco-Ozone & Bleach)';
  machineName: string;
  capacityKg: number;
  currentRecipe: string;
  waterTempC: number;
  rpm: number;
  cycleTimeRemainingMin: number;
  subFactoryPartner: string;
  status: 'Running' | 'Rinsing' | 'Draining' | 'Idle' | 'Maintenance';
}

export interface BuyerPerformance {
  buyerName: string;
  activeOrdersCount: number;
  totalGarments: number;
  onTimeDeliveryRate: number; // e.g. 98.5%
  qualityPassRate: number;    // e.g. 99.1%
  primarySubFactory: string;
  nextMilestone: string;
}

export interface SystemTelemetry {
  targetPlatforms: string[];
  privacyShield: 'ACTIVE (Local Air-Gapped)' | 'ONLINE (Hybrid Grounded)';
  offlineStatus: boolean;
  activeAiMode: AiMode;
  encryptionCipher: string;
  localVaultStorageKb: number;
}
