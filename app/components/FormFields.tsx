// File: /workspace/app/components/FormFields.tsx v1.1.3
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormSelectFieldProps {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: any) => void;
  options: { value: string; label: string }[];
}

export const FormSelectField: React.FC<FormSelectFieldProps> = ({ id, icon: Icon, label, value, onChange, options }) => {
  const inputClasses = "w-full px-5 py-4 bg-gradient-to-r from-orange-50 to-pink-50/30 border-2 border-orange-100 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 focus:shadow-lg focus:shadow-orange-100/30 transition-all duration-300 text-lg font-medium placeholder:text-orange-300/80 text-slate-700 hover:border-orange-200";
  const labelClasses = "flex items-center gap-2 text-sm font-black text-slate-700 mb-3 uppercase tracking-wide";

  return (
    <div className="group">
      <label htmlFor={id} className={labelClasses}>
        <Icon className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform duration-200" />
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClasses} appearance-none cursor-pointer`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-500 group-hover:scale-110 transition-transform duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

interface FormInputFieldProps {
  id: string;
  icon: LucideIcon;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const FormInputField: React.FC<FormInputFieldProps> = ({ id, icon: Icon, label, placeholder, value, onChange }) => {
  const inputClasses = "w-full px-5 py-4 bg-gradient-to-r from-orange-50 to-pink-50/30 border-2 border-orange-100 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 focus:shadow-lg focus:shadow-orange-100/30 transition-all duration-300 text-lg font-medium placeholder:text-orange-300/80 text-slate-700 hover:border-orange-200";
  const labelClasses = "flex items-center gap-2 text-sm font-black text-slate-700 mb-3 uppercase tracking-wide";

  return (
    <div className="group">
      <label htmlFor={id} className={labelClasses}>
        <Icon className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform duration-200" />
        {label}
      </label>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={inputClasses}
      />
    </div>
  );
};
