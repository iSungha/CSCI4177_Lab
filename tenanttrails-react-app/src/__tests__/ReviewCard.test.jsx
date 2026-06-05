import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReviewCard from "../components/ReviewCard";

describe("ReviewCard", () => {
  it("renders the review body", () => {
    render(
      <ReviewCard
        rating={4}
        body="Great building."
        date="2026-04-02"
        author="James"
      />
    );

    expect(screen.getByText("Great building.")).toBeInTheDocument();
  });

  it("renders the author name", () => {
    render(
      <ReviewCard
        rating={3}
        body="It was okay."
        date="2026-04-02"
        author="Alex"
      />
    );

    expect(screen.getByText("Alex")).toBeInTheDocument();
  });
});