"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X, Search, Image as ImageIcon, Video, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaItem {
  id: string
  title: string | null
  type: string
  url: string
  thumbnail: string | null
  muxStatus: string | null
}

interface MediaPickerProps {
  onSelect: (url: string, type: string) => void
  onClose: () => void
  allowedTypes?: ("image" | "video")[]
}

export function MediaPicker({ onSelect, onClose, allowedTypes = ["image", "video"] }: MediaPickerProps) {
  const [items, setItems] = React.useState<MediaItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch("/api/media")
      .then(res => res.json())
      .then(json => {
        if (json.success) setItems(json.data)
        setLoading(false)
      })
  }, [])

  const filtered = items.filter(i => {
    const matchesSearch = i.title?.toLowerCase().includes(search.toLowerCase())
    const matchesType = (allowedTypes as readonly string[]).includes(i.type)
    return matchesSearch && matchesType
  })

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl max-h-[85vh] bg-[var(--background)] border border-[var(--border)] shadow-2xl z-[101] flex flex-col ff-shape-container animate-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
            <div>
              <Dialog.Title className="text-xl font-display font-extrabold text-[var(--foreground)]">
                Medya Seç
              </Dialog.Title>
              <Dialog.Description className="text-xs text-[var(--foreground-muted)] mt-1">
                Kütüphaneden bir görsel veya video seçin.
              </Dialog.Description>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[var(--border)] transition-colors ff-shape-button">
              <X size={20} />
            </button>
          </div>

          {/* Search & Stats */}
          <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--surface-muted)]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-faint)]" size={16} />
              <input
                type="text"
                placeholder="Dosya ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ff-shape-button w-full bg-[var(--background)] border border-[var(--border)] h-10 pl-10 pr-4 text-sm focus:border-[var(--ff-purple)] outline-none transition-all"
              />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--foreground-faint)] font-bold">
              {filtered.length} Dosya
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--ff-purple)]" size={32} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                <ImageIcon size={24} className="mb-2" />
                <p className="text-xs">Medya bulunamadı</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    onDoubleClick={() => onSelect(item.url, item.type)}
                    className={cn(
                      "group relative aspect-square ff-shape-container border-2 transition-all duration-200 overflow-hidden",
                      selectedId === item.id
                        ? "border-[var(--ff-purple)] ring-4 ring-[var(--ff-purple)]/20 scale-[0.98]"
                        : "border-[var(--border)] hover:border-[var(--foreground-muted)]"
                    )}
                  >
                    {item.type === "image" ? (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full relative bg-black flex items-center justify-center">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
                        ) : (
                          <Video size={24} className="text-zinc-700" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video size={20} className="text-white opacity-80" />
                        </div>
                      </div>
                    )}

                    {/* Selected Indicator */}
                    {selectedId === item.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--ff-purple)] text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-200">
                        <Check size={14} />
                      </div>
                    )}

                    {/* Hover Info */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-[9px] text-white truncate font-medium">{item.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--border)] flex items-center justify-end gap-3 bg-[var(--surface)]">
            <button
              onClick={onClose}
              className="ff-shape-button px-6 h-10 border border-[var(--border)] text-sm font-bold hover:bg-[var(--surface-muted)] transition-all"
            >
              Vazgeç
            </button>
            <button
              disabled={!selectedId}
              onClick={() => {
                const item = items.find(i => i.id === selectedId)
                if (item) onSelect(item.url, item.type)
              }}
              className="ff-shape-button px-8 h-10 bg-[var(--ff-purple)] text-white text-sm font-bold hover:bg-[var(--ff-purple-hover)] transition-all disabled:opacity-50"
            >
              Seç ve Ekle
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
