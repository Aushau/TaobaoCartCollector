# 淘宝、京东购物车采集器 / Taobao/jingdong CartCollector

采集淘宝/京东购物车商品信息（价格、促销、规格、数量等信息）。
适用于 OpenCode 等 AI 编程助手直接读取并运行。
运行后可要求模型生成数据库或直接开始论证，用以制定购买决策。

## 文件说明

| 文件 | 说明 |
|------|------|
| `cart.js` | 购物车 content script，解析价格/促销/规格/数量 |
| `content.js` | 商品详情页 content script，采集单品信息 |
| `popup.html` | 弹窗 UI（购物车 + 已采集双标签） |
| `popup.js` | 弹窗渲染逻辑（去重、促销标签展示、点击跳转） |
| `manifest.json` | 扩展配置，权限声明 |
