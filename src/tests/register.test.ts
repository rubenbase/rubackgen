function sum(a: any, b: any) {
  return a + b;
}

test("registering test", () => {
  expect(sum(1, 2)).toBe(3);
});
