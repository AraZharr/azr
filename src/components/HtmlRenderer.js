export default function HtmlRenderer({ content }) {
  if (!content) return null

  // TipTap JSON leftover → skip render (edit ulang di admin)
  if (typeof content === 'object' || (typeof content === 'string' && content.trim().startsWith('{"type"'))) {
    return (
      <p className="text-sm text-gray-400 italic">
        Konten format lama. Buka di admin → simpan ulang.
      </p>
    )
  }

  return (
    <div
      className="prose prose-sm sm:prose-base max-w-none break-words overflow-x-hidden [&_img]:max-w-full [&_img]:h-auto [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

