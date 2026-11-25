import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: 'current-password' | 'new-password'
  placeholder: string
  minLength?: number
}

export default function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  minLength,
}: PasswordFieldProps) {
  const inputId = useId()
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label htmlFor={inputId} className="mb-2 block text-sm font-bold text-vox-navy">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          required
          type={visible ? 'text' : 'password'}
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none transition focus:border-vox-teal focus:ring-2 focus:ring-vox-teal/10"
        />
        <button
          type="button"
          onClick={() => setVisible(current => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-500 transition hover:text-vox-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-vox-teal"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  )
}
