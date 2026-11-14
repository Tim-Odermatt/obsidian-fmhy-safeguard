var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => FMHYSafeGuardPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_view = require("@codemirror/view");
var import_state = require("@codemirror/state");
var DEFAULT_SETTINGS = {
  updateInterval: 24,
  showUnknown: true,
  showFMHY: true
};
var RAW = "https://raw.githubusercontent.com/";
var SOURCES = {
  unsafe: RAW + "fmhy/FMHYFilterlist/refs/heads/main/sitelist.txt",
  potential: RAW + "fmhy/FMHYFilterlist/refs/heads/main/sitelist-plus.txt",
  related: RAW + "fmhy/FMHY-SafeGuard/refs/heads/main/fmhy-filterlist.txt",
  safeDocs: [
    "privacy",
    "ai",
    "mobile",
    "audio",
    "developer-tools",
    "downloading",
    "educational",
    "file-tools",
    "gaming-tools",
    "gaming",
    "image-tools",
    "internet-tools",
    "linux-macos",
    "misc",
    "non-english",
    "reading",
    "social-media-tools",
    "storage",
    "system-tools",
    "text-tools",
    "torrenting",
    "video-tools",
    "video"
  ].map(
    (name) => RAW + `fmhy/edit/refs/heads/main/docs/${name}.md`
  )
};
var LABELS = {
  unsafe: "Unsafe",
  potentially_unsafe: "Potentially unsafe",
  safe: "Safe",
  starred: "Starred",
  fmhy: "FMHY related",
  unknown: "Not in Wiki"
};
function normalizeDomain(value) {
  return value.toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
}
function parseFilterList(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("!")).map((line) => {
    try {
      return new URL(
        /^https?:\/\//i.test(line) ? line : `https://${line}`
      ).hostname;
    } catch {
      return "";
    }
  }).filter(Boolean).map(normalizeDomain);
}
function extractMarkdownUrls(text) {
  const matches = text.match(
    /https?:\/\/[^\s<>()\]]+/gi
  ) || [];
  return [...new Set(matches.map((value) => {
    try {
      return new URL(value.replace(/[),.;]+$/, "")).href;
    } catch {
      return "";
    }
  }).filter(Boolean))];
}
function isStarredLine(line) {
  return /🌟|⭐|★|:star:|starred/i.test(line);
}
function domainMatches(host, list) {
  return list.some(
    (domain) => host === domain || host.endsWith("." + domain)
  );
}
function resourceMatches(url, resources) {
  let current;
  try {
    current = new URL(url);
  } catch {
    return false;
  }
  const sharedHosts = [
    "github.com",
    "gist.github.com",
    "gitlab.com",
    "codeberg.org",
    "youtube.com",
    "archive.org",
    "greasyfork.org",
    "rentry.co",
    "rentry.org",
    "pastebin.com",
    "discord.com",
    "mega.nz",
    "huggingface.co"
  ];
  const shared = sharedHosts.some(
    (host) => current.hostname === host || current.hostname.endsWith("." + host)
  );
  return resources.some((resource) => {
    try {
      const listed = new URL(resource);
      const host = normalizeDomain(current.hostname);
      const listedHost = normalizeDomain(listed.hostname);
      if (shared) {
        if (host !== listedHost) return false;
      } else if (host !== listedHost && !host.endsWith("." + listedHost)) {
        return false;
      }
      const currentPath = current.pathname.replace(/\/+$/, "").toLowerCase();
      const listedPath = listed.pathname.replace(/\/+$/, "").toLowerCase();
      return currentPath === listedPath || currentPath.startsWith(listedPath + "/");
    } catch {
      return false;
    }
  });
}
function classify(url, data) {
  let host;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "unknown";
    }
    host = normalizeDomain(parsed.hostname);
  } catch {
    return "unknown";
  }
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
var StatusWidget = class _StatusWidget extends import_view.WidgetType {
  constructor(status, url) {
    super();
    this.status = status;
    this.url = url;
  }
  toDOM() {
    const element = document.createElement("span");
    element.className = `fmhy-status-widget fmhy-${this.status}`;
    element.setAttribute("aria-label", LABELS[this.status]);
    element.setAttribute("title", `${LABELS[this.status]} \u2014 ${this.url}`);
    element.setAttribute("contenteditable", "false");
    return element;
  }
  eq(other) {
    return other instanceof _StatusWidget && this.status === other.status && this.url === other.url;
  }
  ignoreEvent() {
    return true;
  }
};
var FMHYSafeGuardPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    this.data = {
      unsafe: [],
      potentiallyUnsafe: [],
      safe: [],
      starred: [],
      related: [],
      updated: 0
    };
    this.refreshing = false;
    this.readingViewProcessor = (element) => {
      const links = element.querySelectorAll(
        "a.external-link, a[href^='http://'], a[href^='https://']"
      );
      links.forEach((link) => {
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
        link.classList.add(`fmhy-${status}`);
        link.dataset.fmhyStatus = status;
        link.setAttribute("aria-label", `${LABELS[status]}: ${link.href}`);
        link.setAttribute("title", `${LABELS[status]} \u2014 ${link.href}`);
      });
    };
  }
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
    if (!this.data.updated || Date.now() - this.data.updated > this.settings.updateInterval * 36e5) {
      void this.refreshLists();
    }
    this.registerInterval(
      window.setInterval(
        () => void this.refreshLists(),
        this.settings.updateInterval * 36e5
      )
    );
  }
  async loadSettings() {
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...await this.loadData()
    };
  }
  async loadCache() {
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
  async saveCache() {
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
    new import_obsidian.Notice("FMHY cache cleared.");
  }
  async refreshLists() {
    if (this.refreshing) return;
    this.refreshing = true;
    try {
      new import_obsidian.Notice("Updating FMHY SafeGuard lists...");
      const [unsafeText, potentialText, relatedText, ...docs] = await Promise.all([
        this.fetchText(SOURCES.unsafe),
        this.fetchText(SOURCES.potential),
        this.fetchText(SOURCES.related),
        ...SOURCES.safeDocs.map((url) => this.fetchText(url))
      ]);
      const safe = [];
      const starred = [];
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
        related: relatedText.split(/\s+/).filter((item) => item && !item.startsWith("!")).map((item) => {
          try {
            return new URL(
              /^https?:\/\//i.test(item) ? item : `https://${item}`
            ).href;
          } catch {
            return "";
          }
        }).filter(Boolean),
        safe: [...new Set(safe)],
        starred: [...new Set(starred)],
        updated: Date.now()
      };
      await this.saveCache();
      this.app.workspace.updateOptions();
      this.app.workspace.trigger("fmhy-status-updated");
      new import_obsidian.Notice(
        `FMHY lists updated. ${this.data.unsafe.length} unsafe entries loaded.`
      );
    } catch (error) {
      console.error("FMHY SafeGuard update failed:", error);
      new import_obsidian.Notice(
        "FMHY update failed. Retaining cached data."
      );
    } finally {
      this.refreshing = false;
    }
  }
  async fetchText(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${url}`
      );
    }
    return response.text();
  }
  getStatus(url) {
    return classify(url, this.data);
  }
  shouldDisplay(status) {
    if (status === "unknown") {
      return this.settings.showUnknown;
    }
    if (status === "fmhy") {
      return this.settings.showFMHY;
    }
    return true;
  }
  createEditorExtension() {
    const plugin = this;
    return import_view.ViewPlugin.fromClass(
      class {
        constructor(view) {
          this.decorations = this.build(view);
        }
        update(update) {
          if (update.docChanged || update.viewportChanged || update.selectionSet) {
            this.decorations = this.build(update.view);
          }
        }
        build(view) {
          if (!view.state.field(import_obsidian.editorLivePreviewField, false)) {
            return import_view.Decoration.none;
          }
          const builder = new import_state.RangeSetBuilder();
          const widgets = [];
          for (const { from, to } of view.visibleRanges) {
            const text = view.state.doc.sliceString(from, to);
            const markdownRanges = [];
            const markdownRegex = /\[((?:\\.|[^\]\\])*)\]\(\s*<?(https?:\/\/[^\s)>]+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/gi;
            let match;
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
              this.addStatusWidget(widgets, linkTo, url, plugin);
            }
            const urlRegex = /https?:\/\/[^\s<>"')\]]+/gi;
            while ((match = urlRegex.exec(text)) !== null) {
              const url = match[0].replace(/[.,;!?]+$/, "");
              const urlFrom = from + match.index;
              const urlTo = urlFrom + url.length;
              const insideMarkdownLink = markdownRanges.some(
                (range) => urlFrom >= range.from && urlTo <= range.to
              );
              if (!insideMarkdownLink) {
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
        addStatusWidget(widgets, pos, url, pluginInstance) {
          const status = pluginInstance.getStatus(url);
          if (!pluginInstance.shouldDisplay(status)) {
            return;
          }
          widgets.push({
            pos,
            decoration: import_view.Decoration.widget({
              widget: new StatusWidget(status, url),
              side: 1
            })
          });
        }
      },
      {
        decorations: (value) => value.decorations
      }
    );
  }
  registerSvgVariables() {
    const root = document.documentElement;
    const icons = {
      safe: "safe-link.svg",
      unsafe: "unsafe-link.svg",
      warning: "warning-link.svg",
      starred: "starred-link.svg",
      fmhy: "fmhy-link.svg",
      external: "external-link.svg"
    };
    for (const [name, filename] of Object.entries(icons)) {
      const path = this.app.vault.adapter.getResourcePath(
        `${this.manifest.dir}/svg/${filename}`
      );
      root.style.setProperty(
        `--fmhy-${name}-icon`,
        `url("${path}")`
      );
    }
  }
  onunload() {
  }
};
var FMHYSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", {
      text: "FMHY SafeGuard"
    });
    new import_obsidian.Setting(containerEl).setName("Update interval").setDesc("How often to download updated FMHY lists.").addDropdown(
      (dropdown) => dropdown.addOption("6", "Every 6 hours").addOption("12", "Every 12 hours").addOption("24", "Every 24 hours").addOption("48", "Every 48 hours").addOption("168", "Weekly").setValue(
        String(this.plugin.settings.updateInterval)
      ).onChange(async (value) => {
        this.plugin.settings.updateInterval = Number(value);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Show unknown links").setDesc("Show a grey question mark for unlisted websites.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showUnknown).onChange(async (value) => {
        this.plugin.settings.showUnknown = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Show FMHY-related links").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showFMHY).onChange(async (value) => {
        this.plugin.settings.showFMHY = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Refresh filterlists").setDesc(
      "Download the latest FMHY data immediately."
    ).addButton(
      (button) => button.setButtonText("Refresh now").onClick(
        () => this.plugin.refreshLists()
      )
    );
    new import_obsidian.Setting(containerEl).setName("Last update").setDesc(
      this.plugin.data.updated ? new Date(
        this.plugin.data.updated
      ).toLocaleString() : "No successful update yet."
    );
  }
};
