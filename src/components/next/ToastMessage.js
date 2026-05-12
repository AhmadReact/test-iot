import { useEffect } from 'react';

const tones = {
  success: {
    background: '#dcfce7',
    border: '#86efac',
    text: '#166534',
  },
  error: {
    background: '#fee2e2',
    border: '#fca5a5',
    text: '#991b1b',
  },
  info: {
    background: '#dbeafe',
    border: '#93c5fd',
    text: '#1d4ed8',
  },
};

export default function ToastMessage({ message, type = 'info', onClose, durationMs = 3500 }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => {
      onClose?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, message, onClose]);

  if (!message) return null;
  const tone = tones[type] || tones.info;

  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        top: 16,
        zIndex: 50,
        minWidth: 240,
        maxWidth: 420,
        padding: '10px 12px',
        borderRadius: 10,
        border: `1px solid ${tone.border}`,
        background: tone.background,
        color: tone.text,
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
      }}
      role="status"
      aria-live="polite"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span>{message}</span>
        <button
          type="button"
          onClick={() => onClose?.()}
          style={{
            border: 0,
            background: 'transparent',
            color: tone.text,
            cursor: 'pointer',
            fontWeight: 700,
          }}
          aria-label="Close message"
        >
          x
        </button>
      </div>
    </div>
  );
}
