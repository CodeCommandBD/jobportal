
if (typeof global !== 'undefined') {
  try {
    if (!global.localStorage || typeof global.localStorage.getItem !== 'function') {
      const mockStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).localStorage = mockStorage;
      console.log('localStorage polyfill applied');
    }
  } catch (e) {
    console.error('Failed to polyfill localStorage', e);
  }
}
