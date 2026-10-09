// Renders a string, highlighting every "[placeholder]" segment still to be filled in.
export function Text({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\])/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <mark key={i} className="todo">
            {part.slice(1, -1)}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}
