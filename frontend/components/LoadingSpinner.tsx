export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="text-center">
        <div
          className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-solid border-t-transparent"
          style={{ borderColor: '#E1E5EA', borderTopColor: 'transparent', borderRightColor: '#2A9D8F' }}
        />
        <p className="mt-4 text-sm font-medium text-ink-secondary">Loading dashboard…</p>
      </div>
    </div>
  );
}
