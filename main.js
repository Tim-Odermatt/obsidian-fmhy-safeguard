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

// svg/safe-link.svg
var safe_link_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg\n   class="i-external"\n   viewBox="0 0 32 32"\n   width="14"\n   height="14"\n   fill="none"\n   stroke="#888888"\n   stroke-linecap="round"\n   stroke-linejoin="round"\n   stroke-width="9.38%"\n   version="1.1"\n   id="svg1"\n   sodipodi:docname="save-link.svg"\n   inkscape:version="1.4.4 (dcaf3e7, 2026-05-05)"\n   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"\n   xmlns="http://www.w3.org/2000/svg"\n   xmlns:svg="http://www.w3.org/2000/svg">\n  <defs\n     id="defs1" />\n  <sodipodi:namedview\n     id="namedview1"\n     pagecolor="#ffffff"\n     bordercolor="#000000"\n     borderopacity="0.25"\n     inkscape:showpageshadow="2"\n     inkscape:pageopacity="0.0"\n     inkscape:pagecheckerboard="0"\n     inkscape:deskcolor="#d1d1d1"\n     inkscape:zoom="64"\n     inkscape:cx="4.046875"\n     inkscape:cy="7.8203125"\n     inkscape:window-width="2560"\n     inkscape:window-height="1377"\n     inkscape:window-x="2552"\n     inkscape:window-y="-8"\n     inkscape:window-maximized="1"\n     inkscape:current-layer="svg1" />\n  <path\n     d="M 14,9 H 3 V 29 H 23 V 18 M 18,4 H 28 V 14 M 28,4 14,18"\n     id="path1"\n     style="display:none"\n     inkscape:label="original"\n     sodipodi:insensitive="true" />\n  <circle\n     style="fill:#44cf6e;fill-opacity:1;stroke:none;stroke-width:2.16087;stroke-linecap:round;stroke-linejoin:round;paint-order:fill markers stroke"\n     id="path5"\n     cy="18.99881"\n     cx="13.001188"\n     inkscape:label="circle"\n     r="6.1458478" />\n  <path\n     d="M 14,9 H 3 V 29 H 23 V 18"\n     id="path3"\n     inkscape:label="link"\n     style="display:inline"\n     sodipodi:nodetypes="ccccc" />\n  <path\n     d="M 18,4 H 28 V 14 M 28,4 20.035714,11.964286"\n     id="path4"\n     inkscape:label="link"\n     sodipodi:nodetypes="ccccc"\n     style="display:inline" />\n</svg>\n';

// svg/unsafe-link.svg
var unsafe_link_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg\n   class="i-external"\n   viewBox="0 0 32 32"\n   width="14"\n   height="14"\n   fill="none"\n   stroke="#888888"\n   stroke-linecap="round"\n   stroke-linejoin="round"\n   stroke-width="9.38%"\n   version="1.1"\n   id="svg1"\n   sodipodi:docname="unsave-link.svg"\n   inkscape:version="1.4.4 (dcaf3e7, 2026-05-05)"\n   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"\n   xmlns="http://www.w3.org/2000/svg"\n   xmlns:svg="http://www.w3.org/2000/svg">\n  <defs\n     id="defs1" />\n  <sodipodi:namedview\n     id="namedview1"\n     pagecolor="#ffffff"\n     bordercolor="#000000"\n     borderopacity="0.25"\n     inkscape:showpageshadow="2"\n     inkscape:pageopacity="0.0"\n     inkscape:pagecheckerboard="0"\n     inkscape:deskcolor="#d1d1d1"\n     inkscape:zoom="64"\n     inkscape:cx="4.0546875"\n     inkscape:cy="7.8203125"\n     inkscape:window-width="2560"\n     inkscape:window-height="1377"\n     inkscape:window-x="2552"\n     inkscape:window-y="-8"\n     inkscape:window-maximized="1"\n     inkscape:current-layer="svg1" />\n  <path\n     d="M 14,9 H 3 V 29 H 23 V 18 M 18,4 H 28 V 14 M 28,4 14,18"\n     id="path1"\n     style="display:none"\n     inkscape:label="original"\n     sodipodi:insensitive="true" />\n  <circle\n     style="fill:#fb464c;fill-opacity:1;stroke:none;stroke-width:2.16087;stroke-linecap:round;stroke-linejoin:round;paint-order:fill markers stroke"\n     id="path5"\n     cy="18.99881"\n     cx="13.001188"\n     inkscape:label="circle"\n     r="6.1458478" />\n  <path\n     d="M 14,9 H 3 V 29 H 23 V 18"\n     id="path3"\n     inkscape:label="link"\n     style="display:inline"\n     sodipodi:nodetypes="ccccc" />\n  <path\n     d="M 18,4 H 28 V 14 M 28,4 20.035714,11.964286"\n     id="path4"\n     inkscape:label="link"\n     sodipodi:nodetypes="ccccc"\n     style="display:inline" />\n</svg>\n';

