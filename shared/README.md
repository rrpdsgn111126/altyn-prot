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

## Searchable selection Bottom Sheet (2026-11-11)

Подключать **после** `components.js`:

```html
<link rel="stylesheet" href="../shared/select-sheet.css">
<script src="../shared/select-sheet.js"></script>
```

```js
const UI=window.AltynBase;
const picker=UI.createSelectField({
  label:"Страна", title:"Выберите страну", name:"country", kind:"country",
  searchPlaceholder:"Найти страну", searchable:true,
  items:[{id:"kz",label:"Казахстан",icon:"🇰🇿"},{id:"ru",label:"Россия",icon:"🇷🇺"}],
  onChange:(item,value)=>console.log(item.label,value)
});
document.querySelector("#fields").append(picker);
```

Вспомогательные методы DOM-контейнера: `picker.open()`, `picker.close()`, `picker.getValue()`, `picker.setValue(id,{silent?})`, `picker.setItems(items)`. Скрытое поле `input[name]` получает выбранный `value` и вызывает `change`.

`kind:"country"|"bank"|"network"`; на строках и в выбранном поле иконка справа. `icon:"🇰🇿"` — флаг/emoji, `iconSrc:"../assets/bank.svg"` — конкретное изображение/логотип, `subtitle`, `searchText`, `disabled` — дополнительные свойства элемента.

Прямое открытие: `UI.openSelectionSheet({host,trigger,title,items,kind,searchable,searchPlaceholder,onSelect,onClose})`, возвращает объект `{close,overlay,sheet,searchInput,getVisibleCount}`. Если список без поиска, задайте `searchable:false`. Список элементов — локальные данные для витрины, API не вызывается. Файлы `physical-upay` не меняются.

**Контроль качества:** `shared/tests/select-sheet.html`. В Figma это составной паттерн `modal + Input.mobile + list.mobile`, а не новый компонент под вымышленным Figma ID.

## Обычная модалка: композиция и правила оформления

Источник: [Altyn App / 18443:138108](https://www.figma.com/design/n9eR5MzhUA8BpvjO9ciYgi/?node-id=18443-138108).

- **Фон Bottom Sheet по умолчанию:** `bg/neutral/secondary`, `#F6F7F8`
- **Список внутри:** отдельная белая поверхность `bg/neutral/primary`, `#FFFFFF`, радиус 16 px, по 16 px внутренние горизонтальные поля; строки `list.mobile`, 54 px
- **Все action-кнопки модалки:** `Button.mobile` размера **M** (основной вариант 44 px), отступ от содержимого до зоны кнопок — 24 px
- Боковые поля содержимого 16 px, grab-handle 56×4 px
- Если конкретный макет содержит модалку с `Primary` фоном, укажите `surface:"primary"`, не меняйте дизайн-систему глобально

Подключение (после `components.js`):
```html
<link rel="stylesheet" href="../shared/modal.css">
<script src="../shared/modal.js"></script>
```

Пример:
```js
AltynBase.openModal({
  title:"Документы для банка",
  items:[{label:"Брокерский договор"},{label:"Подтверждение открытия брокерского счета"}],
  actions:[{label:"Закрыть",type:"primary"}]
});
```

`openModal({host,trigger,title,items,content,surface,actions,onClose})` возвращает `{close,overlay,sheet}`; для прикладного содержимого можно передать существующий DOM-узел в `content`. Если указан `items`, строки формируются внутри белого списка. Action-кнопки всегда создаются с `size:"M"`, если у действия нет `onClick` — оно просто закрывает модалку. Для иных действий укажите `onClick(api)`, опционально `closeOnClick:false`.

Проверка: `shared/tests/modal.html`. Составной модальный паттерн, не новый Figma Component Set.
