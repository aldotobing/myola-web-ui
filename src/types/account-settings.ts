/** @format */

// types/account-settings.ts

export interface ChangePasswordData {
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteAccountData {
  confirmationText: string;
}

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export interface AccountSettingsResponse {
  success: boolean;
  message?: string;
  error?: string;
}
