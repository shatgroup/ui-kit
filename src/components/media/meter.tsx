export function Meter({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, value))
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe}>
      <div
        className="h-2 bg-primary"
        // check-ui-ignore-next-line: bề rộng thanh tiến độ là phần trăm động
        style={{ width: `${safe}%` }}
      />
    </div>
  )
}
