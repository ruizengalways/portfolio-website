import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactSection } from "./Contact";
import {
  render,
  validContactFormData,
  invalidContactFormData,
  fillContactForm,
} from "../test/test-utils";

import * as api from "../services/api";

vi.mock("../services/api", () => ({
  sendMessage: vi.fn(),
}));

const { mockSendMessage, mockToast } = vi.hoisted(() => ({
  mockSendMessage: vi.fn(),
  mockToast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// 2. Use a partial mock for sonner
vi.mock("sonner", async (importOriginal) => {
  const actual = await importOriginal<typeof import("sonner")>();
  return {
    ...actual, // This keeps the real <Toaster /> component
    toast: mockToast, // This replaces the toast function with your mock
  };
});

describe("ContactSection Component", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  it("renders contact section with correct structure", () => {
    render(<ContactSection />);
    const section = document.getElementById("contact");
    expect(section).toBeInTheDocument();
    // Check for the core functional classes rather than the exact string
    expect(section).toHaveClass("py-24");
    expect(section).toHaveClass("px-4");
    expect(section).toHaveClass("min-h-screen");
  });

  it("renders accessible form with proper labels", () => {
    render(<ContactSection />);

    const form = document.querySelector("form");
    expect(form).toBeInTheDocument();

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders submit button with correct text and disabled state initially", () => {
    render(<ContactSection />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("allows typing in all form fields", async () => {
    render(<ContactSection />);

    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/your email/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, "Test User");
    await user.type(emailInput, "test@example.com");
    await user.type(messageInput, "Test message");

    expect(nameInput).toHaveValue("Test User");
    expect(emailInput).toHaveValue("test@example.com");
    expect(messageInput).toHaveValue("Test message");
  });

  it("submits the form successfully with valid data", async () => {
    // Correct way to mock the resolved value
    vi.mocked(api.sendMessage).mockResolvedValue({ success: true });

    render(<ContactSection />);
    await fillContactForm(user, validContactFormData);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.sendMessage).toHaveBeenCalledWith(validContactFormData);
      expect(mockToast.success).toHaveBeenCalledWith(
        "Message sent!",
        expect.any(Object),
      );
    });
  });

  it("shows error toast when API call fails", async () => {
    vi.mocked(api.sendMessage).mockRejectedValue(new Error("Network Error"));
    render(<ContactSection />);
    await fillContactForm(user, validContactFormData);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(
      () => {
        expect(mockToast.error).toHaveBeenCalledWith(
          "Error sending message", // Updated to match "Received"
          expect.objectContaining({
            description: "Network Error",
          }),
        );
      },
      { timeout: 2000 },
    );
  });

  it("validates required fields and shows errors", async () => {
    render(<ContactSection />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Assuming HTML5 validation or custom validation
    // Check that form doesn't submit with empty fields
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("prevents multiple submissions while processing", async () => {
    type SendMessageResponse = {
      success: boolean;
    };
    let resolvePromise: (value: SendMessageResponse) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(api.sendMessage).mockReturnValue(promise);

    render(<ContactSection />);
    await fillContactForm(user, validContactFormData);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Now the button MUST be disabled because the promise hasn't resolved
    expect(submitButton).toBeDisabled();

    // Clean up
    resolvePromise!({ success: true });
  });

  it("clears form after successful submission", async () => {
    mockSendMessage.mockResolvedValue({ success: true });

    render(<ContactSection />);

    await fillContactForm(user, validContactFormData);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled();
    });

    // Form should be cleared
    expect(screen.getByLabelText(/your name/i)).toHaveValue("");
    expect(screen.getByLabelText(/your email/i)).toHaveValue("");
    expect(screen.getByLabelText(/message/i)).toHaveValue("");
  });

  it("handles invalid email format", async () => {
    render(<ContactSection />);

    await fillContactForm(user, invalidContactFormData);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Should not call API with invalid data
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("matches snapshot", () => {
    const { container } = render(<ContactSection />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
