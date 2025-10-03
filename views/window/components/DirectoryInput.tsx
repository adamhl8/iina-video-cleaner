import { useState } from "react"

interface DirectoryInputProps {
  label: string
  placeholder: string
  disabled?: boolean
  onBlur: (value: string) => void
}

export default function DirectoryInput({ label, placeholder, disabled = false, onBlur }: DirectoryInputProps) {
  const [value, setValue] = useState("")

  return (
    <div className="flex flex-col space-y-1">
      <span className="text-gray-600 text-sm">{label}</span>
      <input
        className="w-full rounded border border-gray-300 p-2.5 text-sm disabled:bg-gray-100"
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onBlur(value)}
      />
    </div>
  )
}
