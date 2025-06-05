export {};

declare global {
  interface CommandResult  {
    code: number;
    signal: string;
    output: string;
    success: boolean;
  };
  interface Config {
    playwrightConfig: string;
    ports: string;
    baseUrl: string;
  }
  interface Logger {
    info: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    yellow: (...args: unknown[]) => void;
    green: (...args: unknown[]) => void;
    red: (...args: unknown[]) => void;
    cyan: (...args: unknown[]) => void;
    magenta: (...args: unknown[]) => void;
    blue: (...args: unknown[]) => void;
    gray: (...args: unknown[]) => void;
    bold: (...args: unknown[]) => void;
    dim: (...args: unknown[]) => void;
    underline: (...args: unknown[]) => void;
    italic: (...args: unknown[]) => void;
    warning: (...args: unknown[]) => void;
    success: (...args: unknown[]) => void;
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
    highlight: (text: string) => string;
    success: (text: string) => string;
    error: (text: string) => string;
    warning: (text: string) => string;
    info: (text: string) => string;
    subtle: (text: string) => string;
    emphasis: (text: string) => string;
    filename: (text: string) => string;
    command: (text: string) => string;
    url: (text: string) => string;
  }
}
