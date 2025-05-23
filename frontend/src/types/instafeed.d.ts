interface InstafeedOptions {
  accessToken: string;
  target?: HTMLElement | string;
  template?: string;
  limit?: number;
  transform?: (item: any) => any;
  filter?: (item: any) => boolean;
  sort?: (a: any, b: any) => number;
  after?: (data: any) => void;
  error?: (error: Error) => void;
  success?: (data: any) => void;
  before?: () => void;
  resolution?: 'thumbnail' | 'low_resolution' | 'standard_resolution';
}

declare class Instafeed {
  constructor(options: InstafeedOptions);
  run(): void;
}

interface Window {
  Instafeed: typeof Instafeed;
  instgrm?: {
    Embeds: {
      process(): void;
    }
  }
}