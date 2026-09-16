import { useState } from 'react';
import type { Gift } from '../lib/types';

interface Props {
  gift: Gift;
  onClose: () => void;
  onUnclaimed: (updatedGift: Gift) => void;
}

export default function UnclaimModal({ gift, onClose, onUnclaimed }: Props) {
  const claimed = gift.claimed_quantity ?? 0;
  const [cancelQty, setCancelQty] = useState(claimed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/unclaim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftId: gift.id, cancelQuantity: cancelQty }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Ocurrió un error. Intenta de nuevo.');
        return;
      }

      onUnclaimed(data);
    } catch {
      setError('No se pudo conectar. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }

  const btnLabel = loading
    ? 'Cancelando...'
    : `Cancelar ${cancelQty} ${cancelQty === 1 ? 'unidad' : 'unidades'}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="modal-icon">↩️</div>
        <h2 className="modal-title">¿Cuánto deseas cancelar?</h2>
        <p className="modal-subtitle">
          Reserva de <strong>{gift.name}</strong>
          {' · '}{claimed} {claimed === 1 ? 'unidad apartada' : 'unidades apartadas'}
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-qty">
            <label className="modal-label">Unidades a cancelar</label>
            <div className="modal-qty__controls">
              <button
                type="button"
                className="modal-qty__btn"
                onClick={() => setCancelQty((q) => Math.max(1, q - 1))}
                disabled={cancelQty <= 1}
              >
                −
              </button>
              <span className="modal-qty__value">{cancelQty}</span>
              <button
                type="button"
                className="modal-qty__btn"
                onClick={() => setCancelQty((q) => Math.min(claimed, q + 1))}
                disabled={cancelQty >= claimed}
              >
                +
              </button>
            </div>
            <p className="modal-qty__hint">de {claimed} apartadas</p>
          </div>

          {error && <p className="modal-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="modal-btn modal-btn--danger"
          >
            {btnLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
