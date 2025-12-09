import { render, screen } from "@testing-library/react";
import MessageAction from "../MessageAction";
import { getDVPNTypeKey } from "../../header/helper";

jest.mock("../../header/helper", () => ({
  getDVPNTypeKey: jest.fn(),
}));

describe("MessageAction Component", () => {
  it("renders nothing when data is empty", () => {
    const { container } = render(<MessageAction data={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders list of actions", () => {
    getDVPNTypeKey.mockReturnValue("TYPE_KEY");

    const mockData = [
      {
        type: "transfer",
        accAddress: "addr123",
        blocknumber: "100",
        nodeAddress: "nodeXYZ",
      },
    ];

    render(<MessageAction data={mockData} />);

    expect(screen.getByText("#TYPE_KEY")).toBeInTheDocument();
    expect(screen.getByText("transfer")).toBeInTheDocument();
    expect(screen.getByText("addr123")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("nodeXYZ")).toBeInTheDocument();
  });

  it("renders fallback '-' for missing fields", () => {
    getDVPNTypeKey.mockReturnValue("KEY");

    const mockData = [{}];

    render(<MessageAction data={mockData} />);

    expect(screen.getByText("#KEY")).toBeInTheDocument();
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });
});
