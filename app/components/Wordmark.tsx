export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} aria-label="Righton">
      <span aria-hidden="true">
        R<span className="wordmark__i">ı<span className="wordmark__dot" /></span>ghton
      </span>
    </span>
  );
}
