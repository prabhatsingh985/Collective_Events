declare module 'bwip-js' {
  export interface ToBufferOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    width?: number;
    includetext?: boolean;
    textxalign?: 'left' | 'center' | 'right' | 'off';
    [key: string]: any;
  }

  export interface ToSvgOptions extends ToBufferOptions {}

  export function toBuffer(opts: ToBufferOptions): Promise<Buffer>;
  export function toSVG(opts: ToSvgOptions): Promise<string>;
  export function loadFont(fontName: string, size: number, fontFile: string): void;
}
