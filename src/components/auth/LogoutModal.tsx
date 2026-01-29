/** @format */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Loader2, X, ShieldCheck } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoading }: LogoutModalProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40, rotateX: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40, transition: { duration: 0.3 } }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white rounded-[40px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] perspective-1000"
          >
            <div className="p-10 text-center">
              {/* Animated Icon Container */}
              <div className="relative mx-auto w-24 h-24 mb-8">
                <AnimatePresence mode="wait">
                  {!isLoading ? (
                    <motion.div
                      key="idle"
                      initial={{ rotate: -20, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 20, scale: 1.5, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-pink-50 rounded-[32px] rotate-6" />
                      <div className="absolute inset-0 bg-pink-100/50 rounded-[32px] -rotate-3" />
                      <LogOut className="relative w-12 h-12 text-pink-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="active"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-dashed border-pink-200 rounded-full"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-pink-500 p-5 rounded-full shadow-lg shadow-pink-200"
                      >
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                animate={isLoading ? { opacity: 0.5, y: 5 } : { opacity: 1, y: 0 }}
              >
                <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
                  {isLoading ? "Sesi Berakhir..." : "Konfirmasi Keluar"}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-10 px-2 font-medium">
                  {isLoading 
                    ? "Sedang membersihkan data sesi Anda secara aman. Mohon tunggu sebentar." 
                    : "Apakah Anda yakin ingin mengakhiri sesi ini? Anda perlu login kembali untuk mengakses data Anda."
                  }
                </p>
              </motion.div>

              <div className="flex flex-col gap-4">
                <button
                  disabled={isLoading}
                  onClick={onConfirm}
                  className="group relative w-full py-5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none overflow-hidden"
                >
                  <motion.div
                    animate={isLoading ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>Ya, Keluar Sekarang</span>
                  </motion.div>
                  
                  {isLoading && (
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </button>
                
                {!isLoading && (
                  <button
                    onClick={onClose}
                    className="w-full py-4 text-gray-400 hover:text-gray-600 font-bold rounded-2xl transition-all hover:bg-gray-50"
                  >
                    Batalkan
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}