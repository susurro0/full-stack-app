

module.exports = {
  preset: "ts-jest",           
  testEnvironment: "jsdom",    
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", 
  },
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "<rootDir>/src/index.tsx",
  ]
};



