import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  Notice,
  MarkdownPostProcessor,
  editorLivePreviewField
} from "obsidian";

import {
  EditorView,
  ViewPlugin,
  ViewUpdate,
  Decoration,
  DecorationSet,
  WidgetType
} from "@codemirror/view";

import {
  RangeSetBuilder
} from "@codemirror/state";

import safeSvg from "../svg/safe-link.svg";
import unsafeSvg from "../svg/unsafe-link.svg";
import warningSvg from "../svg/warning-link.svg";
import starredSvg from "../svg/starred-link.svg";
import fmhySvg from "../svg/fmhy-link.svg";
import externalSvg from "../svg/external-link.svg";

type Status =
  | "unsafe"
  | "potentially_unsafe"
  | "safe"
  | "starred"
  | "fmhy"
  | "unknown";

interface FMHYData {
  unsafe: string[];
  potentiallyUnsafe: string[];
  safe: string[];
  starred: string[];
  related: string[];
  updated: number;
}

interface Settings {
  updateInterval: number;
  showUnknown: boolean;
  showFMHY: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  updateInterval: 24,
  showUnknown: true,
  showFMHY: true
};

const RAW =
  "https://raw.githubusercontent.com/";

const SOURCES = {
  unsafe: RAW + "fmhy/FMHYFilterlist/refs/heads/main/sitelist.txt",
  potential: RAW + "fmhy/FMHYFilterlist/refs/heads/main/sitelist-plus.txt",
  related: RAW + "fmhy/FMHY-SafeGuard/refs/heads/main/fmhy-filterlist.txt",
  safeDocs: [
    "privacy", "ai", "mobile", "audio", "developer-tools",
    "downloading", "educational", "file-tools", "gaming-tools",
    "gaming", "image-tools", "internet-tools", "linux-macos",
    "misc", "non-english", "reading", "social-media-tools",
    "storage", "system-tools", "text-tools", "torrenting",
    "video-tools", "video"
  ].map(
    name => RAW +
      `fmhy/edit/refs/heads/main/docs/${name}.md`
  )
};

const LABELS: Record<Status, string> = {
  unsafe: "Unsafe",
  potentially_unsafe: "Potentially unsafe",
  safe: "Safe",
  starred: "Starred",
  fmhy: "FMHY related",
  unknown: "Not in Wiki"
};

function normalizeDomain(value: string): string {
  return value.toLowerCase()
    .replace(/^www\./, "")
    .replace(/\.$/, "");
}

function parseFilterList(text: string): string[] {
  return text.split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("!"))
    .map(line => {
      try {
        return new URL(
          /^https?:\/\//i.test(line)
            ? line
            : `https://${line}`
        ).hostname;
      } catch {
        return "";
      }
    })
    .filter(Boolean)
    .map(normalizeDomain);
}

function extractMarkdownUrls(text: string): string[] {
  const matches = text.match(
    /https?:\/\/[^\s<>()\]]+/gi
  ) || [];

  return [...new Set(matches.map(value => {
    try {
      return new URL(value.replace(/[),.;]+$/, "")).href;
    } catch {
      return "";
    }
  }).filter(Boolean))];
}

function isStarredLine(line: string): boolean {
  return /🌟|⭐|★|:star:|starred/i.test(line);
}

function domainMatches(host: string, list: string[]): boolean {
  return list.some(domain =>
    host === domain || host.endsWith("." + domain)
  );
}

function resourceMatches(
  url: string,
  resources: string[]
): boolean {
  let current: URL;

  try {
    current = new URL(url);
  } catch {
    return false;
  }

  const sharedHosts = [
    "github.com", "gist.github.com",
    "gitlab.com", "codeberg.org",
    "youtube.com", "archive.org",
    "greasyfork.org", "rentry.co",
    "rentry.org", "pastebin.com",
    "discord.com", "mega.nz",
    "huggingface.co"
  ];

  const shared = sharedHosts.some(host =>
    current.hostname === host ||
    current.hostname.endsWith("." + host)
  );

  return resources.some(resource => {
    try {
      const listed = new URL(resource);
      const host = normalizeDomain(current.hostname);
      const listedHost = normalizeDomain(listed.hostname);

      if (shared) {
        if (host !== listedHost) return false;
      } else if (
        host !== listedHost &&
        !host.endsWith("." + listedHost)
      ) {
        return false;
      }

      const currentPath =
        current.pathname.replace(/\/+$/, "").toLowerCase();

      const listedPath =
        listed.pathname.replace(/\/+$/, "").toLowerCase();

      return (
        currentPath === listedPath ||
        currentPath.startsWith(listedPath + "/")
      );
    } catch {
      return false;
    }
  });
}

