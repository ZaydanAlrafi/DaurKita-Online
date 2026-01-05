export default function GlassCard({ children, className = "" }) {
  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}