// svg/warning-link.svg
var warning_link_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg\n   class="i-external"\n   viewBox="0 0 32 32"\n   width="14"\n   height="14"\n   fill="none"\n   stroke="#888888"\n   stroke-linecap="round"\n   stroke-linejoin="round"\n   stroke-width="9.38%"\n   version="1.1"\n   id="svg1"\n   sodipodi:docname="warning-link.svg"\n   inkscape:version="1.4.4 (dcaf3e7, 2026-05-05)"\n   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"\n   xmlns="http://www.w3.org/2000/svg"\n   xmlns:svg="http://www.w3.org/2000/svg">\n  <defs\n     id="defs1" />\n  <sodipodi:namedview\n     id="namedview1"\n     pagecolor="#ffffff"\n     bordercolor="#000000"\n     borderopacity="0.25"\n     inkscape:showpageshadow="2"\n     inkscape:pageopacity="0.0"\n     inkscape:pagecheckerboard="0"\n     inkscape:deskcolor="#d1d1d1"\n     inkscape:zoom="64"\n     inkscape:cx="4.0546875"\n     inkscape:cy="7.8203125"\n     inkscape:window-width="2560"\n     inkscape:window-height="1377"\n     inkscape:window-x="2552"\n     inkscape:window-y="-8"\n     inkscape:window-maximized="1"\n     inkscape:current-layer="svg1" />\n  <path\n     d="M 14,9 H 3 V 29 H 23 V 18 M 18,4 H 28 V 14 M 28,4 14,18"\n     id="path1"\n     style="display:none"\n     inkscape:label="original"\n     sodipodi:insensitive="true" />\n  <circle\n     style="fill:#e9973f;fill-opacity:1;stroke:none;stroke-width:2.16087;stroke-linecap:round;stroke-linejoin:round;paint-order:fill markers stroke"\n     id="path5"\n     cy="18.99881"\n     cx="13.001188"\n     inkscape:label="circle"\n     r="6.1458478" />\n  <path\n     d="M 14,9 H 3 V 29 H 23 V 18"\n     id="path3"\n     inkscape:label="link"\n     style="display:inline"\n     sodipodi:nodetypes="ccccc" />\n  <path\n     d="M 18,4 H 28 V 14 M 28,4 20.035714,11.964286"\n     id="path4"\n     inkscape:label="link"\n     sodipodi:nodetypes="ccccc"\n     style="display:inline" />\n</svg>\n';

// svg/starred-link.svg
var starred_link_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg\n   class="i-external"\n   viewBox="0 0 32 32"\n   width="14"\n   height="14"\n   fill="none"\n   stroke="#888888"\n   stroke-linecap="round"\n   stroke-linejoin="round"\n   stroke-width="9.38%"\n   version="1.1"\n   id="svg1"\n   sodipodi:docname="star-link.svg"\n   inkscape:version="1.4.4 (dcaf3e7, 2026-05-05)"\n   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"\n   xmlns="http://www.w3.org/2000/svg"\n   xmlns:svg="http://www.w3.org/2000/svg">\n  <defs\n     id="defs1" />\n  <sodipodi:namedview\n     id="namedview1"\n     pagecolor="#ffffff"\n     bordercolor="#000000"\n     borderopacity="0.25"\n     inkscape:showpageshadow="2"\n     inkscape:pageopacity="0.0"\n     inkscape:pagecheckerboard="0"\n     inkscape:deskcolor="#d1d1d1"\n     inkscape:zoom="32"\n     inkscape:cx="9.015625"\n     inkscape:cy="10.296875"\n     inkscape:window-width="1280"\n     inkscape:window-height="1377"\n     inkscape:window-x="3832"\n     inkscape:window-y="-8"\n     inkscape:window-maximized="0"\n     inkscape:current-layer="svg1" />\n  <path\n     d="M 14,9 H 3 V 29 H 23 V 18 M 18,4 H 28 V 14 M 28,4 14,18"\n     id="path1"\n     style="display:none"\n     inkscape:label="original" />\n  <path\n     d="M 14,9 H 3 V 29 H 23 V 18 M 18,4 H 28 V 14 M 28,4 14,18"\n     id="path3"\n     inkscape:label="link"\n     style="display:none" />\n  <path\n     d="M 18,4 H 28 V 14 M 28,4 18.571429,13.428571"\n     id="path4"\n     inkscape:label="link"\n     sodipodi:nodetypes="ccccc" />\n  <path\n     fill="#ffac33"\n     d="m 19.281055,30.49891 c -0.27321,0 -0.545069,-0.08386 -0.779057,-0.250894 L 13.000585,26.302688 7.4991721,30.248016 A 1.3322414,1.3322414 0 0 1 5.9356483,30.242607 1.3322414,1.3322414 0 0 1 5.4480614,28.758882 L 7.4998485,22.136903 2.0478027,18.295042 A 1.3390041,1.3390041 0 0 1 1.5690072,16.805231 1.3390041,1.3390041 0 0 1 2.8309171,15.883482 l 6.7525026,-0.01015 2.1498463,-6.4576524 a 1.336299,1.336299 0 0 1 2.535316,0 l 2.113327,6.4576524 6.786993,0.01015 a 1.3356227,1.3356227 0 0 1 0.78379,2.41156 l -5.452046,3.841861 2.051787,6.621983 a 1.3322414,1.3322414 0 0 1 -0.48691,1.483725 1.3254788,1.3254788 0 0 1 -0.784468,0.256304"\n     id="path2"\n     style="stroke:none;stroke-width:0.887935;stroke-dasharray:none;stroke-opacity:1"\n     inkscape:label="star" />\n</svg>\n';

