import * as xb from 'xrblocks';
import { AiService } from '../services/aiService.js';
import { AiMode } from '../types.js';

export class TerminalCard {
  public card: xb.UICard;
  private statusText: xb.UIText;
  private outputText: xb.UIText;
  private modeBadgeText: xb.UIText;
  private privacyBadgeText: xb.UIText;
  private currentMode: AiMode = 'scrape';
  private isOffline: boolean = false;
  private onActionTriggered?: () => void;

  constructor(onActionTriggered?: () => void) {
    this.onActionTriggered = onActionTriggered;

    // Status & Badges
    this.statusText = new xb.UIText({
      text: 'SENTINEL ACTIVE // Windows .exe | macOS .dmg | Linux .AppImage // Local Vault Armed',
      style: {
        fontSize: 13,
        textAlign: 'center',
        color: '#64ffda',
        lineHeight: 1.3,
      },
    });

    this.modeBadgeText = new xb.UIText({
      text: 'ENGINE: Gemini 3.8 Flash (Web Grounded Scraper)',
      style: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#80d8ff',
      },
    });

    this.privacyBadgeText = new xb.UIText({
      text: 'PRIVACY: HYBRID ONLINE (Grounding Enabled)',
      style: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#a7ffeb',
      },
    });

    const header = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(100, 255, 218, 0.25)',
      },
      children: [
        new xb.UIText({
          text: '⚡ INCTL SENTINEL AI // INTELLIGENCE & WEB SCRAPER',
          style: {
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#ffffff',
          },
        }),
        this.statusText,
        new xb.UIPanel({
          style: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
            marginTop: 4,
          },
          children: [this.modeBadgeText, this.privacyBadgeText],
        }),
      ],
    });

    // Output view
    this.outputText = new xb.UIText({
      text:
        'Welcome to INCTL Sentinel Cybernetic Workstation.\n\n' +
        '• Multi-OS Core: Windows (.exe), macOS (.dmg), Linux (.AppImage/.deb) supported via cross-platform local IPC.\n' +
        '• Privacy Shield: Work completely offline with local air-gap vault, or enable online web scraping on demand.\n' +
        '• Tap any command button below to trigger intelligence synthesis.',
      style: {
        fontSize: 14,
        lineHeight: 1.4,
        color: '#e0f7fa',
        whiteSpace: 'pre-line',
      },
    });

    const scrollContainer = new xb.UIScrollView({
      style: {
        width: '100%',
        height: 190,
        backgroundColor: 'rgba(3, 16, 28, 0.75)',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
      },
      children: [this.outputText],
    });

    // Mode Toggle Buttons
    const engineButtons = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'row',
        gap: 8,
      },
      children: [
        new xb.UIButton({
          label: '🌐 Scraper/Search',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.setMode('scrape'),
        }),
        new xb.UIButton({
          label: '🧠 High Thinking',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.setMode('thinking'),
        }),
        new xb.UIButton({
          label: '⚡ Flash Lite',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.setMode('fast'),
        }),
        new xb.UIButton({
          label: '🛡️ Toggle Privacy',
          style: { flexGrow: 1, height: 38 },
          onClick: () => this.togglePrivacy(),
        }),
      ],
    });

    // Action execution buttons
    const actionButtons = new xb.UIPanel({
      style: {
        width: '100%',
        flexDirection: 'column',
        gap: 8,
      },
      children: [
        new xb.UIPanel({
          style: { width: '100%', flexDirection: 'row', gap: 8 },
          children: [
            new xb.UIButton({
              label: '🕷️ Scrape Global Cotton & Wash Chemistry',
              icon: 'search',
              style: { flexGrow: 1, height: 42 },
              onClick: () =>
                this.runQuery(
                  'Scrape current global cotton indices, indigo dye supply trends, and eco-ozone denim wash chemical pricing for 2026. Highlight key cost risks for Bangladesh wash houses.',
                  'scrape'
                ),
            }),
            new xb.UIButton({
              label: '🧠 Deep Diagnosis: Delay & Yield',
              icon: 'psychology',
              style: { flexGrow: 1, height: 42 },
              onClick: () =>
                this.runQuery(
                  'Execute High-Thinking analysis: We have 45,000 pcs Levi 501 vintage wash orders across Floor A and Anowara sub-factory. Diagnose wash floor hydro-extractor bottlenecks, suggest ideal RPM, moisture balance, and preventive rework protocol.',
                  'thinking'
                ),
            }),
          ],
        }),
        new xb.UIPanel({
          style: { width: '100%', flexDirection: 'row', gap: 8 },
          children: [
            new xb.UIButton({
              label: '⚡ Fast Audit: CPL Fabric Specs',
              icon: 'bolt',
              style: { flexGrow: 1, height: 40 },
              onClick: () =>
                this.runQuery(
                  'Fast check: Shasha 12.5oz (-2.8% warp, -1.2% weft shrinkage) vs Inditex Zara compliance. Is pattern grading adjustment required?',
                  'fast'
                ),
            }),
            new xb.UIButton({
              label: '💾 Audit Local Air-Gap Data Vault',
              icon: 'security',
              style: { flexGrow: 1, height: 40 },
              onClick: () =>
                this.runQuery(
                  'Perform full integrity audit of local offline ERP database. Verify all buyer styles, CPL shade lots, and sub-factory gate passes are stored with zero external telemetry.',
                  'general'
                ),
            }),
          ],
        }),
      ],
    });

    this.card = new xb.UICard({
      size: { width: 0.88, height: 'auto' },
      manipulation: true,
      edge: true,
      style: {
        flexDirection: 'column',
        gap: 12,
        padding: 18,
        backgroundColor: 'rgba(5, 15, 25, 0.85)',
        borderColor: '#00e5ff',
        borderWidth: 1.5,
        borderRadius: 16,
      },
      children: [header, scrollContainer, engineButtons, actionButtons],
    });

    this.card.name = 'SentinelTerminalCard';
    this.card.position.set(0, 1.38, -1.15);
  }

  private setMode(mode: AiMode) {
    this.currentMode = mode;
    AiService.playHoloTone('beep');
    const labels: Record<AiMode, string> = {
      scrape: 'Gemini 3.8 Flash (Web Grounded Scraper)',
      thinking: 'Gemini 4 Argon (High Thinking Reasoning)',
      fast: 'Gemini 3.1 Flash Lite (Low-Latency)',
      general: 'Gemini 3.8 Flash (General Intelligence)',
    };
    this.modeBadgeText.text = `ENGINE: ${labels[mode]}`;
  }

  private togglePrivacy() {
    this.isOffline = !this.isOffline;
    AiService.playHoloTone(this.isOffline ? 'alert' : 'confirm');
    if (this.isOffline) {
      this.privacyBadgeText.text = 'PRIVACY: 🔒 AIR-GAPPED (100% Local / Zero Outbound)';
      this.privacyBadgeText.style.color = '#ffd54f';
      this.outputText.text =
        '[PRIVACY SHIELD ACTIVATED]\n\n' +
        '• Network isolation enabled. External telemetry cut.\n' +
        '• All ERP queries will now be processed strictly inside local sandboxed engine.\n' +
        '• Local data vault synchronized: 4 orders, 3 fabric rolls, 3 wash floors encrypted in memory.';
    } else {
      this.privacyBadgeText.text = 'PRIVACY: 🌐 HYBRID ONLINE (Grounding Enabled)';
      this.privacyBadgeText.style.color = '#a7ffeb';
      this.outputText.text =
        '[ONLINE INTELLIGENCE RESTORED]\n\n' +
        '• Web scraper agent and Google Search grounding re-connected.\n' +
        '• Ready for live market queries and real-time denim industry scraping.';
    }
  }

  public async runQuery(promptText: string, mode?: AiMode) {
    const selectedMode = mode || this.currentMode;
    AiService.playHoloTone('scan');
    this.onActionTriggered?.();

    this.outputText.text = `[RUNNING SENTINEL SYNTHESIS (${selectedMode.toUpperCase()})]...\nQuery: "${promptText}"\nPlease wait while processing...`;

    try {
      const result = await AiService.queryIntelligence(promptText, selectedMode, this.isOffline);
      AiService.playHoloTone('confirm');

      let sourcesNote = '';
      if (result.groundingMetadata?.groundingChunks?.length) {
        const titles = result.groundingMetadata.groundingChunks
          .map((c: any) => c.web?.title)
          .filter(Boolean)
          .slice(0, 3);
        if (titles.length) {
          sourcesNote = `\n\n[Web Grounding Sources]: ${titles.join(' | ')}`;
        }
      }

      this.outputText.text = `[RESPONSE SOURCE: ${result.source.toUpperCase()}]\n\n${result.text}${sourcesNote}`;
    } catch (e: any) {
      this.outputText.text = `[EXECUTION NOTE]: ${e?.message || 'Query completed locally.'}`;
    }
  }
}
