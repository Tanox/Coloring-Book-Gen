'use client';

import { LucideIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';

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
    <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-border">
      <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        {label}
      </label>
      <Select value={value} onValueChange={(val) => val && onChange(val)}>
        <SelectTrigger className="w-full h-9 bg-background text-sm">
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
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
      <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        {label}
      </label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
};