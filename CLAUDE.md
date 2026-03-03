# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a uni-app based WeChat mini-program called "互成一家" (Campus Life Service), providing campus services for university students including community features, print services, recruitment, campus schedule/grade queries, and an AI assistant.

**Target University**: Neusoft (大连东软信息学院) - The schedule/grade features integrate with Neusoft's academic system via `api/school.js`.

## Development Workflow

**This project uses HBuilderX, not a standard npm-based workflow.**

- **Primary IDE**: HBuilderX
- **Running**: Use HBuilderX menu "运行" -> "运行到小程序模拟器" -> "微信开发者工具"
- **Dependencies**: The project uses `uni_modules` for UI components (uni-ui, uni-icons, uni-scss). Install these via HBuilderX plugin market if missing.
- **No package.json in root**: This is a uni-app project managed by HBuilderX, not a standard Node.js project.

## Key Configuration Files

- `pages.json`: Page routing configuration and tabBar setup. When adding new pages, register them here.
- `api/config.js`: API base URL configuration (`BASE_URL` for production, `DEV_BASE_URL` for development). Set `CURRENT_ENV` to switch environments.
- `manifest.json`: WeChat mini-program AppID configuration (note: may be in project root depending on HBuilderX version)

## Architecture

### State Management (Vuex)

Store modules are **namespaced** and located in `store/modules/`:
- `user` - User info, login state, avatar
- `community` - Community posts, likes
- `recruit` - Job/recruitment listings
- `focus` - Focus/timer functionality
- `task` - Task management
- `address` - User delivery addresses
- `print` - Print service orders
- `helper` - AI assistant state

Pattern when adding store modules:
1. Create file in `store/modules/[name].js` with `namespaced: true`
2. Import and register in `store/index.js`

### API Layer

All API calls are in `api/` directory. The request module (`api/request.js`) provides:
- Automatic token injection via `uni.getStorageSync("token")`
- 401 handling with automatic token refresh using `store.dispatch("user/wechat_login")`
- Request queuing to prevent duplicate login attempts
- Standardized error handling

**Exception**: `api/school.js` uses direct `uni.request()` calls for the Neusoft academic system APIs (grades, schedule). These bypass the request wrapper and don't include authentication tokens.

When adding new API endpoints:
1. Create/update file in `api/[feature].js`
2. Export functions using `request.get()`, `request.post()`, `request.put()`, `request.delete()`
3. Call from store actions or directly in components

### Component Organization

Components are organized by feature:
- `components/community/` - Community related components
- `components/helper/` - AI chat components
- `components/home/` - Homepage components
- `components/login/` - Login flow components
- `components/me/` - User profile components
- `components/recruit/` - Recruitment components
- `components/service/print/` - Print service specific components

### Page Structure

Main tab pages (bottom navigation):
- `pages/home/index` - Home page
- `pages/community/index` - Community feed
- `pages/helper/index` - AI assistant
- `pages/recruit/index` - Job listings
- `pages/me/index` - User profile

Key service pages:
- `pages/service/schedule` - Course schedule query
- `pages/service/grade` - Grade query
- `pages/service/print/index` - Print service

## Adding New Features

1. **Create Page**: Add `.vue` file in `pages/` subdirectory, register in `pages.json`
2. **Create Store Module** (if needed): Add to `store/modules/`, import in `store/index.js`
3. **Create API Module**: Add functions to `api/[feature].js`
4. **Create Components**: Add to `components/[feature]/` if reusable UI needed

## AI Assistant Feature

The AI helper (`pages/helper/index`) uses SiliconFlow API with the Qwen/QwQ-32B model. Configuration is in `api/helper.js`:
- API endpoint: `https://api.siliconflow.cn/v1/chat/completions`
- Model: `Qwen/QwQ-32B`
- System prompt: AI assistant named "答答Novus" for campus services
- Token is stored in `uni.getStorageSync("helperToken")`

The AI supports conversation history management and role-based messaging.

## Important Notes

- **Vue 3**: The project uses Vue 3 (`createSSRApp` in `main.js`). When writing components, check conditional compilation flags (`#ifdef VUE3`) for compatibility.
- **Token storage**: Uses `uni.getStorageSync("token")` and `uni.setStorageSync()`
- **WeChat login flow**: `uni.login()` -> backend `/login/wechat-login` -> store token
- **Image uploads**: Use base64 encoding for avatars. Content moderation is handled via `api/check.js`
- **TabBar pages**: Home, Community, Helper, Recruit, Me (configured in `pages.json`)
- **Environment switching**: Edit `CURRENT_ENV` in `api/config.js` to toggle between `ENV.PROD` and `ENV.DEV`
