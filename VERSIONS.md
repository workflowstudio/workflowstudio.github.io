# Version Management

This documentation site supports multiple versions of WorkflowStudio.

## Current Versions

- **v1.0** (Current) - Latest stable version

## Adding a New Version

When releasing a new version:

1. **Update `.vitepress/utils/versions.ts`**:
   ```typescript
   export const versions: Version[] = [
     {
       version: '2.0',
       label: 'v2.0 (Current)',
       path: '/',
       status: 'current',
     },
     {
       version: '1.0',
       label: 'v1.0',
       path: '/v1.0',
       status: 'archived',
     },
   ]
   ```

2. **Create version-specific docs** (if needed):
   - Create folder: `docs/v{version}/`
   - Copy current docs to the new version folder
   - Update links in version-specific docs

3. **Update navigation**:
   - The nav will automatically update based on `versions.ts`
   - Version dropdown in nav bar will show all versions

4. **Update this file** with the new version information

## Version Structure

```
docs/
  ├── getting-started.md      # Current version (v1.0)
  ├── triggers.md
  ├── actions.md
  ├── conditions.md
  ├── context-variables.md
  ├── custom-nodes.md
  └── v1.0/                   # Archived version docs (optional)
      ├── getting-started.md
      └── ...
```

## Version Selector

The version selector appears in the navigation bar as a dropdown menu and allows users to switch between different documentation versions. It automatically detects the current version based on the URL path.

## Version Status

- **current**: Active, maintained version (shown as default)
- **deprecated**: Still available but not recommended
- **archived**: Old version, read-only

## Configuration Files

- `.vitepress/utils/versions.ts` - Version definitions (single source of truth)
- `.vitepress/config.mts` - VitePress config (auto-updates from versions.ts)
- `VERSIONS.md` - This file (documentation)

## How It Works

1. All versions are defined in `.vitepress/utils/versions.ts`
2. The navigation bar automatically generates a version dropdown from the versions array
3. The current version is determined by the `status: 'current'` field
4. Version paths are automatically generated based on the `path` field in each version object
