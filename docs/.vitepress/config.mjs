import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "GasOrange API 文档",
  description: "GasOrange 大模型中转平台 API 文档",
  lang: 'zh-CN',

  // GitHub Pages 部署配置
  // 注意：请将 '/czy/' 替换为你的仓库名称，例如 '/your-repo-name/'
  base: '/docs/',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    nav: [
      { text: '文档首页', link: '/' },
      { text: '快速开始', link: '/kaishi' },
      { text: 'API 文档', link: '/api/text' },
    ],

    sidebar: {
      '/': [
        {
          text: '快速开始',
          items: [
            { text: '快速接入', link: '/kaishi' },
            { text: '客户端配置(教程)', link: '/guide/client' }
          ]
        },
        {
          text: 'API 文档',
          items: [
            { text: '文本模型', link: '/api/text' },
            { text: '图片模型', link: '/api/image' },
            { text: '视频模型', link: '/api/video' },
          ]
        },
        {
          text: '其他',
          items: [
            { text: '计费说明', link: '/guide/billing' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-username/czy' }
    ],

    footer: {
      message: 'GasOrange API 文档',
      copyright: 'Copyright © 2025 GasOrange'
    },

    // 搜索配置
    search: {
      provider: 'local'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/your-username/czy/edit/main/docs/:path'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    // 文档翻页
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 大纲标题
    outline: {
      label: '页面导航'
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 侧边栏菜单标题
    sidebarMenuLabel: '菜单',

    // 深色模式切换
    darkModeSwitchLabel: '主题',

    // 语言标签
    langMenuLabel: '语言'
  }
})
