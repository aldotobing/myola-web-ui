/** @format */
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

interface DeliveryConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (photoFile: File) => void;
  orderNumber: string;
  isLoading?: boolean;
}

export default function DeliveryConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isLoading = false,
}: DeliveryConfirmationModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl("");
      setError("");
      setIsDragging(false);
    }
  }, [isOpen]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP";
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return "Ukuran file terlalu besar. Maksimal 5MB";
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    setError("");

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleConfirm = () => {
    if (!selectedFile) {
      setError("Silakan upload bukti penerimaan terlebih dahulu");
      return;
    }
    onConfirm(selectedFile);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Konfirmasi Penerimaan
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              No. Order: {orderNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Question */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-800 font-medium text-center">
              Apakah Anda sudah menerima pesanan?
            </p>
          </div>

          {/* Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Bukti Penerimaan <span className="text-red-500">*</span>
            </label>

            {!selectedFile ? (
              // Upload Area
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClickUpload}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-all duration-200
                  ${
                    isDragging
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-300 hover:border-pink-400 hover:bg-gray-50"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isLoading}
                />

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-8 h-8 text-pink-500" />
                  </div>

                  <p className="text-gray-700 font-medium mb-1">
                    {isDragging
                      ? "Lepaskan file di sini"
                      : "Klik atau drag & drop foto"}
                  </p>

                  <p className="text-sm text-gray-500">
                    JPG, PNG, atau WEBP (Max. 5MB)
                  </p>
                </div>
              </div>
            ) : (
              // Preview Area
              <div className="relative border-2 border-green-500 rounded-lg p-4 bg-green-50">
                <button
                  onClick={handleRemoveFile}
                  disabled={isLoading}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4">
                  {/* Image Preview */}
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-200 border border-gray-300 relative">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0 pt-2">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                        <p className="text-xs text-green-600 font-medium mt-1">
                          File siap diupload
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-3 flex items-start gap-2 bg-red-50 p-3 rounded-lg animate-shake">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Helper Text */}
            <p className="text-xs text-gray-500 mt-2">
              Pastikan foto menunjukkan bukti bahwa Anda telah menerima pesanan
              dengan baik.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-gray-700 font-semibold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tidak
          </button>

          <button
            onClick={handleConfirm}
            disabled={!selectedFile || isLoading}
            className="flex-1 px-4 py-3 text-white font-semibold bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Ya, Terima Pesanan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
