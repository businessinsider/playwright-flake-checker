export {};

declare global {
  interface CommandResult  {
    code: number;
    signal: string;
    output: string;
    success: boolean;
  }
  interface Config {
    playwrightConfig: string;
    ports: string;
    baseUrl: string;
    baseUrls: string[];
    startServersSeparately: boolean;
  }
  interface Logger {
    info: (..._args: unknown[]) => void;
    error: (..._args: unknown[]) => void;
    yellow: (..._args: unknown[]) => void;
    green: (..._args: unknown[]) => void;
    red: (..._args: unknown[]) => void;
    cyan: (..._args: unknown[]) => void;
    magenta: (..._args: unknown[]) => void;
    blue: (..._args: unknown[]) => void;
    gray: (..._args: unknown[]) => void;
    bold: (..._args: unknown[]) => void;
    dim: (..._args: unknown[]) => void;
    underline: (..._args: unknown[]) => void;
    italic: (..._args: unknown[]) => void;
    warning: (..._args: unknown[]) => void;
    success: (..._args: unknown[]) => void;
  }
  interface PackageJson {
    name: string;
    scripts: { [key: string]: string };
  }
  interface ServerOptions {
    buildOnly?: boolean;
    mode?: 'default' | 'custom' | 'scripts';
  }
  interface SpecOption {
    name: string;
    value: string;
  }
  interface Styled {
    highlight: (_text: string) => string;
    success: (_text: string) => string;
    error: (_text: string) => string;
    warning: (_text: string) => string;
    info: (_text: string) => string;
    subtle: (_text: string) => string;
    emphasis: (_text: string) => string;
    filename: (_text: string) => string;
    command: (_text: string) => string;
    url: (_text: string) => string;
  }
}
