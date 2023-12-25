import type { Theme as InsdTheme } from '@insd47/library';

declare module '@emotion/react' {
  export interface Theme extends InsdTheme {}
}