function classify(url: string, data: FMHYData): Status {
  let host: string;

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "unknown";
    }

    host = normalizeDomain(parsed.hostname);
  } catch {
    return "unknown";
  }

  // Match precedence used by FMHY SafeGuard.
  if (domainMatches(host, data.unsafe)) {
    return "unsafe";
  }

  if (domainMatches(host, data.potentiallyUnsafe)) {
    return "potentially_unsafe";
  }

  if (resourceMatches(url, data.related)) {
    return "fmhy";
  }

  if (resourceMatches(url, data.starred)) {
    return "starred";
  }

  if (resourceMatches(url, data.safe)) {
    return "safe";
  }

  return "unknown";
}

class StatusWidget extends WidgetType {
  constructor(
    readonly status: Status,
    readonly url: string
  ) {
    super();
  }

  toDOM(): HTMLElement {
    const element = document.createElement("span");
    element.className = `fmhy-status-widget fmhy-${this.status}`;
    element.setAttribute("aria-label", LABELS[this.status]);
    element.setAttribute("title", `${LABELS[this.status]} — ${this.url}`);
    element.setAttribute("contenteditable", "false");
    return element;
  }

  eq(other: WidgetType): boolean {
    return other instanceof StatusWidget &&
      this.status === other.status &&
      this.url === other.url;
  }

  ignoreEvent(): boolean {
    return true;
  }
}

export default class FMHYSafeGuardPlugin extends Plugin {
  settings: Settings = DEFAULT_SETTINGS;

  data: FMHYData = {
    unsafe: [],
    potentiallyUnsafe: [],
    safe: [],
    starred: [],
    related: [],
    updated: 0
  };

  private refreshing = false;

  async onload() {
    this.registerSvgVariables();

    await this.loadSettings();
    await this.loadCache();

    this.registerMarkdownPostProcessor(
      this.readingViewProcessor
    );

  this.registerEditorExtension(
    this.createEditorExtension()
  );

    this.addSettingTab(
      new FMHYSettingsTab(this.app, this)
    );

    this.addCommand({
      id: "refresh-fmhy-lists",
      name: "Refresh FMHY filterlists",
      callback: () => this.refreshLists()
    });

    this.addCommand({
      id: "clear-fmhy-cache",
      name: "Clear FMHY cache",
      callback: async () => {
        await this.clearCache();
        await this.refreshLists();
      }
    });

    if (
      !this.data.updated ||
      Date.now() - this.data.updated >
        this.settings.updateInterval * 3600000
    ) {
      void this.refreshLists();
    }

    this.registerInterval(
      window.setInterval(
        () => void this.refreshLists(),
        this.settings.updateInterval * 3600000
      )
    );
  }

