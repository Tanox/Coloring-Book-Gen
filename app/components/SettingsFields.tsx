// app/components/SettingsFields.tsx v1.1.3
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SelectFieldProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string;
  onChange: (value: any) => void;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ icon: Icon, iconColor, label, value, onChange, options }) => {
  const sectionClasses = "space-y-3 p-5 bg-gradient-to-br from-slate-50 to-orange-50/30 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all duration-300";
  const labelClasses = "flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider";
  const selectClasses = "w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-slate-700 font-medium cursor-pointer appearance-none hover:border-orange-300";

  return (
    <div className={sectionClasses}>
      <label className={labelClasses}>
        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        {label}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectClasses}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-orange-500 transition-colors">
          <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

interface ToggleFieldProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({ icon: Icon, iconColor, label, checked, onChange }) => {
  const sectionClasses = "space-y-3 p-5 bg-gradient-to-br from-slate-50 to-orange-50/30 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all duration-300";
  const labelClasses = "flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider";

  return (
    <div className={`${sectionClasses} flex items-center justify-between space-y-0`}>
      <label className={labelClasses}>
        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        {label}
      </label>
      <button
        onClick={onChange}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-100 ${
          checked ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-200' : 'bg-slate-200 hover:bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
