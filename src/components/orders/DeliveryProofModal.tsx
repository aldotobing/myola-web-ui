/** @format */
"use client";

import { useState, useEffect } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCw, Calendar } from "lucide-react";

interface DeliveryProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  orderNumber: string;
  uploadDate?: string; // Optional: date when photo was uploaded
}

export default function DeliveryProofModal({
  isOpen,
  onClose,
  imageUrl,
  orderNumber,
  uploadDate,
}: DeliveryProofModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Reset state when modal closes or image changes
  useEffect(() => {
    if (!isOpen) {
      setImageLoaded(false);
      setImageError(false);
      setZoom(1);
      setRotation(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [imageUrl]);

  const handleDownload = async () => {
    try {
      // For base64 images
      if (imageUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `bukti-pesanan-${orderNumber}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // For remote URLs
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bukti-pesanan-${orderNumber}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Gagal mengunduh gambar. Silakan coba lagi.");
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleResetView = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "Escape":
        onClose();
        break;
      case "+":
      case "=":
        handleZoomIn();
        break;
      case "-":
        handleZoomOut();
        break;
      case "r":
      case "R":
        handleRotate();
        break;
      case "0":
        handleResetView();
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6 z-10">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
              Bukti Penerimaan Pesanan
            </h3>
            <p className="text-sm text-gray-300">
              No. Order: <span className="font-semibold">{orderNumber}</span>
            </p>
            {uploadDate && (
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Diterima pada: {uploadDate}</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-20">
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-sm">Memuat gambar...</p>
              </div>
            </div>
          )}

          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-white text-lg font-semibold mb-2">
                  Gagal Memuat Gambar
                </p>
                <p className="text-gray-400 text-sm">
                  Terjadi kesalahan saat memuat bukti penerimaan.
                </p>
              </div>
            </div>
          )}

          <img
            src={imageUrl}
            alt={`Bukti penerimaan pesanan ${orderNumber}`}
            className={`
              max-w-full max-h-full object-contain transition-all duration-300 ease-out
              ${imageLoaded ? "opacity-100" : "opacity-0"}
            `}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Zoom Level Indicator */}
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white text-sm font-medium">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {/* Zoom Out */}
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed backdrop-blur-sm rounded-lg transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium hidden sm:inline">
                Perkecil
              </span>
            </button>

            {/* Reset View */}
            <button
              onClick={handleResetView}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
              aria-label="Reset view"
            >
              <span className="text-white text-sm font-medium">Reset</span>
            </button>

            {/* Zoom In */}
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed backdrop-blur-sm rounded-lg transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium hidden sm:inline">
                Perbesar
              </span>
            </button>

            {/* Rotate */}
            <button
              onClick={handleRotate}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
              aria-label="Rotate image"
            >
              <RotateCw className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium hidden sm:inline">
                Putar
              </span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
              aria-label="Download image"
            >
              <Download className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium hidden sm:inline">
                Unduh
              </span>
            </button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="hidden md:block mt-4 text-center">
            <p className="text-xs text-gray-400">
              Tip: Gunakan tombol{" "}
              <kbd className="px-2 py-1 bg-white/10 rounded">+</kbd> /
              <kbd className="px-2 py-1 bg-white/10 rounded mx-1">-</kbd> untuk
              zoom,
              <kbd className="px-2 py-1 bg-white/10 rounded mx-1">R</kbd> untuk
              putar,
              <kbd className="px-2 py-1 bg-white/10 rounded mx-1">0</kbd> untuk
              reset,
              <kbd className="px-2 py-1 bg-white/10 rounded mx-1">ESC</kbd>{" "}
              untuk tutup
            </p>
          </div>
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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        kbd {
          font-family: monospace;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
}
