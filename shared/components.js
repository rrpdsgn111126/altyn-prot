/* Dependency-free DOM helpers for Altyn HTML prototypes. No API/backend assumptions. */
(function (root) {
  "use strict";
  const script = document.currentScript;
  const base = new URL("./", script ? script.src : document.baseURI).href;
  const asset = (name) => base + "assets/" + name;
  const node = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = String(text);
    return n;
  };
  const listen = (n, event, fn) => { if (typeof fn === "function") n.addEventListener(event, fn); return n; };
  function createButton(opts = {}) {
    const type = ["primary","secondary","tertiary"].includes(opts.type) ? opts.type : "primary";
    const size = ["L","M","S"].includes(opts.size) ? opts.size : "L";
    const button = node("button","ab-button");
    button.type = opts.htmlType || "button";
    button.dataset.type = type;
    button.dataset.size = size;
    button.dataset.block = String(Boolean(opts.block));
    button.dataset.figmaId = "2168:7054";
    button.disabled = Boolean(opts.disabled || opts.loading);
    button.setAttribute("aria-busy",String(Boolean(opts.loading)));
    const spinner = node("span","ab-button__spinner");
    spinner.setAttribute("aria-hidden","true");
    button.append(spinner,node("span","ab-button__label",opts.label || "Кнопка"));
    if (opts.loading) button.setAttribute("aria-label", opts.label || "Загрузка");
    return listen(button,"click",opts.onClick);
  }
  function createInput(opts = {}) {
    const wrap = node("div","ab-field");
    wrap.dataset.figmaId = "77:12680";
    const input = node("input","ab-input");
    input.type = opts.type || "text";
    if (opts.id) input.id = opts.id;
    if (opts.name) input.name = opts.name;
    if (opts.placeholder) input.placeholder = opts.placeholder;
    if (opts.value != null) input.value = String(opts.value);
    if (opts.required) input.required = true;
    if (opts.disabled) input.disabled = true;
    if (opts.readOnly) input.readOnly = true;
    if (opts.error) input.setAttribute("aria-invalid","true");
    if (opts.label) {
      const caption = node("label","ab-field__caption",opts.label);
      if (!input.id) input.id = "ab-input-" + Math.random().toString(36).slice(2,10);
      caption.htmlFor = input.id;
      wrap.append(caption);
    }
    wrap.append(input);
    const helperText = opts.error || opts.helper;
    if (helperText) {
      const helper = node("div","ab-field__helper",helperText);
      if (opts.error) helper.dataset.error = "true";
      wrap.append(helper);
      if (!helper.id) helper.id = input.id + "-helper";
      input.setAttribute("aria-describedby",helper.id);
    }
    listen(input,"input",opts.onInput);
    return wrap;
  }
  function createNavbar(opts = {}) {
    const bar = node("nav","ab-navbar");
    bar.dataset.figmaId = "3741:4350";
    bar.dataset.align = opts.align === "center" ? "center" : "left";
    if (opts.showBack !== false) {
      const back = node("button","ab-navbar__action");
      back.type = "button"; back.setAttribute("aria-label","Назад");
      const img = node("img"); img.src = asset("arrow-back.svg"); img.alt = "";
      back.append(img); listen(back,"click",opts.onBack); bar.append(back);
    } else bar.append(node("span","ab-navbar__placeholder"));
    bar.append(node("span","ab-navbar__title",opts.title || ""));
    if (opts.onHelp) {
      const help = node("button","ab-navbar__action"); help.type="button";
      help.setAttribute("aria-label","Помощь");
      const img = node("img"); img.src=asset("chat.svg"); img.alt="";
      help.append(img); listen(help,"click",opts.onHelp); bar.append(help);
    } else bar.append(node("span","ab-navbar__placeholder"));
    return bar;
  }
  function createListRow(opts = {}) {
    const row = node(opts.onClick ? "button" : "div","ab-list-row");
    if (opts.onClick) row.type="button";
    row.dataset.figmaId = "2015:12843";
    if (opts.disabled) row.disabled = true;
    const content = node("span","ab-list-row__content");
    if (opts.label) content.append(node("span","ab-list-row__label",opts.label));
    content.append(node("span","ab-list-row__value",opts.value || ""));
    row.append(content);
    if (opts.onClick) row.append(node("span","ab-list-row__chevron","›"));
    return listen(row,"click",opts.onClick);
  }
  function createCheckbox(opts = {}) {
    const label = node("label","ab-check");
    label.dataset.figmaId = "2983:17757";
    const input = node("input","ab-checkbox-input");
    input.type="checkbox"; input.checked=Boolean(opts.checked); input.disabled=Boolean(opts.disabled);
    if (opts.name) input.name=opts.name;
    label.append(input,node("span","",opts.label || ""));
    listen(input,"change",opts.onChange);
    return label;
  }
  root.AltynBase = Object.freeze({createButton,createInput,createNavbar,createListRow,createCheckbox});
})(window);
