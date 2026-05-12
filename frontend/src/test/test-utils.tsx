import React, { type ReactElement } from "react";
import { render, type RenderOptions, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { vi } from "vitest";
import { type UserEvent } from "@testing-library/user-event";

// Custom render function that includes common providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
      <Toaster />
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };

// Mock implementations for common dependencies
export const mockApiService = {
  sendMessage: vi.fn(),
};

export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
};

// Test data fixtures
export const validContactFormData = {
  name: "John Doe",
  email: "john.doe@example.com",
  message: "This is a test message with more than 10 characters.",
};

export const invalidContactFormData = {
  name: "Test User",
  email: "invalid-email",
  message: "Short",
};

// Helper to fill contact form
export const fillContactForm = async (
  user: UserEvent,
  data: typeof validContactFormData,
) => {
  const nameInput = screen.getByLabelText(/your name/i);
  const emailInput = screen.getByLabelText(/your email/i);
  const messageInput = screen.getByLabelText(/message/i);

  await user.type(nameInput, data.name);
  await user.type(emailInput, data.email);
  await user.type(messageInput, data.message);
};
