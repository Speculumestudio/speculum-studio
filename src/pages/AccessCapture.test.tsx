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

const rpcMock = vi.fn().mockResolvedValue({ data: { ok: true, lead_id: "lead-123" }, error: null });

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

  it("formata o WhatsApp, salva o lead e avança para a Etapa 2 de personalizacao", async () => {
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

    // Confirma que a Etapa 2 com as 3 perguntas de qualificacao aparece na tela
    await vi.waitFor(() => {
      expect(screen.getAllByText(/Etapa 2 de 2/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/1\. O que você faz hoje\?/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/2\. Como é seu nível com IA\?/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/3\. Por que você quer este material\?/i)[0]).toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: /Concluir e abrir tutorial/i })[0]).toBeInTheDocument();
    });
  });
});
