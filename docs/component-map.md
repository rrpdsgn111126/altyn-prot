# Соответствие Altyn.Base → HTML

Источник: [Altyn.Base, Figma](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/), просмотрено 2026-11-11. Это **частичная кодовая реализация**, а не 1:1 реплика опубликованной Figma-библиотеки. Прямая автоматическая синхронизация не настроена.

При конфликте геометрии экранов действует [mobile-screen-layout.md](./mobile-screen-layout.md), в частности наружный gutter 16 px, gap инпутов 12 px, gap разных групп списков 12 px.

| Реализация | Компонент Figma и ID | Проверенные варианты Figma | Статус HTML |
| --- | --- | --- | --- |
| `AltynBase.createNavbar`, `.ab-navbar` | [navbar](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=3741-4350) `3741:4350` | `State=left/Centr/centr+arrow`, `right icons` | базовые left/center, back/help |
| `AltynBase.createButton`, `.ab-button` | [Button.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2168-7054) `2168:7054` | 90 вариантов: Type=Primary/Secondary/Tertiary; State=Enable/Disabled/Focused/Loading/Pressed; Size=L/M/S; Lable=yes/no | Type, Size, Disabled, Loading; режим icon-only и точная анимация Loading не реализованы |
| `AltynBase.createInput`, `.ab-input` | [Input.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=77-12680) `77:12680` | 14 вариантов: Enable, placeholder, Active/Focus, Filled, Invalid, Invalid+Active, Disabled; secondary Off/on | простой ввод, focus, filled browser-native, invalid, disabled, helper; встроенные иконки/secondary не реализованы |
| `AltynBase.createListRow`, `.ab-list-row` | [list.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2015-12843) `2015:12843` | 6 вариантов: Property 1=1/2/3, State=Enable/Disabled; иконки/радио/переключатель | строки с label/value, disabled, переход; сложные слоты отсутствуют |
| `AltynBase.createCheckbox`, `.ab-checkbox-input` | [Checkbox](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2983-17757) `2983:17757` | 72 варианта: Style=Default/Alternative/Positive/Negative; Enabled=Off/On/Mixed; Size=L/M; State=Default/Focused/Disabled | Default / On-Off / L / Focused / Disabled; Mixed и остальные Style не реализованы |

## Проверенные визуальные параметры

- `Button.mobile`, Primary / L / Enable: 54 px; radius 12 px; horizontal padding 24 px; Inter 16 Semi Bold; заливка `#FFD119`, текст `#211E1D`.
- Secondary / L / Enable: чёрный `#000000`, текст белый. Tertiary: прозрачный фон, рамка `#B9B7B7`. Disabled у кнопки: opacity 0.4.
- `Input.mobile`, Enable: 54 px; radius 12 px; белый фон, рамка `#E9ECF0`; Focus — рамка `#FFD119`; Invalid — рамка `#DD4014`, фон `#FFF4F8`.
- `list.mobile`, базовая строка: 54 px; label Inter 12/16, value Inter 16/24; нижний бордер `#E9ECF0`.
- `navbar`: 54 px; боковые поля 16 px; title Inter 18/24 Medium.
- SVG `arrow-back.svg`, `chat.svg`, `check.svg` экспортированы из экземпляров Figma, а не перерисованы вручную.
- В проверенном файле Figma **нет локальных variable collections**, только один локальный text style. Часть визуальных токенов встречается как значения непосредственно в слоях. CSS-токены фиксируют измеренное подмножество и не претендуют на исчерпывающий список.

## Ещё не перенесено

В Altyn.Base также есть `Button vertical.mobile`, `trans_v2.mobile`, `Input-phone.app`, `Tabitem-button`, `tag 1.0`, `pin.mobile`, `Switch.mob`, `ToggleBank`, `Statusbar`, `radio` и другие компоненты. Их **нельзя считать реализованными** на основании настоящего каталога.

Иконки для будущих компонентов экспортировать в локальные SVG с указанием Figma node ID. Не использовать временные ссылки `/api/mcp/asset/` в коде: они имеют ограниченный срок действия.

## Регламент

1. Для нового сценария взять максимально близкий существующий кодовый компонент.
2. Для незнакомого варианта проверить его в Altyn.Base и отдельно расширить кодовый компонент.
3. Для новой геометрии экрана следовать `mobile-screen-layout.md`, не переносить устаревшие боковые поля из Figma.
4. Изменения библиотеки проверять в `shared/index.html` и в затронутых прототипах.
5. В разметке для Figma использовать точное имя/ID исходного компонента. Если нужного варианта нет в HTML, фиксировать его как пробел реализации.
