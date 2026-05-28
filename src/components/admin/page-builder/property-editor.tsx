"use client"

// ═══════════════════════════════════════════════════════════
// FlixFlex — Property Editor (right rail)
// Dynamic form generated from SECTION_SCHEMAS
// ═══════════════════════════════════════════════════════════

import * as React from "react"
import { useCallback } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePageBuilder } from "@/store/page-builder"
import { useShallow } from "zustand/react/shallow"
import { SECTION_SCHEMAS } from "@/types/page-builder"
import { SECTION_REGISTRY } from "@/lib/page-builder/section-registry"
import { FFSelect, FFSelectItem } from "@/components/ui/ff-select"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { Image as ImageIcon, Video } from "lucide-react"

// ── Field renderers ───────────────────────────────
interface FieldProps {
  name: string
  value: unknown
  schema: { description?: string }
  onChange: (val: unknown) => void
}

function FieldLabel({ name }: { name: string }) {
  const labels: Record<string, string> = {
    headline: "Başlık",
    subheadline: "Alt Başlık",
    videoUrl: "Video URL",
    videoUrlMobile: "Mobil Video URL",
    posterUrl: "Kapak Görseli",
    ctaLabel: "Buton Yazısı",
    ctaHref: "Buton Linki",
    secondaryCtaLabel: "2. Buton Yazısı",
    secondaryCtaHref: "2. Buton Linki",
    hideMobileDock: "Mobil Dock Gizle",
    filterEnabled: "Filtre Aktif",
    maxItems: "Maksimum Öğe",
    showAll: "Hepsini Göster",
    eyebrow: "Üst Başlık",
    description: "Açıklama",
    variant: "Varyant",
    body: "İçerik",
    imageUrl: "Görsel URL",
    imageAlt: "Görsel Alt Metni",
    imagePosition: "Görsel Pozisyonu",
    aspectRatio: "En-Boy Oranı",
    autoplay: "Otomatik Oynat",
    question: "Soru",
    answer: "Cevap",
    showMap: "Harita Göster",
    primaryColor: "Ana Renk",
  }

  const label = labels[name] || name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
  return (
    <label className="text-[10px] font-semibold text-[#666666] block mb-1">
      {label}
    </label>
  )
}

function TextField({ name, value, onChange }: FieldProps) {
  return (
    <div>
      <FieldLabel name={name} />
      <input
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "ff-shape-container w-full px-3 py-2 text-[12px]",
          "bg-[#f7f7f5] border border-[#CCCCCC]",
          "text-[#333333] placeholder:text-[#666666]",
          "outline-none focus:border-[#ff4fd8] transition-colors duration-150"
        )}
      />
    </div>
  )
}

function TextareaField({ name, value, onChange }: FieldProps) {
  return (
    <div>
      <FieldLabel name={name} />
      <textarea
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={cn(
          "ff-shape-container w-full px-3 py-2 text-[12px] resize-y min-h-[72px]",
          "bg-[#f7f7f5] border border-[#CCCCCC]",
          "text-[#333333] placeholder:text-[#666666]",
          "outline-none focus:border-[#ff4fd8] transition-colors duration-150"
        )}
      />
    </div>
  )
}

function BooleanField({ name, value, onChange }: FieldProps) {
  return (
    <div className="flex items-center justify-between">
      <FieldLabel name={name} />
      <button
        role="switch"
        aria-checked={!!value}
        onClick={() => onChange(!value)}
        className={cn(
          "ff-shape-container relative w-11 h-6 border transition-colors duration-200 shrink-0",
          value
            ? "bg-[#ff4fd8] border-[#ff4fd8]"
            : "bg-[#f7f7f5] border-[#CCCCCC]"
        )}
      >
        <span
          className={cn(
            "ff-shape-container absolute top-0.5 w-4.5 h-4.5 bg-white transition-transform duration-200",
            value ? "translate-x-0" : "translate-x-[-18px]"
          )}
        />
      </button>
    </div>
  )
}

function SelectField({
  name,
  value,
  onChange,
  options,
}: FieldProps & { options: string[] }) {
  return (
    <div>
      <FieldLabel name={name} />
      <FFSelect
        value={typeof value === "string" ? value : ""}
        onValueChange={onChange}
        size="sm"
        ariaLabel={name}
      >
        {options.map((opt) => (
          <FFSelectItem key={opt} value={opt}>
            {opt}
          </FFSelectItem>
        ))}
      </FFSelect>
    </div>
  )
}

function NumberField({ name, value, onChange }: FieldProps) {
  return (
    <div>
      <FieldLabel name={name} />
      <input
        type="number"
        value={typeof value === "number" ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "ff-shape-container w-full px-3 py-2 text-[12px]",
          "bg-[#f7f7f5] border border-[#CCCCCC]",
          "text-[#333333]",
          "outline-none focus:border-[#ff4fd8] transition-colors duration-150"
        )}
      />
    </div>
  )
}

