
import { Search } from "lucide-react"
import { KeyboardEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
}

export const SearchBar = ({ value, onChange, onSubmit }: SearchBarProps) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSubmit) {
        onSubmit();
      }
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <input
          type="text"
          placeholder="Search for topics..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full pl-10 pr-4 py-3 rounded-l-lg border bg-background"
        />
      </div>
      <Button 
        type="submit" 
        className="rounded-l-none"
      >
        Search
      </Button>
    </form>
  )
}
