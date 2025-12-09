import theme from "./theme";

describe("MUI Theme Configuration", () => {
  test("theme loads correctly", () => {
    expect(theme).toBeDefined();
    expect(typeof theme).toBe("object");
  });

  test("contains custom breakpoints", () => {
    expect(theme.breakpoints.values).toEqual({
      xs: 0,
      sm: 767,
      md: 999,
      lg: 1239,
      xl: 1440,
      xxl: 1680,
    });
  });

  test("contains typography settings", () => {
    expect(theme.typography.fontSize).toBe(11);
    expect(theme.typography.fontFamily).toContain("DM Sans");
    expect(theme.typography.h1.fontSize).toBe(29);
    expect(theme.typography.body2.fontSize).toBe(14);
  });

  test("contains palette colors", () => {
    expect(theme.palette.primary.main).toBe("#191919");
    expect(theme.palette.blue.main).toBe("#0086ff");
    expect(theme.palette.gray.dark).toBe("#3F3F44");
  });

  test("contains MuiCssBaseline overrides", () => {
    const overrides = theme.components.MuiCssBaseline.styleOverrides.html;

    expect(overrides["& ::-webkit-scrollbar"].width).toBe("8px");
    expect(overrides["& ::-webkit-scrollbar-thumb"].backgroundColor).toBe("#0071FF");
    expect(overrides["::-webkit-scrollbar"].display).toBe("none");
  });
});
