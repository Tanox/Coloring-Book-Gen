'use client';

import { LucideIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface SelectFieldProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ icon: Icon, iconColor, label, value, onChange, options }) => {
  return (
    <div className="space-y-3 p-4 bg-muted rounded-xl border border-border">
      <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        {label}
      </label>
      <Select value={value} onValueChange={(val) => val && onChange(val)}>
        <SelectTrigger className="w-full">
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

interface ToggleFieldProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({ icon: Icon, iconColor, label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
      <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        {label}
      </label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
};