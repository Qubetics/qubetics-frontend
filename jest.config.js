// jest.config.js
module.exports = {
  testEnvironment: './jest-env.js',
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(svg)$": "<rootDir>/__mocks__/svgMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  roots: ["<rootDir>/src"],
  testMatch: ["**/?(*.)+(test|spec).[jt]s?(x)"],
  testPathIgnorePatterns: [
    "src/components/chart/Chart.test.jsx",
    "src/components/contractDetailTabs/__test__/ContractDtlTabs.test.js",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/components/contractDetailTabs/__test__/ContractDtlTabs.test.js",
    "src/constant/constant.js",
    "src/constant",
    "public/SvgIcons.js",
    "src/components/chart/Chart.test.jsx",
  ],
};
