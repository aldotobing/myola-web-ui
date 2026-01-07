/** @format */
"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { Address, AddressFormData } from "@/types/address";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormData) => void;
  onDelete?: () => void;
  address?: Address | null;
  isLoading?: boolean;
  isEdit?: boolean;
}

export default function AddressFormModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  address,
  isLoading = false,
  isEdit = false,
}: AddressFormModalProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    recipientName: "",
    phoneNumber: "",
    label: "",
    fullAddress: "",
    deliveryNote: "",
    isPrimary: false,
  });

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (address && isEdit) {
      setFormData({
        recipientName: address.recipientName,
        phoneNumber: address.phoneNumber,
        label: address.label,
        fullAddress: address.fullAddress,
        deliveryNote: address.deliveryNote || "",
        isPrimary: address.isPrimary,
      });
    } else {
      // Reset form for new address
      setFormData({
        recipientName: "",
        phoneNumber: "",
        label: "",
        fullAddress: "",
        deliveryNote: "",
        isPrimary: false,
      });
    }
    setErrors([]);
  }, [address, isEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.recipientName.trim()) {
      newErrors.push("Nama penerima harus diisi");
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.push("Nomor HP harus diisi");
    }

    if (!formData.label.trim()) {
      newErrors.push("Label alamat harus diisi");
    }

    if (!formData.fullAddress.trim()) {
      newErrors.push("Alamat lengkap harus diisi");
    } else if (formData.fullAddress.trim().length < 10) {
      newErrors.push("Alamat lengkap terlalu pendek");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? "Ubah Alamat Pengiriman" : "Tambah Alamat Pengiriman"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 mb-1">
                    Terdapat kesalahan:
                  </p>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Nama Penerima */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Penerima <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Nama Penerima"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* No. HP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              No. Hp <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="No. Hp"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Label Alamat */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Label Alamat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="Contoh : Rumah"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Alamat Lengkap */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <textarea
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              placeholder="Alamat Lengkap"
              rows={4}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Catatan Untuk Kurir */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Catatan Untuk Kurir
            </label>
            <input
              type="text"
              name="deliveryNote"
              value={formData.deliveryNote}
              onChange={handleChange}
              placeholder="Catatan untuk kurir (Optional) Contoh: Warna Pagar, Patokan atau Pesan Khusus"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Jadikan Alamat Utama */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPrimary"
              name="isPrimary"
              checked={formData.isPrimary}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500 disabled:opacity-50"
            />
            <label htmlFor="isPrimary" className="text-sm text-gray-700">
              Jadikan alamat utama
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {isEdit && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isLoading}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Hapus
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
