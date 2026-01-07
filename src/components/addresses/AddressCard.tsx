/** @format */
"use client";

import { Address } from "@/types/address";
import { MapPin, Phone, User, Edit, Trash2 } from "lucide-react";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetPrimary: (addressId: string) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetPrimary,
}: AddressCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {address.isPrimary && (
            <span className="inline-block px-3 py-1 bg-pink-500 text-white text-xs font-semibold rounded-full mb-2">
              Alamat Utama
            </span>
          )}
          <h3 className="text-lg font-bold text-gray-900">
            {address.recipientName}
          </h3>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm">{address.phoneNumber}</span>
        </div>
      </div>

      {/* Label */}
      {address.label && (
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
            {address.label}
          </span>
        </div>
      )}

      {/* Address */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700 flex-1">{address.fullAddress}</p>
      </div>

      {/* Delivery Note */}
      {address.deliveryNote && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Catatan:</span>{" "}
            {address.deliveryNote}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-start gap-2 pt-4 border-t">
        <button
          onClick={() => onEdit(address)}
          className=" flex items-center justify-center gap-2 px-4 py-2 text-pink-500 border border-pink-500 rounded-lg text-sm font-semibold hover:bg-pink-50 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Ubah</span>
        </button>

        {!address.isPrimary && (
          <button
            onClick={() => onSetPrimary(address.id)}
            className=" px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-semibold hover:bg-pink-600 transition-colors"
          >
            Jadikan Alamat Utama
          </button>
        )}
      </div>
    </div>
  );
}
