import DOMPurify from 'isomorphic-dompurify'

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

  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p','br','b','i','u','s','strong','em','sub','sup',
      'h1','h2','h3','h4','h5','h6',
      'ul','ol','li','blockquote','pre','code','hr',
      'a','img','figure','figcaption',
      'table','thead','tbody','tr','th','td','tfoot',
      'span','div','section','iframe',
    ],
    ALLOWED_ATTR: [
      'href','target','rel','src','alt','width','height',
      'class','id','style','title','loading',
      'frameborder','allowfullscreen','allow',
    ],
    ALLOW_DATA_ATTR: false,
  })

  return (
    <div
      className="prose prose-sm sm:prose-base max-w-none break-words overflow-x-hidden [&_img]:max-w-full [&_img]:h-auto [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  )
}
