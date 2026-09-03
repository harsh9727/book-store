import { ChevronDown, Languages } from "lucide-react";

export type AdminContentLanguage = "en" | "gu";

interface AdminContentLanguageSelectProps {
  value: AdminContentLanguage;
  onChange: (language: AdminContentLanguage) => void;
}

export default function AdminContentLanguageSelect({
  value,
  onChange,
}: AdminContentLanguageSelectProps) {
  return (
    <label className="relative flex h-10 min-w-40 items-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50">
      <Languages size={16} className="pointer-events-none absolute left-3" />
      <span className="sr-only">Content language</span>
      <select
        aria-label="Content language"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as AdminContentLanguage)
        }
        className="h-full w-full cursor-pointer appearance-none rounded-xl bg-transparent pl-10 pr-8 outline-none"
      >
        <option value="en">English</option>
        <option value="gu">ગુજરાતી</option>
      </select>
      <ChevronDown
        aria-hidden="true"
        size={15}
        className="pointer-events-none absolute right-3"
      />
    </label>
  );
}
