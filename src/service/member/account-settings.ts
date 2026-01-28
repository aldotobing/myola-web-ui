/** @format */

// lib/api/account-settings.ts
import {
  ChangePasswordData,
  DeleteAccountData,
  PasswordValidation,
  AccountSettingsResponse,
} from "@/types/account-settings";

/**
 * Validate password strength
 */
export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password minimal 8 karakter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password harus mengandung minimal 1 huruf kapital");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password harus mengandung minimal 1 huruf kecil");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password harus mengandung minimal 1 angka");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password harus mengandung minimal 1 karakter spesial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Change user password
 */
export async function changePassword(
  data: ChangePasswordData,
  userId: string = "user-1"
): Promise<AccountSettingsResponse> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        error: "Password dan konfirmasi password tidak sama",
      };
    }

    // Validate password strength
    const validation = validatePassword(data.newPassword);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(". "),
      };
    }

    // In real app, this would hash password and save to database
    // For mock, just return success
    return {
      success: true,
      message:
        "Password berhasil diubah! Silakan login kembali dengan password baru.",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengubah password. Silakan coba lagi.",
    };
  }
}

/**
 * Delete user account
 */
export async function deleteAccount(
  data: DeleteAccountData,
  userId: string = "user-1"
): Promise<AccountSettingsResponse> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Validate confirmation text
    if (data.confirmationText.toUpperCase() !== "HAPUS") {
      return {
        success: false,
        error: "Konfirmasi tidak sesuai. Ketik 'HAPUS' untuk melanjutkan.",
      };
    }

    // In real app, this would:
    // 1. Soft delete or permanently delete user account
    // 2. Delete or anonymize user data according to privacy policy
    // 3. Send confirmation email
    // 4. Log out user from all devices
    // 5. Trigger cleanup jobs for user data

    // For mock, just return success
    return {
      success: true,
      message:
        "Akun Anda berhasil dihapus. Terima kasih telah menggunakan layanan kami.",
    };
  } catch (error) {
    console.error("Error deleting account:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menghapus akun. Silakan coba lagi.",
    };
  }
}

/**
 * Request account deletion (with email verification)
 */
export async function requestAccountDeletion(
  userId: string = "user-1",
  email: string
): Promise<AccountSettingsResponse> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In real app, this would send verification email
    return {
      success: true,
      message: `Email verifikasi telah dikirim ke ${email}. Silakan cek email Anda untuk menyelesaikan proses penghapusan akun.`,
    };
  } catch (error) {
    console.error("Error requesting account deletion:", error);
    return {
      success: false,
      error: "Gagal mengirim email verifikasi. Silakan coba lagi.",
    };
  }
}

/**
 * Get account settings info
 */
export async function getAccountSettings(userId: string = "user-1"): Promise<{
  lastPasswordChange?: string;
  accountCreatedAt: string;
  loginMethod: string;
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    lastPasswordChange: "2024-12-01T10:00:00Z",
    accountCreatedAt: "2024-01-15T08:30:00Z",
    loginMethod: "email", // or "google", "facebook", etc.
  };
}

/**
 * Check if password is strong enough (real-time validation)
 */
export function getPasswordStrength(password: string): {
  strength: "weak" | "medium" | "strong";
  score: number;
  feedback: string;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  let strength: "weak" | "medium" | "strong" = "weak";
  let feedback = "Password terlalu lemah";

  if (score >= 5) {
    strength = "strong";
    feedback = "Password kuat!";
  } else if (score >= 3) {
    strength = "medium";
    feedback = "Password cukup baik";
  }

  return { strength, score, feedback };
}
