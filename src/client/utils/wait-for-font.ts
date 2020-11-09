const waitForFont = (fontName: string, timeout = 5000) => new Promise((resolve) => {
  if (!document?.fonts?.addEventListener) {
    resolve(true);
  }

  const testString = `1em ${fontName}`;

  if (document.fonts.check(testString)) {
    resolve(true);
    return;
  }

  // Held as re-assignable variable to allow cancel in two places
  let fallbackTimeout: number;

  const handler = () => {
    if (document.fonts.check(testString)) {
      resolve(true);
      clearTimeout(fallbackTimeout);
      document.fonts.removeEventListener('loadingdone', handler);
    }
  };

  document.fonts.addEventListener('loadingdone', handler);

  fallbackTimeout = setTimeout(() => {
    resolve(false);
    document.fonts.removeEventListener('loadingdone', handler);
  }, timeout);
});

export default waitForFont;
