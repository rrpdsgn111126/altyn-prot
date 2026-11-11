/* Altyn.Base selection controls, extracted against Figma component sets.
 * Requires ./components.js before this file. No backend assumptions. */
(function (root) {
  "use strict";
  if (!root.AltynBase) throw new Error("Load components.js before choices.js");
  const base = new URL("./", document.currentScript ? document.currentScript.src : document.baseURI);
  const asset = (file) => new URL("assets/" + file, base).href;
  const el = (tag, cls, value) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (value !== undefined && value !== null) n.textContent = String(value);
    return n;
  };
  const on = (node, type, cb) => {
    if (typeof cb === "function") node.addEventListener(type, cb);
  };
  function createSwitch(opts = {}) {
    const size = ["M", "L", "XL"].includes(opts.size) ? opts.size : "XL";
    const theme = opts.theme === "info" ? "info" : "success";
    const label = el("label", "ab-switch");
    label.dataset.figmaId = "3254:14282";
    label.dataset.size = size;
    label.dataset.theme = theme;
    label.dataset.icon = String(Boolean(opts.icon) && size !== "M");
    const input = el("input", "ab-switch__input");
    input.type = "checkbox";
    input.setAttribute("role", "switch");
    input.checked = Boolean(opts.checked);
    input.disabled = Boolean(opts.disabled);
    if (opts.name) input.name = opts.name;
    if (opts.id) input.id = opts.id;
    input.setAttribute("aria-label", opts.label || opts.ariaLabel || "Переключатель");
    const track = el("span", "ab-switch__track");
    track.setAttribute("aria-hidden", "true");
    const handle = el("span", "ab-switch__handle");
    track.append(handle);
    if (opts.icon && size !== "M") {
      const symbol = el("span", "ab-switch__addon");
      track.append(symbol);
    }
    label.append(input, track);
    if (opts.label) label.append(el("span", "ab-switch__text", opts.label));
    on(input, "change", () => opts.onChange && opts.onChange(input.checked, input));
    return label;
  }
  function createRadio(opts = {}) {
    const size = opts.size === "Small" ? "Small" : "Regular";
    const style = opts.style === "Alternative" ? "Alternative" : "Primary";
    const label = el("label", "ab-radio");
    label.dataset.figmaId = opts.description ? "2307:8499" : opts.label ? "2307:8344" : "2307:8237";
    label.dataset.size = size;
    label.dataset.style = style;
    const input = el("input", "ab-radio__input");
    input.type = "radio";
    if (opts.name) input.name = opts.name;
    if (opts.value !== undefined) input.value = String(opts.value);
    if (opts.id) input.id = opts.id;
    input.checked = Boolean(opts.checked);
    input.disabled = Boolean(opts.disabled);
    input.setAttribute("aria-label", opts.label || opts.ariaLabel || String(opts.value ?? "Вариант"));
    const visual = el("span", "ab-radio__visual");
    visual.setAttribute("aria-hidden", "true");
    const line = el("span", "ab-radio__line");
    line.append(input, visual);
    if (opts.label) line.append(el("span", "ab-radio__label", opts.label));
    label.append(line);
    if (opts.description) label.append(el("span", "ab-radio__description", opts.description));
    on(input, "change", () => { if (input.checked && opts.onChange) opts.onChange(input.value, input); });
    return label;
  }
  // Composition helper, not a separate Figma component.
  function createRadioGroup(opts = {}) {
    const fieldset = el("fieldset", "ab-radio-group");
    if (opts.label) fieldset.append(el("legend", "ab-radio-group__legend", opts.label));
    const name = opts.name || "ab-radio-" + Math.random().toString(36).slice(2);
    for (const item of opts.options || []) {
      fieldset.append(createRadio({ ...item, name, checked: item.checked !== undefined ? item.checked : String(item.value) === String(opts.value), disabled: opts.disabled || item.disabled, size: item.size || opts.size, style: item.style || opts.style, onChange: (value,input) => {if (opts.onChange) opts.onChange(value,input);} }));
    }
    return fieldset;
  }
  function makeToggle(opts, isBank) {
    const size = ["L", "M", "S"].includes(opts.size) ? opts.size : "L";
    const n = el("button", isBank ? "ab-toggle-bank" : "ab-toggle-button");
    n.type = "button";
    n.dataset.figmaId = isBank ? "4545:3398" : "2360:8748";
    n.dataset.size = size;
    n.disabled = Boolean(opts.disabled || opts.loading);
    n.setAttribute("aria-busy", String(Boolean(opts.loading)));
    n.setAttribute("aria-pressed", String(Boolean(opts.active)));
    if (opts.name) n.name = opts.name;
    if (opts.value != null) n.value = String(opts.value);
    const title = opts.label || (isBank ? "Банк" : "Вариант");
    n.setAttribute("aria-label", title);
    const showIcon = isBank ? opts.icon !== false : opts.icon !== false;
    if (isBank) {
      const visual = el("span", "ab-toggle-bank__icons");
      if (opts.extraIcon) {
        const icon = el("img", "ab-toggle-bank__extra");
        icon.src = asset("tile.svg");
        icon.alt = "";
        visual.append(icon);
      }
      if (showIcon) {
        const bank = el("img", "ab-toggle-bank__icon");
        bank.src = opts.iconSrc || asset("bank.svg");
        bank.alt = "";
        visual.append(bank);
      }
      n.append(visual, el("span", "ab-toggle-bank__label", title));
    } else {
      n.append(el("span", "ab-toggle-button__label", title));
      if (showIcon) {
        const icon = el("img", "ab-toggle-button__icon");
        icon.src = opts.iconSrc || asset("tile.svg");
        icon.alt = "";
        n.append(icon);
      }
    }
    const spinner = el("span", "ab-toggle__spinner");
    spinner.setAttribute("aria-hidden","true");
    n.append(spinner);
    on(n, "click", () => {
      if (n.disabled || n.getAttribute("aria-busy") === "true") return;
      const next = n.getAttribute("aria-pressed") !== "true";
      n.setAttribute("aria-pressed", String(next));
      if (typeof opts.onChange === "function") opts.onChange(next, n);
    });
    return n;
  }
  function createToggleButton(opts = {}) { return makeToggle(opts, false); }
  function createToggleBank(opts = {}) { return makeToggle(opts, true); }
  root.AltynBase = Object.freeze({ ...root.AltynBase, createSwitch, createRadio, createRadioGroup, createToggleButton, createToggleBank });
})(window);
