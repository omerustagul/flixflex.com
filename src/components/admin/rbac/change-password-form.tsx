"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, Send, CheckCircle } from "lucide-react"
import { FFButton } from "@/components/ui/ff-button"
import { FFInput } from "@/components/ui/ff-input"
import { setPasswordSchema, type SetPasswordData } from "@/lib/validators/user-schema"

interface ChangePasswordFormProps {
  userId: string
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const [success, setSuccess] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SetPasswordData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "" },
  })

  const onSubmit = async (data: SetPasswordData) => {
    setServerError(null)
    setSuccess(false)
    const res = await fetch(`/api/users/${userId}/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok || !json.ok) {
      setServerError(json.message ?? "Şifre değiştirilirken hata oluştu.")
      return
    }
    setSuccess(true)
    reset()
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FFInput
        label="Yeni Şifre"
        type="password"
        placeholder="En az 8 karakter"
        error={errors.password?.message}
        disabled={isSubmitting}
        {...register("password")}
      />

      {serverError && (
        <p className="text-xs text-red-500">{serverError}</p>
      )}

      {success && (
        <p className="text-xs text-green-500 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          Şifre başarıyla değiştirildi.
        </p>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <FFButton
          type="submit"
          variant="secondary"
          size="sm"
          loading={isSubmitting}
          leftIcon={<KeyRound className="w-3.5 h-3.5" />}
        >
          Şifreyi Güncelle
        </FFButton>

        {/* Password reset email stub */}
        <button
          type="button"
          className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.07em] uppercase
                     text-[var(--foreground-muted)] hover:text-[var(--ff-purple)] transition-colors"
          onClick={() => {
            alert("Şifre sıfırlama maili gönderme özelliği henüz aktif değil. (TODO: Resend/SMTP entegrasyonu)")
          }}
        >
          <Send className="w-3 h-3" />
          Sıfırlama Maili Gönder
        </button>
      </div>
    </form>
  )
}
