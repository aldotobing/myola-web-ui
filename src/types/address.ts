/** @format */

// types/address.ts

export interface Address {
  id: string;
  recipientName: string;
  phoneNumber: string;
  label: string; // e.g., "Rumah", "Kantor", "Apartemen"
  fullAddress: string;
  deliveryNote?: string; // Catatan untuk kurir
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressFormData {
  recipientName: string;
  phoneNumber: string;
  label: string;
  fullAddress: string;
  deliveryNote?: string;
  isPrimary: boolean;
}

export interface AddressValidationError {
  recipientName?: string;
  phoneNumber?: string;
  label?: string;
  fullAddress?: string;
}
