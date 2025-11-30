import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'WorkflowStudio',
  description: 'Build powerful, visual workflows for Laravel with an intuitive drag-and-drop canvas editor. Automate complex business processes without writing code.',
  
  base: '/',
  srcDir: './docs',
  
  ignoreDeadLinks: [
    /^https?:\/\//,  // Ignore external links
    /^mailto:/,      // Ignore mailto links
  ],
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    // Primary SEO Meta Tags
    ['meta', { name: 'keywords', content: 'Laravel, workflow automation, visual workflow builder, drag and drop, workflow engine, automation, Laravel package, React Flow, workflow canvas' }],
    ['meta', { name: 'author', content: 'WorkflowStudio' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    
    // Open Graph / Facebook
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'WorkflowStudio - Visual Workflow Automation for Laravel' }],
    ['meta', { property: 'og:description', content: 'Build powerful, visual workflows for Laravel with an intuitive drag-and-drop canvas editor. Automate complex business processes without writing code.' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://workflowstudio.github.io' }],
    ['meta', { property: 'og:site_name', content: 'WorkflowStudio' }],
    
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'WorkflowStudio - Visual Workflow Automation for Laravel' }],
    ['meta', { name: 'twitter:description', content: 'Build powerful, visual workflows for Laravel with an intuitive drag-and-drop canvas editor.' }],
    ['meta', { name: 'twitter:image', content: '/og-image.png' }],
    
    // Additional SEO
    ['meta', { name: 'application-name', content: 'WorkflowStudio' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'WorkflowStudio' }],
    ['link', { rel: 'canonical', href: 'https://workflowstudio.github.io' }],
  ],

  themeConfig: {
    logo: {
      src: '/logo.svg',
      alt: 'WorkflowStudio'
    },
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/getting-started' },
      { text: 'Support', link: 'mailto:xentixar@gmail.com' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/getting-started' },
        ],
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Node Types', link: '/node-types' },
          { text: 'Triggers', link: '/triggers' },
          { text: 'Conditions', link: '/conditions' },
          { text: 'Actions', link: '/actions' },
          { text: 'Context Variables', link: '/context-variables' },
          { text: 'Conditional Branching', link: '/conditional-branching' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Creating Custom Nodes', link: '/custom-nodes' },
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Authorization', link: '/authorization' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/workflowstudio' },
    ],

    footer: {
      message: 'Released under Proprietary License.',
      copyright: 'Copyright © 2025 WorkflowStudio',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: undefined,
    },
  },
})
