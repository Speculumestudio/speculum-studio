import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AccessCapture from "./AccessCapture";

beforeAll(() => {
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

const rpcMock = vi.fn().mockResolvedValue({ data: { ok: true }, error: null });

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: (...args: unknown[]) => rpcMock(...args),
  },
}));

describe("AccessCapture", () => {
  it("renderiza a pagina de captura /acesso/cerebro com os 3 campos obrigatorios", () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/acesso/cerebro?utm_source=instagram&utm_campaign=cerebro"]}>
          <Routes>
            <Route path="/acesso/:slug" element={<AccessCapture />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(/Monte o seu Segundo Cérebro/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Nome completo/i)[0]).toBeRequired();
    expect(screen.getAllByLabelText(/Seu melhor e-mail/i)[0]).toBeRequired();
    expect(screen.getAllByLabelText(/WhatsApp com DDD/i)[0]).toBeRequired();
  });

  it("formata o WhatsApp e envia o lead via capture_studio_lead", async () => {
    rpcMock.mockClear();
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/acesso/cerebro?utm_source=instagram&utm_campaign=funil_cerebro"]}>
          <Routes>
            <Route path="/acesso/:slug" element={<AccessCapture />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    const nomeInput = screen.getAllByLabelText(/Nome completo/i)[0];
    const emailInput = screen.getAllByLabelText(/Seu melhor e-mail/i)[0];
    const whatsInput = screen.getAllByLabelText(/WhatsApp com DDD/i)[0];

    fireEvent.change(nomeInput, { target: { value: "Fabiano Teste" } });
    fireEvent.change(emailInput, { target: { value: "teste@speculumstudio.com" } });
    fireEvent.change(whatsInput, { target: { value: "13996158177" } });

    expect((whatsInput as HTMLInputElement).value).toBe("(13) 99615-8177");

    const submitBtn = screen.getAllByRole("button", { name: /Liberar mapa e comandos agora/i })[0];
    fireEvent.click(submitBtn);

    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith(
        "capture_studio_lead",
        expect.objectContaining({
          p_isca_slug: "cerebro",
          p_nome: "Fabiano Teste",
          p_email: "teste@speculumstudio.com",
          p_whatsapp: "(13) 99615-8177",
          p_consent_lgpd: true,
          p_utm_source: "instagram",
          p_utm_campaign: "funil_cerebro",
        })
      );
    });
  });
});
