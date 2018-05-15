function register(dataReg: any) {
  if (!dataReg) {
    return false;
  }
  return true;
}

let data: any = null;

test("registering test 2", () => {
  expect(register(data)).toBe(true);
});
