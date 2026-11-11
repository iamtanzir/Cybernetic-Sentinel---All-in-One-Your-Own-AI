import * as xb from 'xrblocks';
import { INITIAL_MACHINES } from '../data/mockErpData.js';
import { WashMachineFloor } from '../types.js';
import { AiService } from '../services/aiService.js';

export class WashFloorCard {
  public card: xb.UICard;
  private machines: WashMachineFloor[] = [...INITIAL_MACHINES];
  private listPanel: xb.UIPanel;
  private tempStatusText: xb.UIText;
  private rpmStatusText: xb.UIText;

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
          text: '🧺 GARMENTS TRACKING // WASH FLOOR & SUB-UNITS',
          style: { fontSize: 20, fontWeight: 'bold', color: '#ce93d8' },
        }),
        new xb.UIText({
          text: 'Floor A / B / C Belly Washers • Hydro-Extractors • Ozone Reactors',
          style: { fontSize: 13, color: '#e1bee7' },
        }),
      ],
    });

    this.listPanel = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
      },
      children: this.buildMachineItems(),
    });

    const scrollContainer = new xb.UIScrollView({
      style: {
        width: '100%',
        height: 200,
        backgroundColor: 'rgba(24, 8, 30, 0.6)',
        borderRadius: 10,
        padding: 8,
      },
      children: [this.listPanel],
    });

    // Machine live tuner sliders
    this.tempStatusText = new xb.UIText({
      text: 'Wash Temp: 55°C',
      style: { fontSize: 13, fontWeight: 'bold', color: '#f48fb1' },
    });

    const tempSlider = new xb.UISlider({
      ariaLabel: 'Wash Water Temperature',
      min: 20,
      max: 85,
      step: 1,
      value: 55,
      style: { width: '100%', height: 32 },
      onInput: (val: number) => {
        this.tempStatusText.text = `Wash Temp: ${val}°C`;
        if (this.machines[0]) {
          this.machines[0].waterTempC = val;
        }
      },
    });

    this.rpmStatusText = new xb.UIText({
      text: 'Hydro Spin: 650 RPM',
      style: { fontSize: 13, fontWeight: 'bold', color: '#ba68c8' },
    });

    const rpmSlider = new xb.UISlider({
      ariaLabel: 'Hydro Extractor Spin RPM',
      min: 200,
      max: 850,
      step: 25,
      value: 650,
      style: { width: '100%', height: 32 },
      onInput: (val: number) => {
        this.rpmStatusText.text = `Hydro Spin: ${val} RPM`;
        if (this.machines[1]) {
          this.machines[1].rpm = val;
        }
      },
    });

    const tunerPanel = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'column',
        gap: 6,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
      },
      children: [this.tempStatusText, tempSlider, this.rpmStatusText, rpmSlider],
    });

    const actionPanel = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
      },
      children: [
        new xb.UIButton({
          label: '⚡ Next Wash Stage',
          icon: 'play_arrow',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.advanceWashStage(),
        }),
        new xb.UIButton({
          label: '🔄 Sub-Factory Sync',
          icon: 'sync',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.syncSubFactories(),
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
        backgroundColor: 'rgba(32, 10, 40, 0.88)',
        borderColor: '#ab47bc',
        borderWidth: 1,
        borderRadius: 14,
      },
      children: [titlePanel, scrollContainer, tunerPanel, actionPanel],
    });

    this.card.name = 'WashFloorTrackingCard';
    this.card.position.set(0.84, 1.48, -1.05);
    this.card.rotation.y = -0.28;
  }

  private buildMachineItems(): xb.UIPanel[] {
    return this.machines.map((m) => {
      return new xb.UIPanel({
        style: {
          width: '100%',
          flexDirection: 'column',
          gap: 4,
          padding: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: m.status === 'Running' ? '#00e676' : '#29b6f6',
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
                text: `${m.machineName}`,
                style: { fontSize: 13, fontWeight: 'bold', color: '#ffffff' },
              }),
              new xb.UIText({
                text: `${m.status} (${m.cycleTimeRemainingMin}m left)`,
                style: { fontSize: 11, color: '#69f0ae', fontWeight: 'bold' },
              }),
            ],
          }),
          new xb.UIText({
            text: `Floor: ${m.floor} • Cap: ${m.capacityKg} kg`,
            style: { fontSize: 11, color: '#e1bee7' },
          }),
          new xb.UIText({
            text: `Recipe: ${m.currentRecipe}`,
            style: { fontSize: 11, color: '#f48fb1' },
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
                text: `Temp: ${m.waterTempC}°C | Spin: ${m.rpm} RPM`,
                style: { fontSize: 11, color: '#ba68c8' },
              }),
              new xb.UIText({
                text: `Partner: ${m.subFactoryPartner}`,
                style: { fontSize: 11, color: '#b0bec5' },
              }),
            ],
          }),
        ],
      });
    });
  }

  private advanceWashStage() {
    AiService.playHoloTone('scan');
    this.machines.forEach((m) => {
      if (m.cycleTimeRemainingMin > 5) {
        m.cycleTimeRemainingMin -= 5;
      } else {
        m.cycleTimeRemainingMin = 25;
        m.status = m.status === 'Running' ? 'Rinsing' : 'Running';
      }
    });
    this.refresh();
  }

  private syncSubFactories() {
    AiService.playHoloTone('confirm');
    this.refresh();
  }

  private refresh() {
    while (this.listPanel.children.length > 0) {
      this.listPanel.remove(this.listPanel.children[0]);
    }
    for (const item of this.buildMachineItems()) {
      this.listPanel.add(item);
    }
  }
}
