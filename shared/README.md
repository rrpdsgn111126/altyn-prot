# Altyn.Base / shared HTML

Частичная кодовая реализация компонентов Altyn без сборщика и фреймворка. **Источник визуального стандарта — оригинальная Figma Altyn.Base**; общие отступы и композиции описаны в [`docs/mobile-screen-layout.md`](../docs/mobile-screen-layout.md). Этот README содержит **только API, реальные связи и ограничения кода**, а не повторное описание всех размеров и цветов.

## Подключение

```html
<link rel="stylesheet" href="../shared/tokens.css">
<link rel="stylesheet" href="../shared/components.css">
<script src="../shared/components.js"></script>
```

```js
const UI = window.AltynBase;
document.querySelector("#navbar").append(UI.createNavbar({title:"Оформление карты",onBack:()=>history.back()}));
document.querySelector("#fields").append(UI.createInput({label:"ФИО",name:"name",required:true}));
document.querySelector("#actions").append(UI.createButton({label:"Продолжить",block:true,onClick:submitForm}));
```

Основные функции: `createButton({label,type,size,block,disabled,loading,onClick})`, `createInput({label,name,id,type,placeholder,value,helper,error,required,disabled,readOnly,onInput})`, `createNavbar({title,align,showBack,onBack,onHelp})`, `createListRow({label,value,disabled,onClick})`, `createCheckbox({label,name,checked,disabled,onChange})`.

Все фабрики возвращают DOM-узел. Реальные серверные запросы и бизнес-правила не встроены. Паттерны могут иметь меньшую полноту, чем их оригинальные Figma Component Sets.

## Подключаемые модули

| Возможность | CSS | JS | Проверка |
| --- | --- | --- | --- |
| Switch, Radio, Toggle и ToggleBank | `choices.css` | `choices.js` | `tests/choices.html` |
| Выбор из списка через Bottom Sheet | `select-sheet.css` | `select-sheet.js` | `tests/select-sheet.html` |
| Обычная Bottom Sheet / modal | `modal.css` | `modal.js` | `tests/modal.html` |
| Инпуты | `components.css` | `components.js` | `tests/input.html` |

Модули подключать **после** `components.js`. Доступны `createSwitch`, `createRadio`, `createRadioGroup`, `createToggleButton`, `createToggleBank`. `createRadioGroup` — HTML-композиция, **не оригинальный компонент Figma**.

Выбор: `createSelectField({label,title,name,kind,searchable,searchPlaceholder,items,onChange})`; методы полученного контейнера: `open()`, `close()`, `getValue()`, `setValue(id)`, `setItems(items)`. Низкоуровневый `openSelectionSheet({host,trigger,title,items,kind,searchable,onSelect,onClose})` создаёт панель с прокруткой и поиском, если разрешён. `kind`: `country` / `bank` / `network`. Для настоящих банковских и сетевых иконок передать `iconSrc`; `network-generic.svg` — локальная заглушка, а не официальный логотип.

Обычная модалка: `openModal({title,items,actions,surface})`; `surface:"primary"` только для специально подтверждённых белых модалок. Геометрия и дизайн из [спецификации](../docs/mobile-screen-layout.md), разделы 9–11.

`createInput()` возвращает `.ab-field`. Реальный input — `field.querySelector("input")`; `onInput` получает DOM InputEvent. `field.dataset.state` отражает состояние. Компонент имеет единую рамку вокруг label и ввода, но ряд иконок/secondary-свойств Figma в HTML пока не поддержан.

## Карта реализованных компонентов Figma ↔ HTML

Это соответствия **частичной кодовой реализации**, а не гарантия полного совпадения со всеми вариантами оригинала.

