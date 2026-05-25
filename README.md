# 购物车采集器 / TaobaoCartCollector

Chrome 扩展，采集淘宝/天猫/京东购物车商品信息（价格、促销标签、规格、数量）。

**⚠️ 注意：此扩展代码已编写但未经实际加载和测试。** 所有购物车数据的采集是通过 [browser-harness](https://github.com/browser-use/browser-harness)（CDP 直连 Chrome）完成的，不是在扩展中实现的。

## 安装

1. Chrome 打开 `chrome://extensions`
2. 开启"开发者模式"
3. "加载已解压的扩展程序"，选择本项目目录

## 文件说明

| 文件 | 说明 |
|------|------|
| `cart.js` | 购物车 content script，解析价格/促销/规格/数量 |
| `content.js` | 商品详情页 content script，采集单品信息 |
| `popup.html` | 弹窗 UI（购物车 + 已采集双标签） |
| `popup.js` | 弹窗渲染逻辑（去重、促销标签展示、点击跳转） |
| `manifest.json` | 扩展配置，权限声明 |

## 数据来源

本项目仅提供扩展源码，不包含任何购物车数据。数据采集通过外部工具（browser-harness）直接操作浏览器完成。
