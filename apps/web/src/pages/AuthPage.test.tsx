/**
 * Test unitario de componente: AuthPage maneja eventos del usuario (input, submit),
 * llama a login, notifica al padre (output property) y muestra errores de la API.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthPage from "./AuthPage";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));
vi.mock("../auth/AuthContext", () => ({ useAuth: () => ({ user: null, login: mocks.login, register: mocks.register }) }));
vi.mock("../components/feedback", () => ({ useFeedback: () => ({ toast: mocks.toast, confirm: vi.fn() }) }));
vi.mock("../api", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../api")>();
  return { ...mod, localidades: { ...mod.localidades, list: vi.fn().mockResolvedValue([]) } };
});

const renderPage = (mode: "login" | "register", onAuthenticated?: (email: string) => void) =>
  render(<MemoryRouter><AuthPage mode={mode} onAuthenticated={onAuthenticated} /></MemoryRouter>);

describe("AuthPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("envía email y contraseña al iniciar sesión y notifica al padre", async () => {
    mocks.login.mockResolvedValue({ id_user: 2, email: "productor@agroapp.dev", nombre: "Carlos", apellido: "F", roles: ["PRODUCTOR"] });
    const onAuthenticated = vi.fn();
    renderPage("login", onAuthenticated);

    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "productor@agroapp.dev" } });
    fireEvent.change(screen.getByLabelText(/^Contraseña/), { target: { value: "Productor123!" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(mocks.login).toHaveBeenCalledWith("productor@agroapp.dev", "Productor123!"));
    await waitFor(() => expect(onAuthenticated).toHaveBeenCalledWith("productor@agroapp.dev"));
    expect(mocks.toast.success).toHaveBeenCalled();
  });

  it("muestra el mensaje de error devuelto por la API", async () => {
    mocks.login.mockRejectedValue({ isAxiosError: true, response: { status: 401, data: { code: "INVALID_CREDENTIALS", message: "Email o contraseña incorrectos" } } });
    renderPage("login");
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "x@x.com" } });
    fireEvent.change(screen.getByLabelText(/^Contraseña/), { target: { value: "mal" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Email o contraseña incorrectos");
  });

  it("en modo registro permite elegir el rol y envía el rol elegido", async () => {
    mocks.register.mockResolvedValue({ id_user: 9, email: "n@n.dev", nombre: "N", apellido: "A", roles: ["CONTRATISTA"] });
    renderPage("register");
    fireEvent.click(screen.getByRole("radio", { name: /Soy contratista/ }));
    fireEvent.change(screen.getByLabelText(/^Nombre/), { target: { value: "N" } });
    fireEvent.change(screen.getByLabelText(/^Apellido/), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "n@n.dev" } });
    fireEvent.change(screen.getByLabelText(/^Confirmar email/), { target: { value: "n@n.dev" } });
    fireEvent.change(screen.getByLabelText(/^Contraseña/), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    await waitFor(() => expect(mocks.register).toHaveBeenCalledWith(expect.objectContaining({ rol: "CONTRATISTA", email: "n@n.dev" })));
  });

  it("en modo registro no envía si el email de confirmación no coincide", async () => {
    renderPage("register");
    fireEvent.change(screen.getByLabelText(/^Nombre/), { target: { value: "N" } });
    fireEvent.change(screen.getByLabelText(/^Apellido/), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "n@n.dev" } });
    fireEvent.change(screen.getByLabelText(/^Confirmar email/), { target: { value: "otro@n.dev" } });
    fireEvent.change(screen.getByLabelText(/^Contraseña/), { target: { value: "Password1!" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Los emails no coinciden");
    expect(mocks.register).not.toHaveBeenCalled();
  });
});
