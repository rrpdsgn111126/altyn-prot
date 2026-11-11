# Altyn.Base / shared HTML

Модуль без сборщика и фреймворка. Предназначен для новых HTML-прототипов внутри `altyn-prot`; текущий `physical-upay` не переводится автоматически.

**Подключение из `physical-upay/index.html` или другого соседнего каталога:**

```html
<link rel="stylesheet" href="../shared/tokens.css">
<link rel="stylesheet" href="../shared/components.css">
<script src="../shared/components.js"></script>
```

**Пример использования** (выполнять после загрузки `components.js`):

```js
const UI = window.AltynBase;
document.querySelector("#navbar").append(
  UI.createNavbar({title:"Оформление карты",onBack:()=>history.back()})
);
document.querySelector("#fields").append(
  UI.createInput({label:"ФИО",name:"name",placeholder:"Введите ФИО",required:true})
);
document.querySelector("#actions").append(
  UI.createButton({label:"Продолжить",block:true,onClick:submitForm})
);
```

API: `createButton({label,type, size,block,disabled,loading,onClick})`, `createInput({label,name,id,type,placeholder,value,helper,error,required,disabled,readOnly,onInput})`, `createNavbar({title,align,showBack,onBack,onHelp})`, `createListRow({label,value,disabled,onClick})`, `createCheckbox({label,name,checked,disabled,onChange})`.

Все функции возвращают DOM-узел. Данные помещаются через `textContent`; компонент **не отправляет API-запросы** и не предполагает бизнес-логику. Состояния полей, переходы и валидация определяются сценарием конкретного прототипа.

**Витрина:** `shared/index.html`, прямой адрес после публикации GitHub Pages: `https://rrpdsgn111126.github.io/altyn-prot/shared/`.

**Спецификации:** [карта соответствий](../docs/component-map.md), [правила экранов](../docs/mobile-screen-layout.md). Не путать подсистему CSS с нативной библиотекой Figma: пока это частичная реализация.
