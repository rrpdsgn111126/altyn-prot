# Соответствие Altyn.Base → HTML

Источник: [Altyn.Base, Figma](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/), просмотрено 2026-11-11. Это **частичная кодовая реализация**, а не 1:1 реплика опубликованной Figma-библиотеки. Прямая автоматическая синхронизация не настроена.

При конфликте геометрии экранов действует [mobile-screen-layout.md](./mobile-screen-layout.md), в частности наружный gutter 16 px, gap инпутов 12 px, gap разных групп списков 12 px.

| Реализация | Компонент Figma и ID | Проверенные варианты Figma | Статус HTML |
| --- | --- | --- | --- |
| `AltynBase.createNavbar`, `.ab-navbar` | [navbar](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=3741-4350) `3741:4350` | `State=left/Centr/centr+arrow`, `right icons` | базовые left/center, back/help |
| `AltynBase.createButton`, `.ab-button` | [Button.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2168-7054) `2168:7054` | 90 вариантов: Type=Primary/Secondary/Tertiary; State=Enable/Disabled/Focused/Loading/Pressed; Size=L/M/S; Lable=yes/no | Type, Size, Disabled, Loading; режим icon-only и точная анимация Loading не реализованы |
| `AltynBase.createInput`, `.ab-input` | [Input.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=77-12680) `77:12680` | 14 вариантов: Enable, placeholder, Active/Focus, Filled, Invalid, Invalid+Active, Disabled; secondary Off/on | общий контейнер с рамкой высотой 54px: Enable — label 16px внутри по центру, Enable + placeholder — label 12px сверху и placeholder 16px под ним; Filled, Focus и Invalid используют ту же внутреннюю структуру; иконки/secondary пока не реализованы |
| `physical-upay` `.warning[data-figma-component="Notification"]` | [Notification](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=4228-12406) `4228:12406` | `Type=Yellow` → исходный Component ID `4228:12405`; `Type=Grey` → `4228:12407` | Для предупреждения о доставке в `physical-upay` зафиксирован **Figma Notification/Yellow**, а не самостоятельный HTML-компонент библиотеки; визуальный стиль `.warning` не является эталоном Altyn.Base |
| `AltynBase.createListRow`, `.ab-list-row` | [list.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2015-12843) `2015:12843` | 6 вариантов: Property 1=1/2/3, State=Enable/Disabled; иконки/радио/переключатель | строки с label/value, disabled, переход; сложные слоты отсутствуют |
| `AltynBase.createCheckbox`, `.ab-checkbox-input` | [Checkbox](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2983-17757) `2983:17757` | 72 варианта: Style=Default/Alternative/Positive/Negative; Enabled=Off/On/Mixed; Size=L/M; State=Default/Focused/Disabled | Default / On-Off / L / Focused / Disabled; Mixed и остальные Style не реализованы |

## Группа выбора: реализовано в choices.js / choices.css

| Реализация | Компонент Figma и ID | Варианты | HTML |
| --- | --- | --- | --- |
| `AltynBase.createSwitch` | [Switch.mob](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=3254-14282) `3254:14282` | 20: XL/L/M × On/Off × success/info, с иконкой для XL/L | Семантика `checkbox[role=switch]`, смена состояния, размеры и темы |
| `AltynBase.createRadio` | [RadioButton](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2307-8237) `2307:8237` | 24: Primary/Alternative × Regular/Small × On/Off × Default/Focused/Disabled | Нативный radio, стили, disabled, focus |
| `AltynBase.createRadio({label})` | [RadioButton Label](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2307-8344) `2307:8344` | 24 варианта | Подпись, выбор по клику по label |
| `AltynBase.createRadio({description})` | [Radio Button with Description](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2307-8499) `2307:8499` | Regular/Small | Текст описания с отступом 32px |
| `AltynBase.createToggleButton` | [ToggleButton.mobile](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=2360-8748) `2360:8748` | 36: L/M/S × Enable/Active/Pressed/Focused/Disabled/Loading × Label yes/no | `aria-pressed`, размеры, Active/Disabled/Loading, оригинальная иконка Tile |
| `AltynBase.createToggleBank` | [ToggleBank](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=4545-3398) `4545:3398` | 18: L/M/S × Enable/Active/Pressed/Focused/Disabled/Loading | `aria-pressed`, размеры, локальная банковская иконка, подмена iconSrc |

