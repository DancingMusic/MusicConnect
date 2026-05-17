# OpenSpec: MusicConnect

- Spec-ID: `music-connect-openspec`
- Version: `1.0.0`
- Status: `Active`
- Last-Updated: `2026-05-17`

## Scope

定义音乐数据源连接器项目的边界、连接器开发规范和发布策略。

## 当前状态

- 包名：`@dancingmusic/music-connect`
- 版本：`v0.1.0`
- 已实现连接器：网易云音乐（`netease-cloud-music`）
- 依赖：`@dancingmusic/music-store-sdk >=0.1.0`（peer dependency）

## 角色定义

MusicConnect 是 MusicStoreSdk 的**数据源适配层**：
- 实现 `MusicConnector` 接口（定义在 MusicStoreSdk 中）
- 每个连接器适配一个音乐平台的 API
- 通过 `MusicConnectorRegistry` 注册到 `MusicStoreClient`

## 连接器开发规范

### 目录结构

```
src/connectors/<connector-name>/
  ├── index.ts       — 连接器主类，实现 MusicConnector 接口
  ├── api.ts         — 平台 API 封装
  └── *.ts           — 辅助模块（解析器等）
```

### 必须实现

- `meta` — 连接器元信息（id、name、version、capabilities）
- `search(query)` — 搜索曲目
- `getTrack(trackId)` — 获取曲目详情
- `getStreamUrl(trackId)` — 获取播放流地址

### 可选实现

- `getLyrics(trackId)` — 获取歌词（含翻译、时间轴）
- `init(config)` — 初始化配置
- `dispose()` — 资源清理

### ID 命名规范

连接器返回的 trackId 必须带平台前缀：`<platform>:<id>`，例如 `netease:123456`。

## MUST

- 独立可构建：`npm run build` 无需宿主环境。
- 每个连接器独立导出：`@dancingmusic/music-connect/netease`。
- peer 依赖 MusicStoreSdk，不内联其类型。
- 维护文档站 `docs/index.html`。

## MUST NOT

- 直接依赖宿主应用（DancingMusic）代码。
- 在连接器中硬编码用户凭证。
- 绕过 MusicConnector 接口添加非标准方法。

## Release

1. 更新 changelog / README。
2. Run `npm run typecheck && npm run build`。
3. 更新 `docs/index.html` 中的版本号。
4. 发布版本标签和包。
