// For importing css files
declare module CSSModule {
  declare var exports: { [key: string]: string };
}

// For using module.hot
declare var module: {
  hot: {
    accept(path: string, callback: () => void): void,
  },
};

declare module immutable {
  declare var exports: any;
}
