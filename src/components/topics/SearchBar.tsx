
import { Search } from "lucide-react"
import { KeyboardEvent } from "react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // The form will handle the submission
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <input
        type="text"
        placeholder="Search for topics..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background"
      />
    </div>
  )
}
