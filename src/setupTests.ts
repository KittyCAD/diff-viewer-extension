// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// From https://github.com/primer/react/blob/5dd4bb1f7f92647197160298fc1f521b23b4823b/src/utils/test-helpers.tsx#L12
global.CSS = {
  escape: jest.fn(),
  supports: jest.fn().mockImplementation(() => {
    return false
  }),
}

global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
  },
  storage: {
    local: {
      set: jest.fn(),
      get: jest.fn(),
    }
  }
}
