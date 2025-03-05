module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src/tests"],
    collectCoverage: true,
    coveragePathIgnorePatterns: [
      "<rootDir>/src/server.ts",
      "<rootDir>/src/db.ts",

    ],
  };
  