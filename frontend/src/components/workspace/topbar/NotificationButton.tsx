function NotificationButton() {
  return (
    <button
      type="button"
      aria-label="Workspace activity"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-50 shadow-sm transition hover:bg-white"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-stone-900" />
    </button>
  )
}

export default NotificationButton