  async loadSettings() {
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...await this.loadData()
    };
  }

    private async loadCache() {
    const saved = await this.loadData();

        if (saved?.filterData) {
            this.data = {
            ...this.data,
            ...saved.filterData
            };
        }
    }

    async saveSettings() {
    const existing = await this.loadData() || {};

    await this.saveData({
        ...existing,
        ...this.settings,
        filterData: this.data
    });
    }

  private async saveCache() {
    const settingsData = {
      ...this.settings,
      filterData: this.data
    };

    await this.saveData(settingsData);
  }

  async clearCache() {
    this.data = {
      unsafe: [],
      potentiallyUnsafe: [],
      safe: [],
      starred: [],
      related: [],
      updated: 0
    };

    await this.saveCache();
    new Notice("FMHY cache cleared.");
  }

  async refreshLists() {
    if (this.refreshing) return;

    this.refreshing = true;

    try {
      new Notice("Updating FMHY SafeGuard lists...");

      const [unsafeText, potentialText, relatedText, ...docs] =
        await Promise.all([
          this.fetchText(SOURCES.unsafe),
          this.fetchText(SOURCES.potential),
          this.fetchText(SOURCES.related),
          ...SOURCES.safeDocs.map(url => this.fetchText(url))
        ]);

      const safe: string[] = [];
      const starred: string[] = [];

      for (const markdown of docs) {
        for (const url of extractMarkdownUrls(markdown)) {
          safe.push(url);
        }

        for (const line of markdown.split(/\r?\n/)) {
          if (isStarredLine(line)) {
            starred.push(...extractMarkdownUrls(line));
          }
        }
      }

      this.data = {
        unsafe: parseFilterList(unsafeText),
        potentiallyUnsafe: parseFilterList(potentialText),
        related: relatedText
        .split(/\s+/)
        .filter(item => item && !item.startsWith("!"))
        .map(item => {
            try {
            return new URL(
                /^https?:\/\//i.test(item)
                ? item
                : `https://${item}`
            ).href;
            } catch {
            return "";
            }
        })
        .filter(Boolean),
        safe: [...new Set(safe)],
        starred: [...new Set(starred)],
        updated: Date.now()
      };

      await this.saveCache();

      this.app.workspace.updateOptions();
      this.app.workspace.trigger("fmhy-status-updated");

      new Notice(
        `FMHY lists updated. ${this.data.unsafe.length} unsafe entries loaded.`
      );
    } catch (error) {
      console.error("FMHY SafeGuard update failed:", error);

      new Notice(
        "FMHY update failed. Retaining cached data."
      );
    } finally {
      this.refreshing = false;
    }
  }

  private async fetchText(url: string): Promise<string> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${url}`
      );
    }

    return response.text();
  }

  getStatus(url: string): Status {
    return classify(url, this.data);
  }

  private shouldDisplay(status: Status): boolean {
    if (status === "unknown") {
      return this.settings.showUnknown;
    }

    if (status === "fmhy") {
      return this.settings.showFMHY;
    }

    return true;
  }

  private readingViewProcessor: MarkdownPostProcessor = (element) => {
    const links = element.querySelectorAll<HTMLAnchorElement>(
      "a.external-link, a[href^='http://'], a[href^='https://']"
    );

    links.forEach(link => {
      const status = this.getStatus(link.href);

      link.classList.remove(
        "fmhy-unsafe",
        "fmhy-potentially_unsafe",
        "fmhy-safe",
        "fmhy-starred",
        "fmhy-fmhy",
        "fmhy-unknown"
      );

      if (!this.shouldDisplay(status)) {
        link.removeAttribute("data-fmhy-status");
        return;
      }

      // CSS renders the status using the existing external-link pseudo-element.
      link.classList.add(`fmhy-${status}`);
      link.dataset.fmhyStatus = status;
      link.setAttribute("aria-label", `${LABELS[status]}: ${link.href}`);
      link.setAttribute("title", `${LABELS[status]} — ${link.href}`);
    });
  };

  private createEditorExtension() {
    const plugin = this;

    return ViewPlugin.fromClass(
      class {
        decorations: DecorationSet;

        constructor(view: EditorView) {
          this.decorations = this.build(view);
        }

        update(update: ViewUpdate) {
          if (
            update.docChanged ||
            update.viewportChanged ||
            update.selectionSet
          ) {
            this.decorations = this.build(update.view);
          }
        }

        build(view: EditorView): DecorationSet {
          if (!view.state.field(editorLivePreviewField, false)) {
            return Decoration.none;
          }

          const builder = new RangeSetBuilder<Decoration>();
          const widgets: {
            pos: number;
            decoration: Decoration;
          }[] = [];

          for (const { from, to } of view.visibleRanges) {
            const text = view.state.doc.sliceString(from, to);
            const markdownRanges: { from: number; to: number }[] = [];

            const markdownRegex =
              /\[((?:\\.|[^\]\\])*)\]\(\s*<?(https?:\/\/[^\s)>]+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/gi;

            let match: RegExpExecArray | null;

            while ((match = markdownRegex.exec(text)) !== null) {
              if (match.index > 0 && text[match.index - 1] === "!") {
                continue;
              }

              const url = match[2].replace(/[.,;!?]+$/, "");
              const linkFrom = from + match.index;
              const linkTo = linkFrom + match[0].length;

              markdownRanges.push({
                from: linkFrom,
                to: linkTo
              });

              // Place the status widget after the complete Markdown link.
              this.addStatusWidget(widgets, linkTo, url, plugin);
            }

            const urlRegex = /https?:\/\/[^\s<>"')\]]+/gi;

            while ((match = urlRegex.exec(text)) !== null) {
              const url = match[0].replace(/[.,;!?]+$/, "");
              const urlFrom = from + match.index;
              const urlTo = urlFrom + url.length;

              const insideMarkdownLink = markdownRanges.some(
                range => urlFrom >= range.from && urlTo <= range.to
              );

              if (!insideMarkdownLink) {
                // Plain URLs get their status immediately after the URL.
                this.addStatusWidget(widgets, urlTo, url, plugin);
              }
            }
          }

          widgets.sort((a, b) => a.pos - b.pos);

          for (const item of widgets) {
            builder.add(item.pos, item.pos, item.decoration);
          }

          return builder.finish();
        }

        private addStatusWidget(
          widgets: { pos: number; decoration: Decoration }[],
          pos: number,
          url: string,
          pluginInstance: FMHYSafeGuardPlugin
        ) {
          const status = pluginInstance.getStatus(url);

          if (!pluginInstance.shouldDisplay(status)) {
            return;
          }

          widgets.push({
            pos,
            decoration: Decoration.widget({
              widget: new StatusWidget(status, url),
              side: 1
            })
          });
        }
      },
      {
        decorations: value => value.decorations
      }
    );
  }


  private registerSvgVariables(): void {
      const root = document.documentElement;

      const icons: Record<string, string> = {
          safe: safeSvg,
          unsafe: unsafeSvg,
          warning: warningSvg,
          starred: starredSvg,
          fmhy: fmhySvg,
          external: externalSvg
      };

      for (const [name, svg] of Object.entries(icons)) {
          const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

          root.style.setProperty(
              `--fmhy-${name}-icon`,
              `url("${encoded}")`
          );
      }
  }


  onunload() {
    // Obsidian automatically unregisters plugin extensions.
  }
}

class FMHYSettingsTab extends PluginSettingTab {
  plugin: FMHYSafeGuardPlugin;

  constructor(app: App, plugin: FMHYSafeGuardPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", {
      text: "FMHY SafeGuard"
    });

    new Setting(containerEl)
      .setName("Update interval")
      .setDesc("How often to download updated FMHY lists.")
      .addDropdown(dropdown =>
        dropdown
          .addOption("6", "Every 6 hours")
          .addOption("12", "Every 12 hours")
          .addOption("24", "Every 24 hours")
          .addOption("48", "Every 48 hours")
          .addOption("168", "Weekly")
          .setValue(
            String(this.plugin.settings.updateInterval)
          )
          .onChange(async value => {
            this.plugin.settings.updateInterval =
              Number(value);

            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Show unknown links")
      .setDesc("Show a grey question mark for unlisted websites.")
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.showUnknown)
          .onChange(async value => {
            this.plugin.settings.showUnknown = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Show FMHY-related links")
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.showFMHY)
          .onChange(async value => {
            this.plugin.settings.showFMHY = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Refresh filterlists")
      .setDesc(
        "Download the latest FMHY data immediately."
      )
      .addButton(button =>
        button
          .setButtonText("Refresh now")
          .onClick(() =>
            this.plugin.refreshLists()
          )
      );

    new Setting(containerEl)
      .setName("Last update")
      .setDesc(
        this.plugin.data.updated
          ? new Date(
              this.plugin.data.updated
            ).toLocaleString()
          : "No successful update yet."
      );
  }
}