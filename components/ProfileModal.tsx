import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userProfile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-gem-600 to-gem-700 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif font-bold">Investor Profile</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gem-700 font-bold text-2xl shadow-inner">
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'G'}
             </div>
             <div>
                <p className="font-bold text-lg">{formData.name || 'Guest Investor'}</p>
                <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full mt-1 transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                  Login / Signup
                </button>
             </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* API Key Section */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gem-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                Google Gemini API Key
             </label>
             <input 
              type="password" 
              value={formData.apiKey || ''}
              onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
              className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-gem-500 focus:outline-none transition-all font-mono text-sm mb-2"
              placeholder="Paste your AIza... key here"
             />
             <div className="flex justify-between items-center">
                 <p className="text-[10px] text-gray-500">Key is stored locally in your browser.</p>
                 <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] font-bold text-gem-600 hover:text-gem-700 underline"
                 >
                    Get a Free Key
                 </a>
             </div>
          </div>

          <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-gem-500 focus:outline-none transition-all"
                placeholder="Enter your name"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Experience</label>
                <select 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value as any})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-gem-500 focus:outline-none text-sm"
                >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Pro">Professional</option>
                </select>
                </div>
                <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Risk Tolerance</label>
                <select 
                    value={formData.riskTolerance}
                    onChange={(e) => setFormData({...formData, riskTolerance: e.target.value as any})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-gem-500 focus:outline-none text-sm"
                >
                    <option value="Low">Low (Safe)</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Aggressive)</option>
                </select>
                </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              onClick={handleSave}
              className="w-full bg-gem-600 hover:bg-gem-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-gem-500/30 transition-all transform active:scale-95"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;