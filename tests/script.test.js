const { convertCToF } = require("../site/script.js");

test("0 Celsius converts to 32 Fahrenheit", () => {
  expect(convertCToF(0)).toBe(32);
});

test("100 Celsius converts to 212 Fahrenheit", () => {
  expect(convertCToF(100)).toBe(212);
});

test("negative Celsius values convert correctly", () => {
  expect(convertCToF(-40)).toBe(-40);
});
