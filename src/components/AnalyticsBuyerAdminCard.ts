import * as xb from 'xrblocks';
import { INITIAL_BUYERS, PLATFORM_SPECS } from '../data/mockErpData.js';
import { BuyerPerformance } from '../types.js';
import { AiService } from '../services/aiService.js';

export class AnalyticsBuyerAdminCard {
  public card: xb.UICard;
  private buyers: BuyerPerformance[] = [...INITIAL_BUYERS];
  private currentTab: 'buyers' | 'analytics' | 'admin_pc' = 'buyers';
  private contentPanel: xb.UIPanel;
  private tabIndicatorText: xb.UIText;

  constructor() {
    this.tabIndicatorText = new xb.UIText({
      text: 'VIEW: 👥 BUYER CONSOLIDATION',
      style: { fontSize: 13, fontWeight: 'bold', color: '#ffb74d' },
    });

    const header = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'column',
        gap: 6,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
      },
      children: [
        new xb.UIText({
          text: '📊 BUYER HUB • ANALYTICS • PC DEPLOY',
          style: { fontSize: 19, fontWeight: 'bold', color: '#ffa726' },
        }),
        this.tabIndicatorText,
        new xb.UIPanel({
          style: {
            width: '100%',
            flexDirection: 'row',
            gap: 6,
            marginTop: 4,
          },
          children: [
            new xb.UIButton({
              label: '👥 Buyers',
              style: { flexGrow: 1, height: 34 },
              onClick: () => this.switchTab('buyers'),
            }),
            new xb.UIButton({
              label: '📊 Analytics',
              style: { flexGrow: 1, height: 34 },
              onClick: () => this.switchTab('analytics'),
            }),
            new xb.UIButton({
              label: '💻 PC OS Apps',
              style: { flexGrow: 1, height: 34 },
              onClick: () => this.switchTab('admin_pc'),
            }),
          ],
        }),
      ],
    });

    this.contentPanel = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
      },
      children: this.buildBuyersTab(),
    });

    const scrollContainer = new xb.UIScrollView({
      style: {
        width: '100%',
        height: 250,
        backgroundColor: 'rgba(30, 18, 5, 0.65)',
        borderRadius: 10,
        padding: 8,
      },
      children: [this.contentPanel],
    });

    const footer = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
      },
      children: [
        new xb.UIButton({
          label: '📥 Export Cross-Platform Bundle',
          icon: 'download',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.exportDesktopBundle(),
        }),
        new xb.UIButton({
          label: '🛡️ Audit Admin RBAC',
          icon: 'admin_panel_settings',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.auditAdminSecurity(),
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
        backgroundColor: 'rgba(38, 20, 6, 0.88)',
        borderColor: '#fb8c00',
        borderWidth: 1,
        borderRadius: 14,
      },
      children: [header, scrollContainer, footer],
    });

    this.card.name = 'AnalyticsBuyerAdminCard';
    this.card.position.set(1.42, 1.42, -0.72);
    this.card.rotation.y = -0.52;
  }

  private switchTab(tab: 'buyers' | 'analytics' | 'admin_pc') {
    this.currentTab = tab;
    AiService.playHoloTone('beep');
    while (this.contentPanel.children.length > 0) {
      this.contentPanel.remove(this.contentPanel.children[0]);
    }

    if (tab === 'buyers') {
      this.tabIndicatorText.text = 'VIEW: 👥 BUYER CONSOLIDATION';
      this.tabIndicatorText.style.color = '#ffb74d';
      for (const item of this.buildBuyersTab()) {
        this.contentPanel.add(item);
      }
    } else if (tab === 'analytics') {
      this.tabIndicatorText.text = 'VIEW: 📊 REPORTING & WIP EFFICIENCY';
      this.tabIndicatorText.style.color = '#69f0ae';
      for (const item of this.buildAnalyticsTab()) {
        this.contentPanel.add(item);
      }
    } else {
      this.tabIndicatorText.text = 'VIEW: 💻 PC OS CROSS-PLATFORM APPS';
      this.tabIndicatorText.style.color = '#80d8ff';
      for (const item of this.buildAdminPcTab()) {
        this.contentPanel.add(item);
      }
    }
  }

  private buildBuyersTab(): xb.UIPanel[] {
    return this.buyers.map((b) => {
      return new xb.UIPanel({
        style: {
          width: '100%',
          flexDirection: 'column',
          gap: 4,
          padding: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ffa726',
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
                text: b.buyerName,
                style: { fontSize: 14, fontWeight: 'bold', color: '#ffffff' },
              }),
              new xb.UIText({
                text: `On-Time: ${b.onTimeDeliveryRate}%`,
                style: { fontSize: 12, fontWeight: 'bold', color: '#69f0ae' },
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
                text: `Active Orders: ${b.activeOrdersCount} (${b.totalGarments.toLocaleString()} pcs)`,
                style: { fontSize: 11, color: '#ffe082' },
              }),
              new xb.UIText({
                text: `QA Pass: ${b.qualityPassRate}%`,
                style: { fontSize: 11, color: '#80cbc4' },
              }),
            ],
          }),
          new xb.UIText({
            text: `Sub-Factory Hub: ${b.primarySubFactory}`,
            style: { fontSize: 11, color: '#b0bec5' },
          }),
          new xb.UIText({
            text: `Milestone: ${b.nextMilestone}`,
            style: { fontSize: 11, color: '#ffcc80' },
          }),
        ],
      });
    });
  }

  private buildAnalyticsTab(): xb.UIPanel[] {
    const kpis = [
      { label: 'Overall Wash Floor Efficiency', value: '94.6%', color: '#69f0ae' },
      { label: 'Sub-Factory Transit Delay Index', value: '0.4%', color: '#64ffda' },
      { label: 'WIP Re-wash / Defect Rate', value: '1.2%', color: '#ffd54f' },
      { label: 'Effluent & Water Recycling Ratio', value: '78.4%', color: '#40c4ff' },
      { label: 'Total Volume Under Process (WIP)', value: '518,000 pcs', color: '#e040fb' },
    ];

    return kpis.map(
      (k) =>
        new xb.UIPanel({
          style: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 8,
          },
          children: [
            new xb.UIText({
              text: k.label,
              style: { fontSize: 12, color: '#ffffff' },
            }),
            new xb.UIText({
              text: k.value,
              style: { fontSize: 13, fontWeight: 'bold', color: k.color },
            }),
          ],
        })
    );
  }

  private buildAdminPcTab(): xb.UIPanel[] {
    const panels: xb.UIPanel[] = PLATFORM_SPECS.map(
      (p) =>
        new xb.UIPanel({
          style: {
            width: '100%',
            flexDirection: 'column',
            gap: 4,
            padding: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#00e5ff',
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
                  text: p.os,
                  style: { fontSize: 13, fontWeight: 'bold', color: '#ffffff' },
                }),
                new xb.UIText({
                  text: p.format,
                  style: { fontSize: 11, fontWeight: 'bold', color: '#80d8ff' },
                }),
              ],
            }),
            new xb.UIText({
              text: `Arch: ${p.architecture}`,
              style: { fontSize: 11, color: '#b0bec5' },
            }),
            new xb.UIText({
              text: `Privacy: ${p.sandboxMode}`,
              style: { fontSize: 11, color: '#a7ffeb' },
            }),
          ],
        })
    );

    // Add Admin RBAC info panel
    panels.push(
      new xb.UIPanel({
        style: {
          width: '100%',
          flexDirection: 'column',
          gap: 2,
          padding: 8,
          backgroundColor: 'rgba(0, 229, 255, 0.08)',
          borderRadius: 8,
        },
        children: [
          new xb.UIText({
            text: '🔐 ROLE ACCESS (RBAC) & LOCAL VAULT',
            style: { fontSize: 12, fontWeight: 'bold', color: '#00e5ff' },
          }),
          new xb.UIText({
            text: 'SuperAdmin: active | ProductionGM: active | QA Lead: active | SubFactory Auditor: read-only | Encryption: AES-256 GCM Local In-Memory',
            style: { fontSize: 11, color: '#e0f7fa' },
          }),
        ],
      })
    );

    return panels;
  }

  private exportDesktopBundle() {
    AiService.playHoloTone('confirm');
    // Generate browser download of the standalone cross-platform deployment descriptor
    const bundleData = {
      app: 'INCTL Cybernetic Sentinel ERP Workstation',
      version: '4.8.0-PC-PROD',
      timestamp: new Date().toISOString(),
      platforms: {
        windows: {
          target: 'win32-x64',
          executable: 'INCTL-Sentinel-Setup.exe',
          installer: 'NSIS x64 silent enterprise',
          offlineCapabilities: '100% Standalone SQLite + Local Model IPC',
        },
        macos: {
          target: 'darwin-universal',
          executable: 'INCTL-Sentinel.dmg',
          signatures: 'Apple Developer ID + Hardened Runtime',
          offlineCapabilities: '100% Standalone SQLite + Local Model IPC',
        },
        linux: {
          target: 'linux-x86_64',
          executable: 'INCTL-Sentinel.AppImage',
          packaging: ['AppImage', 'deb', 'rpm'],
          offlineCapabilities: '100% Standalone SQLite + Local Model IPC',
        },
      },
      privacyCompliance: {
        zeroTelemetry: true,
        offlineFirst: true,
        localSandboxEncryption: 'AES-256-GCM',
        webScrapingSandbox: 'Ephemeral Chromium headless bridge with memory discard',
      },
    };

    const blob = new Blob([JSON.stringify(bundleData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inctl-sentinel-pc-deployment-manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  private auditAdminSecurity() {
    AiService.playHoloTone('scan');
  }
}
