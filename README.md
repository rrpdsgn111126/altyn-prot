# Altyn UI — прототипы и адаптация Figma

Проект поддерживает **два режима**:

1. **Создание нового сценария:** требования/API → интерактивный HTML-прототип из `shared/` → Playwright → GitHub Pages → согласование UX → редактируемая Figma на Altyn.Base.
2. **Адаптация готовых экранов:** веб- или Figma-макеты другой системы → анализ → реальные компоненты Altyn.Base → новая секция в Figma → проверка.

**Единый навык:** [`.agents/skills/altyn-ui/SKILL.md`](.agents/skills/altyn-ui/SKILL.md). В новом чате Work прямо просите прочитать этот путь: наличие навыка в GitHub само по себе не гарантирует его автоматическую загрузку.

## Источники и назначение файлов

| Файл | Что в нём хранится |
| --- | --- |
| [`docs/mobile-screen-layout.md`](docs/mobile-screen-layout.md) | **Единственный источник общих** правил экранов, отступов, Input.mobile, списков, Bottom Sheet, селекторов и композиции |
| [`docs/ux-writing-guidelines.md`](docs/ux-writing-guidelines.md) | Правила текстов и терминологии |
| [`shared/README.md`](shared/README.md) | Технический API HTML-библиотеки, соответствия Figma ↔ HTML, поддержанные варианты и пробелы реализации |
| [`physical-upay/figma-mapping.json`](physical-upay/figma-mapping.json) | Данные и решения сценария Physical Upay |
| [`migrations/chbr/figma-mapping.json`](migrations/chbr/figma-mapping.json) | Разметка и результаты адаптации ЧБР |
| [`figma-migration-review/`](figma-migration-review/) | Визуальный просмотр ЧБР до утверждения UX |

**Правило:** не повторять параметры одного компонента в нескольких документах. `shared/` — частичная реализация в HTML, **не** визуальный эталон; Figma Altyn.Base задаёт оригинальные компоненты и варианты. Сценарные референсы и исключения сохранять только в mapping соответствующей задачи, не в общей инструкции.

Не создавать отдельные MD-файлы и навыки на каждый сценарий. JSON нужен только там, где сохраняются сложные связи элементов, состояния, Node ID или решения переноса.

## Код и проверка

- HTML UI kit: [`shared/index.html`](shared/index.html), API: [`shared/README.md`](shared/README.md).
- Прототип: [`physical-upay/index.html`](physical-upay/index.html).
- Публикация: [`.github/workflows/pages.yml`](.github/workflows/pages.yml) и корневой [`index.html`](index.html).
- Для HTML: **Playwright + Chromium**, сценарии/JS/ресурсы, ширины **390/1440 px**, проверка публичного URL GitHub Pages.
- Для Figma: оригинальные связанные instances, variants, Auto Layout, Typography, иконки, клиппинг, визуальное сравнение с референсом. Исходные макеты не трогать без явного задания.
