# Repository Guidelines

## Project Structure & Module Organization
- `pages/` contains route-level screens registered in `pages.json`; organize new work by feature, for example `pages/community/` or `pages/service/print/`.
- `components/` holds reusable UI grouped by domain such as `components/helper/`, `components/home/`, and `components/recruit/`.
- `stores/` contains Pinia stores (`stores/app.js`, `stores/user.js`); keep one store file per business area.
- `api/` contains backend adapters and request helpers. Reuse `api/request.js` for authenticated requests and shared 401 retry behavior.
- `static/` stores assets, `utils/` stores helpers, `uni_modules/` stores HBuilderX-managed plugins, and `docs/` stores feature notes and product docs.

## Build, Test, and Development Commands
- `HBuilderX -> 运行 -> 运行到小程序模拟器 -> 微信开发者工具`: start the local WeChat Mini Program preview.
- `HBuilderX -> 发行 -> 小程序-微信`: build a distributable WeChat package.
- `git log --oneline -n 10`: review recent commit scope and wording before committing.
- If a dependency is missing, install it through the HBuilderX plugin market (`uni-scss`, `uni-icons`, `v-tabs`). This repo does **not** use a root `package.json` workflow.

## Coding Style & Naming Conventions
- Match the existing JavaScript/Vue style: 2-space indentation, double quotes, and semicolons.
- Use PascalCase for reusable component files (`LoginForm.vue`, `AIMessage.vue`).
- Keep page entry files route-oriented (`pages/me/index.vue`, `pages/community/detail.vue`).
- Follow existing store and API naming within the file you edit; keep feature modules small and focused.

## Testing Guidelines
- No automated test suite is checked in today. Validate changes through HBuilderX and WeChat Developer Tools.
- Smoke-test routing, login state, and affected API flows after each change, especially for `pages.json`, `api/config.js`, and store updates.
- Include manual verification steps in the PR when changing user-facing flows such as print ordering, schedule lookup, or the AI helper.

## Commit & Pull Request Guidelines
- Follow the commit style already used in history: `feat(PersonInfo): ...`, `style(grade): ...`, `fix(helper): ...`.
- Keep scopes aligned with repo domains like `community`, `helper`, `recruit`, or `service/print`.
- PRs should include a short summary, changed paths, screenshots for UI updates, config notes, and manual test evidence.

## Security & Configuration Tips
- Keep local-only credentials and AppID settings out of git; `manifest.json` is ignored in this repo.
- Review `api/config.js` before release and confirm `CURRENT_ENV`, `BASE_URL`, and `DEV_BASE_URL` are correct.
