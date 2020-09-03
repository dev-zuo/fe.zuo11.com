# ECharts笔记
ECharts，一个使用JS实现的开源可视化库，底层依赖矢量图形库 ZRender, PC、移动端都可以使用，兼容IE8+

[ZRender](https://github.com/ecomfe/zrender)：A lightweight canvas library which providing 2d draw for Apache ECharts (incubating)。ZRender 是二维绘图引擎，它提供 Canvas、SVG、VML 等多种渲染方式。

## echarts特性

- 丰富的可视化类型，且支持图与图混搭
  - 常规：折线图、柱状图、散点图、饼图、K线图
  - 用于统计：盒形图
  - 用于地理数据可视化：地图、热力图、线图
  - 用于关系数据可视化：关系图、treemap、旭日图
  - 用于多维数据可视化：平行坐标
  - 用于BI(Business Intelligence 商业智能)：漏斗图，仪表盘
- 多种数据格式无需转换直接使用
  - 4.0+版本内置 dataset属性，可直接传入二维表、key-value等多种数据源，通过encode可以完成数据到图的映射
  - 多个组件可以共享一份数据而不用克隆，支持大数据量展现，支持 TypedArray 格式数据
- 千万数据的前端展现，且依然能够进行流畅的缩放平移等交互，4.0+版本，提供了对流加载的支持，可使用WebSocket或对数据分块加载，加载多说渲染多少
- 移动端优化，体积更小，可选svg渲染模块，移动端内存占用减小
- 多端渲染，跨平台，支持Canvas、SVG(4.0+)、VML形式的渲染图表
  - VML 可以兼容低版本IE，SVG 使移动端不再为内存担忧，Canvas可以轻松应对大数据量和特效的展示
  - 在node上配合**node-canvas**可以进行高效服务端渲染(SSR)，4.0+开始和微信小程序团队合作，更好的支持小程序
- 深度交互式数据探索，**提供图例(legend [ˈledʒənd])、视觉映射(visualMap)、数据区域缩放(dataZoom)、tooltip、数据刷选(brush区域选择)**等交互组件，可以对数据进行多维度数据筛取、视图缩放、展示细节等交互操作。
- 动态数据(动画展现数据) timeline 组件，可以找到两组数据之间的差异，通过合适的动画去表现数据
- 通过基于WebGL的Echarts GL，绘制三维地球、建筑群、人口分布等3d图
- 支持无障碍访问(4.0+)


## 参数

[ECharts 配置语法](https://www.runoob.com/echarts/echarts-setup.html)