| Реализация | Компонент Figma и ID | Проверенные варианты Figma | Статус HTML |
| --- | --- | --- | --- |
| `AltynBase.createNavbar`, `.ab-navbar` | [navbar](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=3741-4350) `3741:4350` | `State=left/Centr/centr+arrow`, `right icons` | базовые left/center, back/help |
| `AltynBase.createButton`, `.ab-button` | [Button.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2168-7054) `2168:7054` | 90 вариантов: Type=Primary/Secondary/Tertiary; State=Enable/Disabled/Focused/Loading/Pressed; Size=L/M/S; Lable=yes/no | Type, Size, Disabled, Loading; режим icon-only и точная анимация Loading не реализованы |
| `AltynBase.createInput`, `.ab-input` | [Input.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=77-12680) `77:12680` | 14 вариантов: Enable, placeholder, Active/Focus, Filled, Invalid, Invalid+Active, Disabled; secondary Off/on | общий контейнер с рамкой высотой 54px: Enable — label 16px внутри по центру, Enable + placeholder — label 12px сверху и placeholder 16px под ним; Filled, Focus и Invalid используют ту же внутреннюю структуру; иконки/secondary пока не реализованы |
| `physical-upay` `.warning[data-figma-component="Notification"]` | [Notification](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=4228-12406) `4228:12406` | `Type=Yellow` → исходный Component ID `4228:12405`; `Type=Grey` → `4228:12407` | Для предупреждения о доставке в `physical-upay` зафиксирован **Figma Notification/Yellow**, а не самостоятельный HTML-компонент библиотеки; визуальный стиль `.warning` не является эталоном Altyn.Base |
| `AltynBase.createListRow`, `.ab-list-row` | [list.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2015-12843) `2015:12843` | 6 вариантов: Property 1=1/2/3, State=Enable/Disabled; иконки/радио/переключатель | строки с label/value, disabled, переход; сложные слоты отсутствуют |
| `AltynBase.createCheckbox`, `.ab-checkbox-input` | [Checkbox](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2983-17757) `2983:17757` | 72 варианта: Style=Default/Alternative/Positive/Negative; Enabled=Off/On/Mixed; Size=L/M; State=Default/Focused/Disabled | Default / On-Off / L / Focused / Disabled; Mixed и остальные Style не реализованы |

### Выбор и переключатели

| Реализация | Компонент Figma и ID | Варианты | HTML |
| --- | --- | --- | --- |
| `AltynBase.createSwitch` | [Switch.mob](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=3254-14282) `3254:14282` | 20: XL/L/M × On/Off × success/info, с иконкой для XL/L | Семантика `checkbox[role=switch]`, смена состояния, размеры и темы |
| `AltynBase.createRadio` | [RadioButton](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2307-8237) `2307:8237` | 24: Primary/Alternative × Regular/Small × On/Off × Default/Focused/Disabled | Нативный radio, стили, disabled, focus |
| `AltynBase.createRadio({label})` | [RadioButton Label](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2307-8344) `2307:8344` | 24 варианта | Подпись, выбор по клику по label |
| `AltynBase.createRadio({description})` | [Radio Button with Description](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2307-8499) `2307:8499` | Regular/Small | Текст описания с отступом 32px |
| `AltynBase.createToggleButton` | [ToggleButton.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2360-8748) `2360:8748` | 36: L/M/S × Enable/Active/Pressed/Focused/Disabled/Loading × Label yes/no | `aria-pressed`, размеры, Active/Disabled/Loading, оригинальная иконка Tile |
| `AltynBase.createToggleBank` | [ToggleBank](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=4545-3398) `4545:3398` | 18: L/M/S × Enable/Active/Pressed/Focused/Disabled/Loading | `aria-pressed`, размеры, локальная банковская иконка, подмена iconSrc |

## Ограничения и дальнейшее развитие

- Сейчас реализовано подмножество Navbar, Button.mobile, Input.mobile, list.mobile, Checkbox, Switch, Radio и Toggle. Доступность отдельных вариантов подтверждать по коду и тестам.
- **Не реализованы полностью:** input-phone, Link, TabBar/Tabitem, Step/Wizard, расширенные транзакции, Pin/Keyboard, state/verification, некоторые status/notification, icon swaps и все визуальные variants.
- Возможность `createSelectField` — **составной HTML-паттерн**, а не отдельный Figma Component Set. Для Figma нужен исходный `modal` с `Input.mobile` и `list.mobile`.
- Точные цвета, радиусы, высоты, свойства `sIcon R`, группировка списков, modal/M и правила композиции — в [`mobile-screen-layout.md`](../docs/mobile-screen-layout.md). Здесь они не дублируются.
- Новые элементы добавлять только при потребности реального сценария. Для каждого добавленного варианта проверять точное имя/Node ID Figma, mouse/keyboard состояния и Playwright (390 и 1440 px), не ломать действующие прототипы.
- Витрина: [`shared/index.html`](index.html). Отдельные smoke tests — в `tests/`.
