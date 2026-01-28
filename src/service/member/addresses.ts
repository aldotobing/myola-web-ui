/** @format */

// lib/api/addresses.ts
import { Address, AddressFormData } from "@/types/address";

// Mock data untuk addresses
let addressesData: Address[] = [
  {
    id: "addr-1",
    recipientName: "Maria Klarasin",
    phoneNumber: "089612756458",
    label: "Rumah",
    fullAddress:
      "Kauman Asri Gang 1 No. 7, Kelurahan Benowo, Kecamatan Pakai, RT 01 RW 06, Kota Surabaya 60195",
    deliveryNote: "Pagar Cream",
    isPrimary: true,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "addr-2",
    recipientName: "Maria Klarasin",
    phoneNumber: "089612756458",
    label: "Kantor",
    fullAddress:
      "Jalan Putat Jaya X 1 No. 7, Kelurahan Benowo, Kecamatan Pakai, RT 01 RW 06, Kota Surabaya 60195",
    deliveryNote: "Gedung putih lantai 3",
    isPrimary: false,
    createdAt: "2025-02-10T14:30:00Z",
    updatedAt: "2025-02-10T14:30:00Z",
  },
];

/**
 * Get all addresses for a user
 */
export async function getUserAddresses(
  userId: string = "user-1"
): Promise<Address[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...addressesData].sort((a, b) => {
    // Primary address first
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    // Then by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Get a single address by ID
 */
export async function getAddressById(
  addressId: string,
  userId: string = "user-1"
): Promise<Address | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  const address = addressesData.find((addr) => addr.id === addressId);
  return address || null;
}

/**
 * Get primary address
 */
export async function getPrimaryAddress(
  userId: string = "user-1"
): Promise<Address | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const primary = addressesData.find((addr) => addr.isPrimary);
  return primary || null;
}

/**
 * Create new address
 */
export async function createAddress(
  data: AddressFormData,
  userId: string = "user-1"
): Promise<{ success: boolean; address?: Address; error?: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Validate data
    const validation = validateAddressData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(", "),
      };
    }

    // If setting as primary, unset other primary addresses
    if (data.isPrimary) {
      addressesData = addressesData.map((addr) => ({
        ...addr,
        isPrimary: false,
      }));
    }

    // Create new address
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      recipientName: data.recipientName,
      phoneNumber: data.phoneNumber,
      label: data.label,
      fullAddress: data.fullAddress,
      deliveryNote: data.deliveryNote || "",
      isPrimary: data.isPrimary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addressesData.push(newAddress);

    return {
      success: true,
      address: newAddress,
    };
  } catch (error) {
    console.error("Error creating address:", error);
    return {
      success: false,
      error: "Failed to create address",
    };
  }
}

/**
 * Update existing address
 */
export async function updateAddress(
  addressId: string,
  data: AddressFormData,
  userId: string = "user-1"
): Promise<{ success: boolean; address?: Address; error?: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const index = addressesData.findIndex((addr) => addr.id === addressId);

    if (index === -1) {
      return {
        success: false,
        error: "Address not found",
      };
    }

    // Validate data
    const validation = validateAddressData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(", "),
      };
    }

    // If setting as primary, unset other primary addresses
    if (data.isPrimary) {
      addressesData = addressesData.map((addr) => ({
        ...addr,
        isPrimary: addr.id === addressId ? true : false,
      }));
    }

    // Update address
    const updatedAddress: Address = {
      ...addressesData[index],
      recipientName: data.recipientName,
      phoneNumber: data.phoneNumber,
      label: data.label,
      fullAddress: data.fullAddress,
      deliveryNote: data.deliveryNote || "",
      isPrimary: data.isPrimary,
      updatedAt: new Date().toISOString(),
    };

    addressesData[index] = updatedAddress;

    return {
      success: true,
      address: updatedAddress,
    };
  } catch (error) {
    console.error("Error updating address:", error);
    return {
      success: false,
      error: "Failed to update address",
    };
  }
}

/**
 * Delete address
 */
export async function deleteAddress(
  addressId: string,
  userId: string = "user-1"
): Promise<{ success: boolean; error?: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const index = addressesData.findIndex((addr) => addr.id === addressId);

    if (index === -1) {
      return {
        success: false,
        error: "Address not found",
      };
    }

    // Check if it's the primary address
    const addressToDelete = addressesData[index];
    if (addressToDelete.isPrimary && addressesData.length > 1) {
      return {
        success: false,
        error:
          "Cannot delete primary address. Please set another address as primary first.",
      };
    }

    // Delete address
    addressesData.splice(index, 1);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting address:", error);
    return {
      success: false,
      error: "Failed to delete address",
    };
  }
}

/**
 * Set address as primary
 */
export async function setPrimaryAddress(
  addressId: string,
  userId: string = "user-1"
): Promise<{ success: boolean; address?: Address; error?: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = addressesData.findIndex((addr) => addr.id === addressId);

    if (index === -1) {
      return {
        success: false,
        error: "Address not found",
      };
    }

    // Unset all primary addresses
    addressesData = addressesData.map((addr) => ({
      ...addr,
      isPrimary: false,
    }));

    // Set new primary
    addressesData[index] = {
      ...addressesData[index],
      isPrimary: true,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      address: addressesData[index],
    };
  } catch (error) {
    console.error("Error setting primary address:", error);
    return {
      success: false,
      error: "Failed to set primary address",
    };
  }
}

/**
 * Validate address data
 */
function validateAddressData(data: AddressFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.recipientName || data.recipientName.trim().length === 0) {
    errors.push("Nama penerima harus diisi");
  }

  if (!data.phoneNumber || data.phoneNumber.trim().length === 0) {
    errors.push("Nomor HP harus diisi");
  } else if (!/^[\d\s\+\-\(\)]+$/.test(data.phoneNumber)) {
    errors.push("Format nomor HP tidak valid");
  }

  if (!data.label || data.label.trim().length === 0) {
    errors.push("Label alamat harus diisi");
  }

  if (!data.fullAddress || data.fullAddress.trim().length === 0) {
    errors.push("Alamat lengkap harus diisi");
  } else if (data.fullAddress.trim().length < 10) {
    errors.push("Alamat lengkap terlalu pendek");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get address count
 */
export async function getAddressCount(
  userId: string = "user-1"
): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return addressesData.length;
}
