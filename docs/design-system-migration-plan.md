# План переноса Altyn.Base → shared HTML

Источник: [Altyn.Base](https://www.figma.com/design/eZfU7lRRxu3GYH2S2KRgMy/?node-id=58-7058), аудит 2026-11-11.
Цель: независимая от Figma библиотека HTML/CSS/JS для интерактивных прототипов. Figma остаётся источником истины для внешнего вида. [Спецификация каркаса](./mobile-screen-layout.md) имеет приоритет в вопросах компоновки.

## Очередность

| Очередь | Область | Исходные страницы/группы | Состояние |
| --- | --- | --- | --- |
| 1 | Базовые: navbar, Button.mobile, Input.mobile, list.mobile, Checkbox | navbar, button, Input, list, checkbox | Частичная реализация, не все варианты |
| 2 | Выбор: Switch.mob, RadioButton, RadioButton Label, Radio Button with Description, ToggleButton.mobile, ToggleBank | switch, radio, toggle | Основные состояния + размерные варианты перенесены в choices.js / choices.css |
| 3 | Расширенные формы: Input-phone.app, select-code, Helper text / S, Link | input-phone, Input, link | Не начато |
| 4 | Навигация: Tabs, Tabitem-button, TabBar / Item, TabBar / Center, Step, Wizard | tab, tabbar, steps | Не начато |
| 5 | Состояния: tag 1.0, Badge, Notification, Spinner.mobile, verification.mobile | tag, Notification, loader, verification | Не начато |
| 6 | Транзакции: trans.mobile, trans_v2.mobile, multilist.mobile | list | Не начато |
| 7 | Специализированные: pin.mobile, Keyboard, Answer.mobile, Message input, rate.mobile, File view и остальное | pin, PIN keyboard, chat | Не начато |
| 8 | Полнота: аудит всех вариантов, иконок, типографики, визуальная сверка, регрессия | Все страницы | Не начато |

Приоритет внутри группы: по частоте использования в прототипах и зависимости от других компонентов. Наличие Figma Component Set не означает автоматического переноса: каждое состояние требует реализации и проверки в браузере.

## Acceptance criteria для каждой группы

1. Для каждого элемента зафиксированы точное имя, исходный Figma ID и допустимые свойства; составные HTML-утилиты отдельно обозначены как *не Figma-компоненты*.
2. Внешний вид и размеры сопоставлены с активными Figma-вариантами; ресурсы сохранены локально, отсутствуют временные Figma URL.
3. Состояния On/Off, Active, Disabled, Focus, Loading и ошибки там, где предусмотрены, работают как продуктовые состояния, не только как графика.
4. Управление мышью и клавиатурой, доступные имена, семантические input/button, события onChange.
5. Функциональная витрина, автоматизированные проверки, widths 375/390 px; нет горизонтального overflow.
6. Существующие HTML-прототипы не изменены, GitHub Pages развернул нужную версию, публичный URL открывает витрину.

## Пробелы этой итерации

- Switch.mob: 20 Figma-вариантов, перенесены XL/L/M, checked, success/info, icon для XL/L. Disabled — дополнительное нативное HTML-состояние (не отдельный вариант Figma).
- RadioButton: 24 Figma-варианта, перенесены Primary/Alternative, Regular/Small, On/Off, Disabled, Focus. Для RadioButton Label (24 варианта) и Radio Button with Description (2 размера) создано единое составное `createRadio`; точные декоративные Shape-слои из Figma не экспортированы: CSS-реконструкция, визуальное совпадение требуется проверить.
- ToggleButton.mobile: 36 Figma-вариантов, код содержит L/M/S, Active, Focus, Disabled, Loading, icon yes/no. Pressed реализован CSS `:active`; механика группового exclusive selection не определена Figma и остаётся на уровне сценария.
- ToggleBank: 18 вариантов, код содержит L/M/S, Active, Focus, Disabled, Loading, иконку исходного банковского примера с возможностью подмены `iconSrc`.
- Отличающиеся дизайнерские состояния на уровне пикселя, все icon swaps и вариации иконок ещё требуют визуального аудита. Статус этапа 2 — *функциональное подмножество*, не завершённый 1:1 порт.

## Не нарушать

- Текущий `physical-upay/index.html` остаётся самостоятельным, без импортов новой библиотеки до отдельной задачи миграции.
- Файлы `docs/mobile-screen-layout.md` и существующая UI-логика не переписываются.
- `shared/components.js` остаётся совместимым; новая функциональность загружается последовательно через `shared/choices.js`.
