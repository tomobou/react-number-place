import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NumberSelector } from "./NumberSelector";

describe("NumberSelector Component", () => {
  test("should render 10 buttons (0-9 equivalent)", () => {
    const mockClick = jest.fn();
    render(<NumberSelector selectValue=" " onClick={mockClick} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(10);
  });

  test("should have first button selected when selectValue is empty", () => {
    const mockClick = jest.fn();
    render(<NumberSelector selectValue=" " onClick={mockClick} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveClass("selected");
  });

  test("should have corresponding button selected for number", () => {
    const mockClick = jest.fn();
    render(<NumberSelector selectValue="5" onClick={mockClick} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons[5]).toHaveClass("selected");
  });

  test("should call onClick with correct value when clicked", () => {
    const mockClick = jest.fn();
    render(<NumberSelector selectValue=" " onClick={mockClick} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[3]);

    expect(mockClick).toHaveBeenCalledWith("3");
  });

  test("should call onClick with space for first button", () => {
    const mockClick = jest.fn();
    render(<NumberSelector selectValue=" " onClick={mockClick} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(mockClick).toHaveBeenCalledWith(" ");
  });

  test("should highlight first button for invalid select value", () => {
    const mockClick = jest.fn();
    const { rerender } = render(
      <NumberSelector selectValue="10" onClick={mockClick} />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveClass("selected");

    rerender(<NumberSelector selectValue="abc" onClick={mockClick} />);
    const updatedButtons = screen.getAllByRole("button");
    expect(updatedButtons[0]).toHaveClass("selected");
  });

  test("should update selected button when selectValue changes", () => {
    const mockClick = jest.fn();
    const { rerender } = render(
      <NumberSelector selectValue="2" onClick={mockClick} />,
    );

    let buttons = screen.getAllByRole("button");
    expect(buttons[2]).toHaveClass("selected");

    rerender(<NumberSelector selectValue="7" onClick={mockClick} />);
    buttons = screen.getAllByRole("button");
    expect(buttons[7]).toHaveClass("selected");
  });

  test("should trigger onClick for each number button", () => {
    const mockClick = jest.fn();
    render(<NumberSelector selectValue=" " onClick={mockClick} />);

    const buttons = screen.getAllByRole("button");
    for (let i = 0; i < buttons.length; i++) {
      fireEvent.click(buttons[i]);
      expect(mockClick).toHaveBeenCalledTimes(i + 1);
    }
  });

  test("should handle numeric string selectValue", () => {
    const mockClick = jest.fn();
    const { rerender } = render(
      <NumberSelector selectValue="1" onClick={mockClick} />,
    );

    let buttons = screen.getAllByRole("button");
    expect(buttons[1]).toHaveClass("selected");

    rerender(<NumberSelector selectValue="9" onClick={mockClick} />);
    buttons = screen.getAllByRole("button");
    expect(buttons[9]).toHaveClass("selected");
  });

  test("should call onClick with correct string values for all buttons", () => {
    const mockClick = jest.fn();
    const expectedValues = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    render(<NumberSelector selectValue=" " onClick={mockClick} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button, index) => {
      fireEvent.click(button);
      expect(mockClick).toHaveBeenCalledWith(expectedValues[index]);
    });
  });

  test("should only have one selected button at a time", () => {
    const mockClick = jest.fn();
    const { rerender } = render(
      <NumberSelector selectValue="3" onClick={mockClick} />,
    );

    let buttons = screen.getAllByRole("button");
    let selectedCount = Array.from(buttons).filter((btn) =>
      btn.className.includes("selected"),
    ).length;
    expect(selectedCount).toBe(1);

    rerender(<NumberSelector selectValue="7" onClick={mockClick} />);
    buttons = screen.getAllByRole("button");
    selectedCount = Array.from(buttons).filter((btn) =>
      btn.className.includes("selected"),
    ).length;
    expect(selectedCount).toBe(1);
  });

  test("should handle all 10 values correctly", () => {
    const mockClick = jest.fn();
    const values = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    values.forEach((value, index) => {
      const { unmount } = render(
        <NumberSelector selectValue={value} onClick={mockClick} />,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[index]).toHaveClass("selected");
      unmount();
    });
  });

  test("should handle prop updates immediately", () => {
    const mockClick = jest.fn();
    const { rerender } = render(
      <NumberSelector selectValue="1" onClick={mockClick} />,
    );

    expect(screen.getAllByRole("button")[1]).toHaveClass("selected");

    rerender(<NumberSelector selectValue="5" onClick={mockClick} />);
    expect(screen.getAllByRole("button")[5]).toHaveClass("selected");

    rerender(<NumberSelector selectValue="9" onClick={mockClick} />);
    expect(screen.getAllByRole("button")[9]).toHaveClass("selected");
  });
});