`createRadioGroup` — **новый HTML-хелпер**, не оригинальный Figma-компонент. Все новые элементы работают без обращения к API. Внешняя идентичность всех 20/24/36/18 Figma-вариантов пока не подтверждена по пикселям; запланирован отдельный визуальный аудит.

## Проверенные визуальные параметры

- `Button.mobile`, Primary / L / Enable: 54 px; radius 12 px; horizontal padding 24 px; Inter 16 Semi Bold; заливка `#FFD119`, текст `#211E1D`.
- Secondary / L / Enable: чёрный `#000000`, текст белый. Tertiary: прозрачный фон, рамка `#B9B7B7`. Disabled у кнопки: opacity 0.4.
- `Input.mobile`, Enable: 54 px; radius 12 px; белый фон, рамка `#E9ECF0`. **Label внутри поля:** пустой Enable — 16/24 px по центру; Focus/Filled/Invalid — 12/16 px с верхним отступом 8 px, значение/placeholder — 16/24 px под ним. Focus — рамка `#FFD119`; Invalid — рамка `#DD4014`, фон `#FFF4F8`. HTML переключает состояние по focus/input/blur, статическая Figma `secondary` пока не реализована.
- `list.mobile`, базовая строка: 54 px; label Inter 12/16, value Inter 16/24; нижний бордер `#E9ECF0`.
- `navbar`: 54 px; боковые поля 16 px; title Inter 18/24 Medium.
- SVG `arrow-back.svg`, `chat.svg`, `check.svg` экспортированы из экземпляров Figma, а не перерисованы вручную.
- В проверенном файле Figma **нет локальных variable collections**, только один локальный text style. Часть визуальных токенов встречается как значения непосредственно в слоях. CSS-токены фиксируют измеренное подмножество и не претендуют на исчерпывающий список.

## Ещё не перенесено

В Altyn.Base также есть `Button vertical.mobile`, `trans_v2.mobile`, `Input-phone.app`, `Tabitem-button`, `tag 1.0`, `pin.mobile`, `Statusbar` и другие компоненты. Их **нельзя считать реализованными** на основании настоящего каталога.

Иконки для будущих компонентов экспортировать в локальные SVG с указанием Figma node ID. Не использовать временные ссылки `/api/mcp/asset/` в коде: они имеют ограниченный срок действия.

## Регламент

1. Для нового сценария взять максимально близкий существующий кодовый компонент.
2. Для незнакомого варианта проверить его в Altyn.Base и отдельно расширить кодовый компонент.
3. Для новой геометрии экрана следовать `mobile-screen-layout.md`, не переносить устаревшие боковые поля из Figma.
4. Изменения библиотеки проверять в `shared/index.html` и в затронутых прототипах.
5. В разметке для Figma использовать точное имя/ID исходного компонента. Если нужного варианта нет в HTML, фиксировать его как пробел реализации.

## Паттерн выбора из списка через Bottom Sheet

