/** biome-ignore-all lint/nursery/noJsxLiterals: ignore */

interface KeyboardShortcutsProps {
  shortcuts: { key: string; description: string }[]
}

export default function KeyboardShortcuts({ shortcuts }: KeyboardShortcutsProps) {
  return (
    <div className="space-y-2.5 rounded border border-gray-200 bg-gray-50 p-2 text-gray-600">
      <h3 className="font-semibold text-gray-800 text-sm">Keyboard Shortcuts</h3>
      <ul className="list-disc space-y-1.5 pl-5 text-xs">
        {shortcuts.map((shortcut) => (
          <li key={shortcut.key}>
            <span className="rounded bg-gray-200 px-1.5 py-0.5 font-mono">{shortcut.key}</span> - {shortcut.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
