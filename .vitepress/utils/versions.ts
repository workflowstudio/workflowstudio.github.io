export interface Version {
  version: string
  label: string
  path: string
  status: 'current' | 'deprecated' | 'archived'
}

export const versions: Version[] = [
  {
    version: '1.0',
    label: 'v1.0 (Current)',
    path: '/',
    status: 'current',
  },
]

export const defaultVersion = '1.0'

export function getVersionByPath(path: string): Version | null {
  if (path.startsWith('/v')) {
    const match = path.match(/^\/v(\d+\.\d+)/)
    if (match) {
      return versions.find(v => v.version === match[1]) || null
    }
  }
  return versions.find(v => v.status === 'current') || versions[0]
}

export function getVersionPath(version: string, currentPath: string): string {
  const versionObj = versions.find(v => v.version === version)
  if (!versionObj) return currentPath

  if (versionObj.path === '/') {
    return currentPath.replace(/^\/v\d+\.\d+/, '') || '/getting-started'
  }

  const basePath = currentPath.replace(/^\/v\d+\.\d+/, '') || '/getting-started'
  return `/v${version}${basePath}`
}

