import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ResultsPage from "@/pages/ResultsPage";

const buildJsonResponse = (body: unknown, ok = true, status = 200) =>
  ({
    ok,
    status,
    json: async () => body,
  }) as Response;

const buildEmptyResponse = (ok = true, status = 204) =>
  ({
    ok,
    status,
    json: async () => null,
  }) as Response;

describe("ResultsPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("hides and reveals the starred conversations section", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      buildJsonResponse([
        {
          session_id: 7,
          message_count: 4,
          last_message_text: "Food assistance follow-up",
          is_starred: true,
        },
        {
          session_id: 5,
          message_count: 1,
          last_message_text: "Housing application",
          is_starred: false,
        },
      ])
    );

    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Routes>
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText("Conversation #7");
    expect(screen.getByText("Conversation #5")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hide Starred" }));

    expect(screen.getByText("Starred conversations are hidden.")).toBeInTheDocument();
    expect(screen.queryByText("Conversation #7")).not.toBeInTheDocument();
    expect(screen.getByText("Conversation #5")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show Starred" }));

    expect(await screen.findByText("Conversation #7")).toBeInTheDocument();
  });

  it("confirms and permanently deletes a conversation", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        buildJsonResponse([
          {
            session_id: 9,
            message_count: 2,
            last_message_text: "Important notes",
            is_starred: true,
          },
          {
            session_id: 5,
            message_count: 1,
            last_message_text: "Older chat",
            is_starred: false,
          },
        ])
      )
      .mockResolvedValueOnce(buildEmptyResponse())
      .mockResolvedValueOnce(
        buildJsonResponse([
          {
            session_id: 9,
            message_count: 2,
            last_message_text: "Important notes",
            is_starred: true,
          },
        ])
      );

    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Routes>
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText("Conversation #5");

    fireEvent.click(screen.getByRole("button", { name: "Delete conversation 5" }));

    expect(screen.getByText("Delete conversation?")).toBeInTheDocument();
    expect(screen.getByText(/Conversation #5 will be removed permanently/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete Conversation" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/clients/1/sessions/5",
        expect.objectContaining({ method: "DELETE" })
      );
    });

    await waitFor(() => {
      expect(screen.queryByText("Conversation #5")).not.toBeInTheDocument();
    });
  });
});