function ColorField({ name, value, onChange }: FieldProps) {
  return (
    <div>
      <FieldLabel name={name} />
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={typeof value === "string" ? value : "#ff4d8d"}
          onChange={(e) => onChange(e.target.value)}
          className="ff-shape-button w-8 h-8 border border-[#CCCCCC] cursor-pointer bg-transparent p-0"
        />
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "flex-1 px-3 py-2 text-[12px]",
            "bg-[#f7f7f5] border border-[#CCCCCC]",
            "text-[#333333]",
            "outline-none focus:border-[#ff4fd8] transition-colors duration-150"
          )}
          placeholder="#ff4d8d veya CSS renk değeri"
        />
      </div>
    </div>
  )
}

function MediaField({ name, value, onChange }: FieldProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const isVideo =
    name.toLowerCase().includes("video") ||
    name.toLowerCase().includes("videourl")

  const currentUrl = typeof value === "string" ? value : ""
  const fileName = currentUrl ? currentUrl.split("/").pop() ?? currentUrl : ""

  return (
    <div>
      <FieldLabel name={name} />

      {/* Seçili dosya göstergesi */}
      {fileName && (
        <div className={cn(
          "ff-shape-container flex items-center gap-2 px-3 py-1.5 mb-2",
          "bg-[#f7f7f5] border border-[#CCCCCC]"
        )}>
          <span className="text-[#ff4fd8] shrink-0">
            {isVideo ? <Video size={11} /> : <ImageIcon size={11} />}
          </span>
          <span className="text-[10px] text-[#333333] truncate flex-1">{fileName}</span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[#999999] hover:text-[#e03434] transition-colors shrink-0"
            title="Kaldır"
          >
            <X size={11} />
          </button>
        </div>
      )}

      {/* Medya kütüphanesi butonu */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "ff-shape-button w-full h-9 flex items-center justify-center gap-2",
          "border border-dashed border-[#CCCCCC]",
          "text-[11px] font-semibold text-[#666666]",
          "hover:border-[#ff4fd8] hover:text-[#ff4fd8] hover:bg-[#ff4fd8]/5",
          "transition-all duration-150"
        )}
      >
        {isVideo ? <Video size={13} /> : <ImageIcon size={13} />}
        {isVideo ? "Video Seç" : "Görsel Seç"}
      </button>

      {isOpen && (
        <MediaPicker
          allowedTypes={isVideo ? ["video"] : ["image"]}
          onSelect={(url) => {
            onChange(url)
            setIsOpen(false)
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// ── Determine field renderer from Zod shape ───────
function inferFieldType(fieldDef: Record<string, unknown>): string {
  // Walk _def chain to find type name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let def: any = fieldDef
  while (def) {
    const typeName: string = def.typeName ?? def.type ?? ""
    if (typeName === "ZodBoolean" || typeName === "boolean") return "boolean"
    if (typeName === "ZodNumber" || typeName === "number") return "number"
    if (typeName === "ZodEnum" || typeName === "enum") return "select"
    if (typeName === "ZodArray" || typeName === "array") return "array"
    if (typeName === "ZodObject" || typeName === "object") return "object"
    // unwrap optional / default
    if (def.innerType) { def = def.innerType._def ?? def.innerType; continue }
    if (def.schema) { def = def.schema._def ?? def.schema; continue }
    break
  }
  return "string"
}

function getEnumOptions(fieldDef: Record<string, unknown>): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let def: any = fieldDef
  while (def) {
    if (def.typeName === "ZodEnum" || def.type === "enum") {
      return def.entries ? Object.keys(def.entries) : (def.values ?? [])
    }
    if (def.innerType) { def = def.innerType._def ?? def.innerType; continue }
    if (def.schema) { def = def.schema._def ?? def.schema; continue }
    break
  }
  return []
}

// ── Main component ────────────────────────────────
export function PropertyEditor() {
  // Scoped selectors — avoids re-renders triggered by unrelated store slices
  const { page, selectedSectionId } = usePageBuilder(
    useShallow((s) => ({ page: s.page, selectedSectionId: s.selectedSectionId }))
  )
  const selectSection = usePageBuilder((s) => s.selectSection)
  const updateSectionProps = usePageBuilder((s) => s.updateSectionProps)

  const section = page?.sections.find((s) => s.id === selectedSectionId)

  const handleChange = useCallback(
    (fieldName: string, val: unknown) => {
      if (!selectedSectionId) return
      updateSectionProps(selectedSectionId, { [fieldName]: val })
    },
    [selectedSectionId, updateSectionProps]
  )

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
        <div className="ff-shape-button w-8 h-8 border border-[var(--border)] flex items-center justify-center mb-3">
          <span className="text-[var(--foreground-faint)] text-xs">←</span>
        </div>
        <p className="text-[12px] text-[var(--foreground-faint)]">
          Bir section seçin
        </p>
        <p className="text-[11px] text-[var(--foreground-faint)] mt-1 opacity-70">
          Canvas&apos;tan bir bölüme tıklayın
        </p>
      </div>
    )
  }

  const meta = SECTION_REGISTRY[section.type]
  const schema = SECTION_SCHEMAS[section.type]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shape = (schema as any).shape ?? {}
  const props = section.props as Record<string, unknown>

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#CCCCCC] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#ff4fd8]">
            {meta ? <meta.icon size={14} /> : <X size={14} />}
          </span>
          <span className="text-[12px] font-semibold text-[#333333]">
            {meta?.label ?? "Section Yok"}
          </span>
        </div>
        <button
          onClick={() => selectSection(null)}
          className="text-[#666666] hover:text-[#333333] transition-colors"
          aria-label="Kapat"
        >
          <X size={14} />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {Object.entries(shape).map(([fieldName, fieldDef]) => {
          const fDef = fieldDef as Record<string, unknown>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const innerDef = (fDef as any)._def ?? fDef
          const fieldType = inferFieldType(innerDef)
          const currentVal = props[fieldName]

          // Skip complex/array types for now — render them as JSON textarea
          if (fieldType === "array" || fieldType === "object") {
            return (
              <div key={fieldName}>
                <FieldLabel name={fieldName} />
                <textarea
                  value={JSON.stringify(currentVal, null, 2)}
                  onChange={(e) => {
                    try {
                      handleChange(fieldName, JSON.parse(e.target.value))
                    } catch {
                      // invalid JSON — don't update
                    }
                  }}
                  rows={5}
                  className={cn(
                    "ff-shape-container w-full px-3 py-2 text-[11px] font-mono resize-y",
                    "bg-[#f7f7f5] border border-[#CCCCCC]",
                    "text-[#333333]",
                    "outline-none focus:border-[#ff4fd8] transition-colors duration-150"
                  )}
                />
              </div>
            )
          }

          if (fieldType === "boolean") {
            return (
              <BooleanField
                key={fieldName}
                name={fieldName}
                value={currentVal}
                schema={innerDef}
                onChange={(v) => handleChange(fieldName, v)}
              />
            )
          }

          if (fieldType === "select") {
            const options = getEnumOptions(innerDef)
            return (
              <SelectField
                key={fieldName}
                name={fieldName}
                value={currentVal}
                schema={innerDef}
                options={options}
                onChange={(v) => handleChange(fieldName, v)}
              />
            )
          }

          if (fieldType === "number") {
            return (
              <NumberField
                key={fieldName}
                name={fieldName}
                value={currentVal}
                schema={innerDef}
                onChange={(v) => handleChange(fieldName, v)}
              />
            )
          }

          // Check for color fields by naming convention
          if (
            fieldName.toLowerCase().includes("color") ||
            fieldName.toLowerCase().includes("colour")
          ) {
            return (
              <ColorField
                key={fieldName}
                name={fieldName}
                value={currentVal}
                schema={innerDef}
                onChange={(v) => handleChange(fieldName, v)}
              />
            )
          }

          // Media fields (detect by name)
          if (
            fieldName.toLowerCase().includes("image") ||
            fieldName.toLowerCase().includes("video") ||
            fieldName.toLowerCase().includes("url") ||
            fieldName.toLowerCase().includes("src") ||
            fieldName.toLowerCase().includes("cover") ||
            fieldName.toLowerCase().includes("thumbnail")
          ) {
            // Exceptions that should stay as plain text
            const isPlainLink = fieldName.toLowerCase().includes("link") && !fieldName.toLowerCase().includes("image")

            if (!isPlainLink) {
              return (
                <MediaField
                  key={fieldName}
                  name={fieldName}
                  value={currentVal}
                  schema={innerDef}
                  onChange={(v) => handleChange(fieldName, v)}
                />
              )
            }
          }

          // Long text fields
          if (
            fieldName === "body" ||
            fieldName === "description" ||
            fieldName === "content" ||
            fieldName.toLowerCase().includes("description")
          ) {
            return (
              <TextareaField
                key={fieldName}
                name={fieldName}
                value={currentVal}
                schema={innerDef}
                onChange={(v) => handleChange(fieldName, v)}
              />
            )
          }

          return (
            <TextField
              key={fieldName}
              name={fieldName}
              value={currentVal}
              schema={innerDef}
              onChange={(v) => handleChange(fieldName, v)}
            />
          )
        })}
      </div>
    </div>
  )
}
