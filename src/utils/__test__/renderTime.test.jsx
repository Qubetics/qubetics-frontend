import { renderTime, convertToDateTime, formatDate } from "../renderTime";
import moment from "moment";
import { format } from "date-fns";

const MOCK_NOW = new Date("2024-01-01T12:00:00Z").getTime();
jest.spyOn(Date, "now").mockImplementation(() => MOCK_NOW);

describe("renderTime()", () => {
  test("returns seconds ago when < 60 seconds", () => {
    const input = MOCK_NOW - 20 * 1000; 
    expect(renderTime(input)).toBe("20s ago");
  });

  test("returns minutes ago when < 1 hour", () => {
    const input = MOCK_NOW - 5 * 60 * 1000; 
    expect(renderTime(input)).toBe("5m ago");
  });

  test("returns hours ago when < 24 hours", () => {
    const input = MOCK_NOW - 2 * 3600 * 1000; 
    expect(renderTime(input)).toBe("2h ago");
  });

  test("returns days ago when < 30 days", () => {
    const input = MOCK_NOW - 3 * 86400 * 1000; 
    expect(renderTime(input)).toBe("3d ago");
  });

  test("returns moment().fromNow() for older dates", () => {
    const input = MOCK_NOW - 40 * 86400 * 1000;
    expect(renderTime(input)).toBe(moment(input).fromNow());
  });

  test("handles timestamp passed as string", () => {
    const input = String(MOCK_NOW - 10 * 1000);
    expect(renderTime(input)).toBe("10s ago");
  });
});

describe("convertToDateTime()", () => {
  test("returns '-' when date is missing", () => {
    expect(convertToDateTime(null)).toBe("-");
  });

  test("formats valid date correctly", () => {
    const formatted = convertToDateTime("2024-01-01T10:00:00Z");
    expect(formatted).toBe(moment(new Date("2024-01-01T10:00:00Z")).format("MMM, D, YYYY, HH:mm"));
  });

  test("handles timestamp string", () => {
    const ts = MOCK_NOW;
    const formatted = convertToDateTime(String(ts));
    expect(formatted).toBe(moment(ts).format("MMM, D, YYYY, HH:mm"));
  });
});

describe("formatDate()", () => {
  test("correctly formats date using date-fns", () => {
    const input = "2024-01-01T12:00:00Z";
    const output = format(new Date(input), "MMM do yyyy, HH:mm:ss");
    expect(formatDate(input)).toBe(output);
  });
});
