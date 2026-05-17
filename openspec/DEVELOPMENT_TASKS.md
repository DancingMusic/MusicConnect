# MusicConnect Tasks

- Last-Updated: `2026-05-17`

## Milestone A — 项目初始化与首个连接器 ✅

- [x] 项目结构搭建（package.json、tsconfig、openspec、docs）
- [x] 网易云音乐连接器实现
  - [x] 搜索（cloudsearch API）
  - [x] 曲目详情（song/detail API）
  - [x] 播放流地址（song/url API）
  - [x] 歌词获取与解析（LRC 格式 + 翻译合并）
- [x] MusicStoreSdk 连接器接口设计（`MusicConnector`、`MusicConnectorRegistry`）
- [x] 文档站 `docs/index.html`

## Milestone B — 质量与扩展

- [ ] 添加单测覆盖网易云连接器核心流程
- [ ] 错误处理增强（API 限流、网络重试、鉴权失败）
- [ ] 添加连接器配置校验
- [ ] 支持网易云登录态（cookie/token）以获取 VIP 音质

## Milestone C — 更多连接器

- [ ] QQ 音乐连接器
- [ ] Spotify 连接器
- [ ] 本地文件系统连接器（扫描本地音乐库）
- [ ] 自定义 API 连接器（用户自建后端）

## Milestone D — 生态

- [ ] 连接器开发模板（`create-music-connector` 脚手架）
- [ ] 连接器测试工具（mock API + 标准测试套件）
- [ ] 连接器性能基准测试
