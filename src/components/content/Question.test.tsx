import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { Question } from "@/components/content/Question";
import type { GeneratedQuestion } from "@/lib/types";

function sampleQuestion(overrides: Partial<GeneratedQuestion> = {}): GeneratedQuestion {
  return {
    id: "q_test",
    createdAt: 1,
    section: "Quant",
    type: "QuantMCQ",
    difficulty: "Medium",
    topicPrimary: "Quant/Core",
    stem: "What is 2 + 2?",
    choices: ["3", "4", "5", "6"],
    correctIndex: 1,
    solution: { steps: ["Add 2 and 2."], final: "4" },
    testedConceptLabel: "Arithmetic",
    generatorVersion: "gen-v1",
    ...overrides,
  };
}

function renderQuestion(
  props: Partial<ComponentProps<typeof Question>> = {},
) {
  const defaults = {
    question: sampleQuestion(),
    selected: null as number | null,
    onSelect: vi.fn(),
    submitted: false,
    testedShown: false,
    onToggleTestedShown: vi.fn(),
    onSubmit: vi.fn(),
    afterSubmitAction: null,
  };
  const view = render(<Question {...defaults} {...props} />);
  return { ...view, root: within(view.container) };
}

describe("Question", () => {
  it("renders the stem and choices", () => {
    renderQuestion();
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("calls onSelect when a choice is clicked before submit", () => {
    const onSelect = vi.fn();
    const { root } = renderQuestion({ onSelect });
    fireEvent.click(root.getByRole("button", { name: /C\.\s*5/ }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it("does not call onSelect after submit", () => {
    const onSelect = vi.fn();
    const { root } = renderQuestion({ onSelect, submitted: true, selected: 1 });
    fireEvent.click(root.getByRole("button", { name: /C\.\s*5/ }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("disables submit until a choice is selected", () => {
    const { root } = renderQuestion({ selected: null });
    expect(root.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("calls onSubmit when submit is clicked", () => {
    const onSubmit = vi.fn();
    const { root } = renderQuestion({ onSubmit, selected: 1 });
    fireEvent.click(root.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("shows correct result, hidden explanation, and next after submit", () => {
    const { root } = renderQuestion({
      submitted: true,
      selected: 1,
      afterSubmitAction: <button type="button">Next</button>,
    });
    const resultLine = root.getByText("Correct:").parentElement;
    expect(resultLine).toHaveTextContent("Correct: 4");
    expect(root.getByRole("button", { name: /Explanation/i })).toBeInTheDocument();
    expect(root.queryByText("Add 2 and 2.")).not.toBeInTheDocument();
    expect(root.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(root.queryByRole("button", { name: "Submit" })).not.toBeInTheDocument();

    fireEvent.click(root.getByRole("button", { name: /Explanation/i }));
    expect(root.getByText("Add 2 and 2.")).toBeInTheDocument();
  });

  it('shows "Incorrect:" when the wrong choice was submitted', () => {
    const { root } = renderQuestion({ submitted: true, selected: 0 });
    expect(root.getByText("Incorrect:").parentElement).toHaveTextContent("Incorrect: 4");
  });

  it("toggles tested concept visibility", () => {
    const onToggleTestedShown = vi.fn();
    const { rerender, root } = renderQuestion({ onToggleTestedShown, testedShown: false });
    fireEvent.click(root.getByRole("button", { name: /Tested concept/i }));
    expect(onToggleTestedShown).toHaveBeenCalledOnce();
    expect(screen.queryByText("Arithmetic")).not.toBeInTheDocument();

    rerender(
      <Question
        question={sampleQuestion()}
        selected={null}
        onSelect={vi.fn()}
        submitted={false}
        testedShown={true}
        onToggleTestedShown={onToggleTestedShown}
        onSubmit={vi.fn()}
        afterSubmitAction={null}
      />,
    );
    expect(screen.getByText("Arithmetic")).toBeInTheDocument();
    expect(screen.getByText("Hide")).toBeInTheDocument();
  });
});
