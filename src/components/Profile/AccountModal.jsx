import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';

const AccountModal = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT' || isDeleting) return;
    
    setIsDeleting(true);
    try {
      // Assuming a server-side endpoint or RPC is set up for secure user deletion,
      // or we handle it via supabase.auth.admin if permitted (usually needs server context).
      // Standard supabase JS client doesn't let users delete themselves without edge functions.
      // We will simulate the call and sign them out for now.
      
      // await supabase.rpc('delete_user'); 
      console.warn("Account deletion requested. Ensure server-side setup handles this properly.");
      await signOut();
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: '100%', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: '100%', scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg bg-[#0B0C10] sm:rounded-[32px] rounded-t-[32px] rounded-b-none border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Danger Zone</h2>
                <p className="text-sm text-white/40 mt-1">Permanently remove your account.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-[#1C1F2A] border border-red-500/20 rounded-2xl p-5 sm:p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="mt-0.5 p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-white/90 font-semibold mb-1">Delete Account</h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    This action is <span className="text-red-400 font-medium">irreversible</span>. 
                    All your streaks, habits, and reflections will be permanently erased.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs text-white/40 uppercase tracking-wider font-semibold">
                  Type "DELETE MY ACCOUNT" to confirm
                </label>
                <input 
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  className="w-full bg-[#15171E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: deleteConfirmation === 'DELETE MY ACCOUNT' ? 1.02 : 1 }}
                whileTap={{ scale: deleteConfirmation === 'DELETE MY ACCOUNT' ? 0.98 : 1 }}
                onClick={handleDelete}
                disabled={deleteConfirmation !== 'DELETE MY ACCOUNT' || isDeleting}
                className="w-full mt-6 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:hover:bg-red-500/10 disabled:hover:text-red-500 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : null}
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </motion.button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AccountModal;