Источники Altyn App:
- [14348:114250](https://www.figma.com/design/n9eR5MzhUA8BpvjO9ciYgi/?node-id=14348-114250) — длинный список недоступных стран без поиска
- [17511:164381](https://www.figma.com/design/n9eR5MzhUA8BpvjO9ciYgi/?node-id=17511-164381) — выбор номера без поиска
- [17511:236855](https://www.figma.com/design/n9eR5MzhUA8BpvjO9ciYgi/?node-id=17511-236855) — выбор страны с поиском

**Это составной паттерн, а не отдельный подтверждённый компонент Altyn.Base.** В Altyn App используются `modal` + `Input.mobile` + `list.mobile`. Код: `AltynBase.createSelectField` и `AltynBase.openSelectionSheet` в `shared/select-sheet.js`, стили `shared/select-sheet.css`.

Геометрия Figma: верхняя ручка 56×4 px, хедер в 16 px горизонтальной сетке, строка поиска высотой 54 px с иконкой справа, строки `list.mobile` по 54 px, внутренние поля списка 16 px. При большом количестве результатов скролл находится внутри панели. Поиск конфигурируем, поскольку в двух из трёх референсов отсутствует.

Иконки: `iconSrc` из данных для фактического логотипа банка/сети, `icon` для emoji-флага. При отсутствии специфического изображения используется нейтральная иконка категории; **она не заменяет настоящий логотип сети**. Демо использует локальный `bank.svg` лишь для Сбербанка и generic `network-generic.svg` для других сетей. Иконка поиска `search.svg` экспортирована из Figma (узел `I17511:236855;116:6806;8060:32643;2184:17134`).

Поведение для HTML: открыть панель, поиск по названию/подписи/поисковым словам, пустой результат, выбор с возвратом значения, Escape/backdrop/swipe-down для закрытия без изменения значения, доступные имена и восстановление фокуса. Эти интеракции реализованы как UX-поведение прототипа; макеты сами не доказывают детали закрытия жестом и состояние ошибок API.

## Modal / Bottom Sheet: стилистический контракт

Основной референс — [Altyn App 18443:138108](https://www.figma.com/design/n9eR5MzhUA8BpvjO9ciYgi/?node-id=18443-138108), «Документы для банка». Это **пример композиции**, а не отдельный найденный новый компонент библиотеки Altyn.Base.

| Слой | Правило | Подтверждение |
| --- | --- | --- |
| Поверхность модалки | По умолчанию `bg/neutral/secondary` = `#F6F7F8` | `I18443:138108;904:58155` |
| Список внутри модалки | Отдельный контейнер `bg/neutral/primary` = `#FFFFFF` | `I18443:138108;9844:99726;18443:138110` |
| Углы контейнера списка | 16 px | тот же узел, `cornerRadius=16` |
| Строки списка | `list.mobile`, минимум 54 px; разделитель `#E9ECF0`; внутренние отступы контейнера по 16 px | `I18443:138108;9844:99726;18443:138112` |
| Кнопки в модалке | **`Button.mobile`, `Size=M`**, в референсе Primary 44 px, горизонтальные поля кнопки 16 px | `I18443:138108;940:26954`, свойство `Size=M` |
| Отступ перед кнопочным блоком | 24 px | `I18443:138108;904:60665` |
| Боковые поля содержимого | 16 px | `Pop up` в референсе |
| Handle | 56×4 px | `I18443:138108;904:55529` |

**Оговорка:** `Secondary` — обычное оформление, а не безусловный цвет всех модалок: пример [17511:164381](https://www.figma.com/design/n9eR5MzhUA8BpvjO9ciYgi/?node-id=17511-164381) использует белую поверхность. В HTML `openModal({surface:"primary"})` — явное исключение. Белый список внутри Secondary не означает, что весь лист модалки следует заливать белым.

**HTML-реализация:** `AltynBase.openModal` из `shared/modal.js` + `shared/modal.css`. Использует `AltynBase.createButton({size:"M"})`, для списка композицию `list.mobile` и CSS-токены `--ab-modal-bg-secondary`, `--ab-modal-list-bg`, `--ab-modal-list-radius`. Существующий поисковый `openSelectionSheet` также использует эти токены поверхности (сохраняя радиус списка 12 px, как в его отдельном референсе).

**Статус:** сверены по Figma цвет, размеры M, отступы и радиус. Эквивалентность всех вариантов модалки и всех внутренних состояний не проверена.
