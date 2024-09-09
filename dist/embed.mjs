(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode('.embed-tool--loading .embed-tool__caption{display:none}.embed-tool--loading .embed-tool__preloader{display:block}.embed-tool--loading .embed-tool__content{display:none}.embed-tool__preloader{display:none;position:relative;height:200px;box-sizing:border-box;border-radius:5px;border:1px solid #e6e9eb}.embed-tool__preloader:before{content:"";position:absolute;z-index:3;left:50%;top:50%;width:30px;height:30px;margin-top:-25px;margin-left:-15px;border-radius:50%;border:2px solid #cdd1e0;border-top-color:#388ae5;box-sizing:border-box;animation:embed-preloader-spin 2s infinite linear}.embed-tool__url{position:absolute;bottom:20px;left:50%;transform:translate(-50%);max-width:250px;color:#7b7e89;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.embed-tool__content{width:100%}.embed-tool__caption{margin-top:7px}.embed-tool__caption[contentEditable=true][data-placeholder]:before{position:absolute;content:attr(data-placeholder);color:#707684;font-weight:400;opacity:0}.embed-tool__caption[contentEditable=true][data-placeholder]:empty:before{opacity:1}.embed-tool__caption[contentEditable=true][data-placeholder]:empty:focus:before{opacity:0}.embed-tool__input{margin-bottom:5px}.embed-tool__input--error{background-color:#fff3f6;border-color:#f3e0e0;color:#a95a5a;box-shadow:inset 0 1px 3px #923e3e0d}.embed-tool__service-info{font-size:.8em}@keyframes embed-preloader-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}')),document.head.appendChild(e)}}catch(o){console.error("vite-plugin-css-injected-by-js",o)}})();
const v = {
  youtube: {
    regex: /(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|shorts\/|watch))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)/,
    embedUrl: "https://www.youtube.com/embed/<%= remote_id %>",
    html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
    height: 320,
    width: 580,
    id: ([l, e]) => {
      if (!e && l)
        return l;
      const i = {
        start: "start",
        end: "end",
        t: "start",
        // eslint-disable-next-line camelcase
        time_continue: "start",
        list: "list"
      };
      return e = e.slice(1).split("&").map((t) => {
        const [r, s] = t.split("=");
        return !l && r === "v" ? (l = s, null) : !i[r] || s === "LL" || s.startsWith("RDMM") || s.startsWith("FL") ? null : `${i[r]}=${s}`;
      }).filter((t) => !!t), l + "?" + e.join("&");
    }
  },
  "twitch-video": {
    regex: /https?:\/\/www\.twitch\.tv\/(?:[^\/\?\&]*\/v|videos)\/([0-9]*)/,
    embedUrl: "https://player.twitch.tv/?<%= remote_id %>",
    html: '<iframe frameborder="0" allowfullscreen="true" scrolling="no" height="366" style="width:100%;"></iframe>',
    height: 366,
    width: 600,
    id: ([l]) => {
      let e = [];
      return e.push("video=v" + l), e.push("parent=" + window.location.host), e.join("&");
    }
  }
};
function p(l, e, i) {
  var t, r, s, n, a;
  e == null && (e = 100);
  function o() {
    var c = Date.now() - n;
    c < e && c >= 0 ? t = setTimeout(o, e - c) : (t = null, i || (a = l.apply(s, r), s = r = null));
  }
  var h = function() {
    s = this, r = arguments, n = Date.now();
    var c = i && !t;
    return t || (t = setTimeout(o, e)), c && (a = l.apply(s, r), s = r = null), a;
  };
  return h.clear = function() {
    t && (clearTimeout(t), t = null);
  }, h.flush = function() {
    t && (a = l.apply(s, r), s = r = null, clearTimeout(t), t = null);
  }, h;
}
p.debounce = p;
var b = p;
const g = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 10.5606V13.4394C10 14.4777 11.1572 15.0971 12.0211 14.5211L14.1803 13.0817C14.9536 12.5661 14.9503 11.4317 14.18 10.9181L12.0214 9.47907C11.1591 8.9042 10 9.5203 10 10.5606Z"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>';
class d {
  /**
   * @param {{data: EmbedData, config: EmbedConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor({ data: e, api: i, readOnly: t }) {
    this.api = i, this._data = {}, this.element = null, this.readOnly = t, this.data = e;
  }
  /**
   * @param {EmbedData} data - embed data
   * @param {RegExp} [data.regex] - pattern of source URLs
   * @param {string} [data.embedUrl] - URL scheme to embedded page. Use '<%= remote_id %>' to define a place to insert resource id
   * @param {string} [data.html] - iframe which contains embedded content
   * @param {number} [data.height] - iframe height
   * @param {number} [data.width] - iframe width
   * @param {string} [data.caption] - caption
   */
  set data(e) {
    if (!(e instanceof Object))
      throw Error("Embed Tool data should be object");
    const { service: i, source: t, embed: r, width: s, height: n, caption: a = "" } = e;
    this._data = {
      service: i || this.data.service,
      source: t || this.data.source,
      embed: r || this.data.embed,
      width: s || this.data.width,
      height: n || this.data.height,
      caption: a || this.data.caption || ""
    };
    const o = this.element;
    o && o.parentNode.replaceChild(this.render(), o);
  }
  /**
   * @returns {EmbedData}
   */
  get data() {
    if (this.element) {
      const e = this.element.querySelector(`.${this.CSS.caption}`);
      e && (this._data.caption = e.innerHTML);
    }
    return this._data;
  }
  /**
   * Get plugin styles
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      container: "embed-tool",
      containerLoading: "embed-tool--loading",
      preloader: "embed-tool__preloader",
      caption: "embed-tool__caption",
      url: "embed-tool__url",
      content: "embed-tool__content",
      linkInput: "embed-tool__input",
      linkInputError: "embed-tool__input--error",
      servicesInfo: "embed-tool__service-info"
    };
  }
  /**
   * Render Embed tool content
   *
   * @returns {HTMLElement}
   */
  render() {
    if (this.element = document.createElement("div"), this.element.classList.add(this.CSS.baseClass, this.CSS.container), this.data.service) {
      const e = this.createEmbed();
      this.element.appendChild(e);
    } else {
      const e = this.createInput();
      this.element.appendChild(e);
    }
    return this.element;
  }
  /**
   * @returns {HTMLElement}
   */
  createInput() {
    const e = document.createElement("div"), i = document.createElement("input");
    i.classList.add(this.CSS.input, this.CSS.linkInput), i.placeholder = this.api.i18n.t("Enter a link"), i.addEventListener("input", (s) => {
      if (i.value == "")
        i.classList.remove(this.CSS.linkInputError);
      else {
        let n = this.getServiceByUrl(i.value);
        n ? this.data = n : i.classList.add(this.CSS.linkInputError);
      }
    });
    const t = document.createElement("div");
    t.classList.add(this.CSS.servicesInfo);
    let r = Object.keys(d.services).map((s) => this.api.i18n.t(s));
    return t.innerText = this.api.i18n.t("Support services:") + " " + r.join(", "), e.appendChild(i), e.appendChild(t), e;
  }
  getServiceByUrl(e) {
    for (let i in d.patterns)
      if (new RegExp(d.patterns[i]).test(e)) {
        const { regex: r, embedUrl: s, width: n, height: a, id: o = (u) => u.shift() } = d.services[i], h = r.exec(e).slice(1), c = s.replace(/<%= remote_id %>/g, o(h));
        return {
          service: i,
          source: e,
          embed: c,
          width: n,
          height: a
        };
      }
    return null;
  }
  createEmbed() {
    const { html: e } = d.services[this.data.service], i = document.createElement("div"), t = document.createElement("div"), r = document.createElement("template"), s = this.createPreloader();
    t.classList.add(this.CSS.input, this.CSS.caption), i.appendChild(s), i.classList.add(this.CSS.containerLoading), t.contentEditable = !this.readOnly, t.dataset.placeholder = this.api.i18n.t("Enter a caption"), t.innerHTML = this.data.caption || "", r.innerHTML = e, r.content.firstChild.setAttribute("src", this.data.embed), r.content.firstChild.classList.add(this.CSS.content);
    const n = this.embedIsReady(i);
    return i.appendChild(r.content.firstChild), i.appendChild(t), n.then(() => {
      i.classList.remove(this.CSS.containerLoading);
    }), i;
  }
  /**
   * Creates preloader to append to container while data is loading
   *
   * @returns {HTMLElement}
   */
  createPreloader() {
    const e = document.createElement("preloader"), i = document.createElement("div");
    return i.textContent = this.data.source, e.classList.add(this.CSS.preloader), i.classList.add(this.CSS.url), e.appendChild(i), e;
  }
  /**
   * Save current content and return EmbedData object
   *
   * @returns {EmbedData}
   */
  save() {
    return this.data;
  }
  validate(e) {
    return e.service;
  }
  /**
   * Analyze provided config and make object with services to use
   *
   * @param {EmbedConfig} config - configuration of embed block element
   */
  static prepare({ config: e = {} }) {
    const { services: i = {} } = e;
    let t = Object.entries(v);
    const r = Object.entries(i).filter(([n, a]) => typeof a == "boolean" && a === !0).map(([n]) => n), s = Object.entries(i).filter(([n, a]) => typeof a == "object").filter(([n, a]) => d.checkServiceConfig(a)).map(([n, a]) => {
      const { regex: o, embedUrl: h, html: c, height: u, width: m, id: f } = a;
      return [n, {
        regex: o,
        embedUrl: h,
        html: c,
        height: u,
        width: m,
        id: f
      }];
    });
    r.length && (t = t.filter(([n]) => r.includes(n))), t = t.concat(s), d.services = t.reduce((n, [a, o]) => a in n ? (n[a] = Object.assign({}, n[a], o), n) : (n[a] = o, n), {}), d.patterns = t.reduce((n, [a, o]) => (n[a] = o.regex, n), {});
  }
  /**
   * Check if Service config is valid
   *
   * @param {Service} config - configuration of embed block element
   * @returns {boolean}
   */
  static checkServiceConfig(e) {
    const { regex: i, embedUrl: t, html: r, height: s, width: n, id: a } = e;
    let o = i && i instanceof RegExp && t && typeof t == "string" && r && typeof r == "string";
    return o = o && (a !== void 0 ? a instanceof Function : !0), o = o && (s !== void 0 ? Number.isFinite(s) : !0), o = o && (n !== void 0 ? Number.isFinite(n) : !0), o;
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: g,
      title: "Video"
    };
  }
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Checks that mutations in DOM have finished after appending iframe content
   *
   * @param {HTMLElement} targetNode - HTML-element mutations of which to listen
   * @returns {Promise<any>} - result that all mutations have finished
   */
  embedIsReady(e) {
    let t = null;
    return new Promise((r, s) => {
      t = new MutationObserver(b.debounce(r, 450)), t.observe(e, {
        childList: !0,
        subtree: !0
      });
    }).then(() => {
      t.disconnect();
    });
  }
}
export {
  d as default
};
