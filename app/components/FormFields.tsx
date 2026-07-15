// File: /app/components/FormFields.tsx v1.2.0
'use client';

import { LucideIcon } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface FormSelectFieldProps {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export const FormSelectField: React.FC<FormSelectFieldProps> = ({ id, icon: Icon, label, value, onChange, options }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        {label}
      </label>
      <Select value={value} onValueChange={(val) => val && onChange(val)}>
        <SelectTrigger id={id} className="w-full h-10 bg-background">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        {label}
      </label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 bg-background"
        required
      />
    </div>
  );
};