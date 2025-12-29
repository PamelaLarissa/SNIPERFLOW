import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export const freelanceSources = [
  { id: 'workana', name: 'Workana', icon: 'W', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'nffrelas', name: '99Freelas', icon: '99', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'getninjas', name: 'GetNinjas', icon: 'GN', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'fiverr_br', name: 'Fiverr BR', icon: 'F', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'upwork_br', name: 'Upwork BR', icon: 'U', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'freelancer_br', name: 'Freelancer BR', icon: 'FL', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
] as const;

export type FreelanceSourceId = typeof freelanceSources[number]['id'];

export const isFreelanceSource = (source: string): boolean => {
  return freelanceSources.some(s => s.id === source.toLowerCase().replace(/\s/g, '_'));
};

export const getFreelanceSourceInfo = (sourceId: string) => {
  return freelanceSources.find(s => s.id === sourceId.toLowerCase().replace(/\s/g, '_'));
};

interface FreelanceBadgeProps {
  source: string;
  showIcon?: boolean;
}

export const FreelanceBadge = ({ source, showIcon = true }: FreelanceBadgeProps) => {
  const sourceInfo = getFreelanceSourceInfo(source);
  
  if (!sourceInfo) return null;
  
  return (
    <Badge 
      variant="outline" 
      className={`${sourceInfo.color} font-medium text-xs`}
    >
      {showIcon && <Briefcase className="h-3 w-3 mr-1" />}
      Freelancer
    </Badge>
  );
};

interface FreelanceSourceCheckboxProps {
  source: typeof freelanceSources[number];
  checked: boolean;
  onChange: (id: string) => void;
}

export const FreelanceSourceCheckbox = ({ source, checked, onChange }: FreelanceSourceCheckboxProps) => {
  return (
    <label 
      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
        checked 
          ? 'border-primary bg-primary/10' 
          : 'border-border hover:bg-secondary/50'
      }`}
    >
      <input 
        type="checkbox" 
        checked={checked}
        onChange={() => onChange(source.id)}
        className="rounded border-border"
      />
      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${source.color}`}>
        {source.icon}
      </span>
      <span className="text-sm">{source.name}</span>
    </label>
  );
};
