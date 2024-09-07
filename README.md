# pdf2html

最简单的使用nest+puppeteer 服务端生成pdf.

1. pdf内容可复制，清晰度高
2. 简单方便,快捷
3. 可以自定义页头、页脚
4. 无需用户操作浏览器的打印，和修改参数

## 项目介绍

使用puppeneer+nest，跑demo:

```
npm i
npm start
```

访问 http://localhost:3000/

代码在 pdf 模块里面

## 市面上有几种生成pdf的方案，逐一对比：

### vs 直接调用浏览器打印预览，另存为pdf

优点：最原始，最方便

缺点：

1. 用户浏览器不可控，打印出来的内容可能不一致
2. 有些用户不知道如何操作，还有一些设置
3. 无法自定义很多内容

### vs html2canvas + jspdf

利用先把html生成图片，然后拼接。

缺点：

1. 分页很难计算，特别是复杂表格，很容易图片或文字从中间被切断
2. 长table如果超过一页，第二页没有表头，阅读不友好
3. 因为是图片所有不能复制文字，并且分辨率低
4. 速度慢

### vs pdfmake

缺点：

1. 文档生成配置，写法繁琐
2. 配合`html-to-pdfmake`库，直接传入html转换。但还是需要修改部分配置
3. 长table如果超过一页，第二页没有表头，阅读不友好

### vs [bookjs-eazy](https://gitee.com/wuxue107/bookjs-eazy)

缺点：

1. todo

### 另外：和pdf相关，前端需要注意什么

- 调整部分盒子的尺寸，比如img

  ```
  // 设置页面样式，控制图片不超出页面
  await page.addStyleTag({
      content: `
      img { max-width: 100%; height: auto; }
      `
  });
  ```

- 自动缩放图片以适应页面

  ```
  await page.addStyleTag({
  content: `
    img {
      max-width: 100%;
      page-break-inside: avoid; /* 避免图片跨页 */
      height: auto;
    }
  `
  });
  ```

- 图片分页策略
  ```
  await page.addStyleTag({
  content: `
      img {
      max-width: 100%;
      height: auto;
      page-break-before: auto; /* 自动调整分页 */
      }
  `
  });
  ```
- 需要了解和学习部分css对打印的影响
  `@media print` `@media print`

  `page-break-before: always;` 元素之前强制换页

  `page-break-after: always;` 元素之后强制换页

  `page-break-inside: avoid;` 避免元素内换页，常用于表格和段落

- 背景色打印 如果不打印可以单独设置

  ```
  @media print {
    body {
        background-color: white;  /* 确保背景颜色打印 */
    }
  }
  ```

- 字体大小和单位：pt, em, cm
- 避免浮动：float，有时会错位。
- 打印时可以单独用js控制部分css已达到显示效果

- 有的内容横屏打印，有的内容竖屏，怎么办

可以通过一些技巧让第一页横屏打印，第二页竖屏打印。一个常用的办法是将内容分成两部分进行两次 PDF 生成，分别设置不同的页面方向，然后合并成一个 PDF 文件。
使用 `pdf-merger-js`库来合成
