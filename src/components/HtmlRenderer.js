export default function HtmlRenderer({ content }) {
  if (!content) return null
  return (
    <div
      className="prose prose-sm sm:prose-base max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
