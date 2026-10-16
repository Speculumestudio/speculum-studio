import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(), onAuthStateChange: vi.fn(), unsubscribe: vi.fn(),
  signOut: vi.fn(), from: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: mocks, from: mocks.from },
}));

function Status() {
  const { user, loading, isAdmin } = useAuth();
  return <output>{loading ? "loading" : user ? `${user.id}:${isAdmin ? "admin" : "user"}` : "guest"}</output>;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getSession.mockResolvedValue({ data: { session: null } });
  mocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: mocks.unsubscribe } } });
  mocks.from.mockReturnValue({ select: () => ({ eq: () => Promise.resolve({ data: [{ role: "admin" }] }) }) });
});
afterEach(cleanup);

describe("authentication after the deferred SDK import", () => {
  it("keeps access pending until session restoration finishes", async () => {
    let complete!: (value: unknown) => void;
    mocks.getSession.mockReturnValue(new Promise((resolve) => { complete = resolve; }));
    render(<AuthProvider><Status /></AuthProvider>);
    await waitFor(() => expect(mocks.getSession).toHaveBeenCalledOnce());
    expect(screen.getByRole("status")).toHaveTextContent("loading");
    complete({ data: { session: null } });
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("guest"));
  });

  it("restores the existing session and loads its permissions", async () => {
    mocks.getSession.mockResolvedValue({ data: { session: { user: { id: "existing-user" } } } });
    render(<AuthProvider><Status /></AuthProvider>);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("existing-user:admin"));
    expect(mocks.from).toHaveBeenCalledWith("user_roles");
  });

  it("releases the auth listener on unmount", async () => {
    const view = render(<AuthProvider><Status /></AuthProvider>);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("guest"));
    view.unmount();
    expect(mocks.unsubscribe).toHaveBeenCalledOnce();
  });
});
