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
  const sectionClasses = "space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100";
  const labelClasses = "flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-wider";
  const selectClasses = "w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 transition-all text-slate-700 font-medium cursor-pointer appearance-none";

  return (
    <div className={sectionClasses}>
      <label className={labelClasses}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectClasses}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  const sectionClasses = "space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100";
  const labelClasses = "flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-wider";

  return (
    <div className={`${sectionClasses} flex items-center justify-between space-y-0`}>
      <label className={labelClasses}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
        {label}
      </label>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-orange-500' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