// svg/fmhy-link.svg
var fmhy_link_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg\n   class="i-external"\n   viewBox="0 0 32 32"\n   width="14"\n   height="14"\n   fill="none"\n   stroke="#888888"\n   stroke-linecap="round"\n   stroke-linejoin="round"\n   stroke-width="9.38%"\n   version="1.1"\n   id="svg1"\n   sodipodi:docname="fmhy-link.svg"\n   inkscape:version="1.4.4 (dcaf3e7, 2026-05-05)"\n   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"\n   xmlns="http://www.w3.org/2000/svg"\n   xmlns:svg="http://www.w3.org/2000/svg">\n  <defs\n     id="defs1" />\n  <sodipodi:namedview\n     id="namedview1"\n     pagecolor="#ffffff"\n     bordercolor="#000000"\n     borderopacity="0.25"\n     inkscape:showpageshadow="2"\n     inkscape:pageopacity="0.0"\n     inkscape:pagecheckerboard="0"\n     inkscape:deskcolor="#d1d1d1"\n     inkscape:zoom="64"\n     inkscape:cx="4.0546875"\n     inkscape:cy="7.8203125"\n     inkscape:window-width="2560"\n     inkscape:window-height="1377"\n     inkscape:window-x="2552"\n     inkscape:window-y="-8"\n     inkscape:window-maximized="1"\n     inkscape:current-layer="svg1" />\n  <path\n     d="M 14,9 H 3 V 29 H 23 V 18 M 18,4 H 28 V 14 M 28,4 14,18"\n     id="path1"\n     style="display:none"\n     inkscape:label="original"\n     sodipodi:insensitive="true" />\n  <circle\n     style="fill:#027aff;fill-opacity:1;stroke:none;stroke-width:2.16087;stroke-linecap:round;stroke-linejoin:round;paint-order:fill markers stroke"\n     id="path5"\n     cy="18.99881"\n     cx="13.001188"\n     inkscape:label="circle"\n     r="6.1458478" />\n  <path\n     d="M 14,9 H 3 V 29 H 23 V 18"\n     id="path3"\n     inkscape:label="link"\n     style="display:inline"\n     sodipodi:nodetypes="ccccc" />\n  <path\n     d="M 18,4 H 28 V 14 M 28,4 20.035714,11.964286"\n     id="path4"\n     inkscape:label="link"\n     sodipodi:nodetypes="ccccc"\n     style="display:inline" />\n</svg>\n';

// svg/external-link.svg
var external_link_default = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns='http://www.w3.org/2000/svg' class='i-external' viewBox='0 0 32 32' width='14' height='14' fill='none' stroke='#888888' stroke-linecap='round' stroke-linejoin='round' stroke-width='9.38%'><path d='M14 9 L3 9 3 29 23 29 23 18 M18 4 L28 4 28 14 M28 4 L14 18'/></svg>
`;

// src/main.ts
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
      safe: safe_link_default,
      unsafe: unsafe_link_default,
      warning: warning_link_default,
      starred: starred_link_default,
      fmhy: fmhy_link_default,
      external: external_link_default
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
