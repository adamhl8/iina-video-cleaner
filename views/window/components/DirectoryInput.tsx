import { useCallback, useState } from "react"

interface DirectoryInputProps {
  label: string
  placeholder: string
  disabled?: boolean
  onBlur: (value: string) => void
}

export const DirectoryInput = ({ label, placeholder, disabled = false, onBlur }: DirectoryInputProps) => {
  const [value, setValue] = useState("")

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [])

  const handleBlur = useCallback(() => {
    onBlur(value)
  }, [onBlur, value])

  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm text-gray-600">{label}</span>
      <input
        className="w-full rounded border border-gray-300 p-2.5 text-sm disabled:bg-gray-100"
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  )
}
