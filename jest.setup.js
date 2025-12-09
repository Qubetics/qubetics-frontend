import '@testing-library/jest-dom';

// Suppress all console output during tests
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug,
};

// Mock console methods to suppress output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn((...args) => {
    // Filter out JSDOM "Not implemented" errors
    const errorString = args.join(' ');
    if (
      errorString.includes('Not implemented') ||
      errorString.includes('Error: Not implemented') ||
      errorString.includes('jsdom')
    ) {
      return; // Suppress these errors
    }
    // Uncomment below to see other errors during debugging
    // originalConsole.error(...args);
  }),
  info: jest.fn(),
  debug: jest.fn(),
};

// Setup window.location mock to be configurable in tests
delete window.location;

// Create a mock location object with proper href getter/setter
const locationMock = {
  origin: 'http://localhost',
  protocol: 'http:',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
  toString: jest.fn(() => 'http://localhost/'),
};

// Add href as a writable property
Object.defineProperty(locationMock, 'href', {
  writable: true,
  value: 'http://localhost/',
});

window.location = locationMock;

// Make navigator.userAgent configurable for testing
Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  configurable: true,
  value: navigator.userAgent,
});

// Mock window.matchMedia for Antd responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
