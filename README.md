# WorkflowStudio Documentation

Professional documentation site built with [VitePress](https://vitepress.dev/).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## 📝 Documentation

All documentation files are in the `docs/` directory. They are written in Markdown and automatically converted to beautiful documentation pages.

## 🎨 Customization

- **Configuration**: Edit `.vitepress/config.mts`
- **Homepage**: Edit `docs/index.md`
- **Styling**: Edit `.vitepress/theme/index.ts`

## 📦 Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when you push to the `main` branch.

### Manual Deployment

```bash
npm run docs:build
# Then deploy the docs/.vitepress/dist folder
```

## 🌐 Site URL

Once deployed, the site will be available at:
**https://workflowstudio.github.io**

## 📚 Learn More

- [VitePress Documentation](https://vitepress.dev/)
- [VitePress Guide](https://vitepress.dev/guide/getting-started)

