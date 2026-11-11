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

## Выбор и переключатели (дополнительный модуль)

Подключайте после базовой библиотеки:

```html
<link rel="stylesheet" href="../shared/choices.css">
<script src="../shared/choices.js"></script>
```

```js
const UI = window.AltynBase;
document.querySelector("#switches").append(
  UI.createSwitch({label:"Уведомления",size:"XL",theme:"success",checked:true,onChange:(checked)=>console.log(checked)})
);
document.querySelector("#method").append(
  UI.createRadioGroup({name:"method",label:"Метод",value:"card",options:[
    {label:"Карта",value:"card"},
    {label:"Перевод",value:"transfer",description:"Дополнительное описание"}
  ],onChange:(value)=>console.log(value)})
);
document.querySelector("#choices").append(
  UI.createToggleButton({label:"Основной",size:"M",active:false,onChange:(active)=>console.log(active)})
);
```

Дополнительные методы: `createSwitch({label,ariaLabel,id,name,size:"M"|"L"|"XL",theme:"success"|"info",icon,checked,disabled,onChange})`,
`createRadio({label,ariaLabel,name,value,checked,disabled,size:"Regular"|"Small",style:"Primary"|"Alternative",description,onChange})`,
`createRadioGroup({label,name,value,options,onChange})`,
`createToggleButton({label,size,active,disabled,loading,icon,iconSrc,onChange})`,
`createToggleBank({label,size,active,disabled,loading,icon,iconSrc,extraIcon,onChange})`.

Исходная банка-иконка в `assets/bank.svg` — **конкретный Figma-пример**, заменяйте `iconSrc` при другом банке. `createRadioGroup` — кодовая композиция, а не компонент Altyn.Base. Подробные статусы реализации — в [плане миграции](../docs/design-system-migration-plan.md).

### Smoke tests

`shared/tests/choices.html` выполняет браузерные проверки переключения, семантики и отключенных состояний; отчёт находится в элементе `#result`. Для полноценной визуальной регрессии нужны дополнительные скриншотные тесты на 375 и 390 px.

## Input.mobile: label и состояния (2026-11-11)

`createInput({label,placeholder,value,error,...})` размещает **label внутри 54px поля**: при пустом Enable — центрированный текст 16/24; при focus, заполненном значении или ошибке — верхний label 12/16 и место для value/placeholder снизу. Функция возвращает `.ab-field` (не отдельный `input`); настоящий HTML input доступен через `field.querySelector("input")` и сохраняет `name` / `id` / `required`. Состояния доступны как `field.dataset.state` и `.ab-input-control.dataset.floated`.

При клике на label фокус передаётся связанному полю. `onInput(event)` получает DOM InputEvent, как и в прежней версии компонента. Дополнительные иконки и `secondary` пока не реализованы. Автотесты: `shared/tests/input.html`.

### Уточнение Input.mobile: общий контейнер с рамкой

В исправленной реализации граница, фон и радиус принадлежат `.ab-input-control`. Его дочерние элементы — `input.ab-input` и `label.ab-input-label`: обе строки физически находятся внутри **одной и той же рамки**, без вынесенного label сверху.

- `createInput({label:"ФИО"})`: Figma `2152:12365` / Enable, label 16/24px внутри по центру.
- `createInput({label:"ФИО",placeholder:"Введите ФИО"})`: Figma `2190:18818` / Enable + placeholder, label 12/16px внутри сверху, placeholder 16/24px прямо под ним **сразу**, без необходимости ставить фокус.
- `createInput({label:"ФИО",value:"Иванов"})`: Figma `2014:9857` / Filled, та же раскладка с введённым значением.

Для автоматических тестов важна не только семантика, но и визуальная геометрия: `.ab-input-control` содержит border, а `.ab-input-label` целиком лежит внутри его прямоугольника.
