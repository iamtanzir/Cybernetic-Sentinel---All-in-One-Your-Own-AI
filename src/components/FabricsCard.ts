import * as xb from 'xrblocks';
import { INITIAL_FABRICS } from '../data/mockErpData.js';
import { FabricRollBatch } from '../types.js';
import { AiService } from '../services/aiService.js';

export class FabricsCard {
  public card: xb.UICard;
  private fabrics: FabricRollBatch[] = [...INITIAL_FABRICS];
  private listPanel: xb.UIPanel;

  constructor() {
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
          text: '🧵 FABRICS TRACKING // CPL & WIP',
          style: { fontSize: 20, fontWeight: 'bold', color: '#80cbc4' },
        }),
        new xb.UIText({
          text: 'Receive • Shrinkage • GSM • Shade Lot • Sub-Factory Gate Pass',
          style: { fontSize: 13, color: '#b2dfdb' },
        }),
      ],
    });

    this.listPanel = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
      },
      children: this.buildFabricItems(),
    });

    const scrollContainer = new xb.UIScrollView({
      style: {
        width: '100%',
        height: 230,
        backgroundColor: 'rgba(3, 20, 24, 0.6)',
        borderRadius: 10,
        padding: 8,
      },
      children: [this.listPanel],
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
          label: '🧪 CPL Lab Test',
          icon: 'biotech',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.runLabTestBatch(),
        }),
        new xb.UIButton({
          label: '🚚 Gate Pass Sub-Unit',
          icon: 'local_shipping',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.generateGatePass(),
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
        backgroundColor: 'rgba(4, 28, 30, 0.88)',
        borderColor: '#26a69a',
        borderWidth: 1,
        borderRadius: 14,
      },
      children: [titlePanel, scrollContainer, actionPanel],
    });

    this.card.name = 'FabricsTrackingCard';
    this.card.position.set(-1.42, 1.42, -0.72);
    this.card.rotation.y = 0.52;
  }

  private buildFabricItems(): xb.UIPanel[] {
    return this.fabrics.map((fab) => {
      return new xb.UIPanel({
        style: {
          width: '100%',
          flexDirection: 'column',
          gap: 4,
          padding: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: fab.cplStatus === 'Passed' ? '#00e676' : '#ffab00',
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
                text: `${fab.rollId} • ${fab.millName}`,
                style: { fontSize: 14, fontWeight: 'bold', color: '#ffffff' },
              }),
              new xb.UIText({
                text: `CPL: ${fab.cplStatus}`,
                style: {
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: fab.cplStatus === 'Passed' ? '#69f0ae' : '#ffd54f',
                },
              }),
            ],
          }),
          new xb.UIText({
            text: `${fab.fabricType} | ${fab.shadeLot}`,
            style: { fontSize: 12, color: '#e0f2f1' },
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
                text: `Shrinkage: Warp ${fab.warpShrinkage}% / Weft ${fab.weftShrinkage}%`,
                style: { fontSize: 11, color: '#80cbc4' },
              }),
              new xb.UIText({
                text: `GSM: ${fab.gsm} | ${fab.totalYards.toLocaleString()} yds`,
                style: { fontSize: 11, color: '#b2dfdb' },
              }),
            ],
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
                text: `Sub-Factory: ${fab.subFactoryAllocation}`,
                style: { fontSize: 11, color: '#90a4ae' },
              }),
              new xb.UIText({
                text: `Gate Pass: ${fab.gatePassNo}`,
                style: { fontSize: 11, color: '#ffd54f' },
              }),
            ],
          }),
        ],
      });
    });
  }

  private runLabTestBatch() {
    AiService.playHoloTone('scan');
    this.fabrics.forEach((f) => {
      f.cplStatus = 'Passed';
      f.warpShrinkage = parseFloat((-2.5 - Math.random() * 0.8).toFixed(1));
      f.weftShrinkage = parseFloat((-1.0 - Math.random() * 0.6).toFixed(1));
    });
    this.refresh();
  }

  private generateGatePass() {
    AiService.playHoloTone('confirm');
    const newRoll: FabricRollBatch = {
      rollId: `CPL-ROLL-${Math.floor(5000 + Math.random() * 4000)}`,
      millName: 'Ha-Meem Denim Mill',
      fabricType: '11.8oz Ring Spun Slub Indigo',
      shadeLot: 'LOT-HM-88X',
      totalYards: 14000,
      receivedDate: '2026-10-28',
      warpShrinkage: -2.9,
      weftShrinkage: -1.3,
      gsm: 338,
      cplStatus: 'Passed',
      subFactoryAllocation: 'Anowara Wash Ltd (Unit 2)',
      gatePassNo: `GP-${Math.floor(1000 + Math.random() * 9000)}-DEL`,
    };
    this.fabrics.unshift(newRoll);
    this.refresh();
  }

  private refresh() {
    while (this.listPanel.children.length > 0) {
      this.listPanel.remove(this.listPanel.children[0]);
    }
    for (const item of this.buildFabricItems()) {
      this.listPanel.add(item);
    }
  }
}
