import { useState } from 'react';
import type { Gift } from '../lib/types';

interface Props {
  gift: Gift;
  onClose: () => void;
  onClaimed: (updatedGift: Gift) => void;
}

export default function ClaimModal({ gift, onClose, onClaimed }: Props) {
  const available = gift.quantity - (gift.claimed_quantity ?? 0);
  const [name, setName] = useState('');
  const [claimQty, setClaimQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftId: gift.id, claimedBy: name, claimQuantity: claimQty }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Ocurrió un error. Intenta de nuevo.');
        return;
      }

      onClaimed(data);
    } catch {
      setError('No se pudo conectar. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }

  const btnLabel = loading
    ? 'Guardando...'
    : available > 1
    ? `Apartar ${claimQty} ${claimQty === 1 ? 'unidad' : 'unidades'}`
    : 'Apartar regalo';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="modal-icon">🎁</div>
        <h2 className="modal-title">¡Qué detalle tan bonito!</h2>
        <p className="modal-subtitle">
          Vas a apartar <strong>{gift.name}</strong>
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          {available > 1 && (
            <div className="modal-qty">
              <label className="modal-label">¿Cuántas unidades?</label>
              <div className="modal-qty__controls">
                <button
                  type="button"
                  className="modal-qty__btn"
                  onClick={() => setClaimQty((q) => Math.max(1, q - 1))}
                  disabled={claimQty <= 1}
                >
                  −
                </button>
                <span className="modal-qty__value">{claimQty}</span>
                <button
                  type="button"
                  className="modal-qty__btn"
                  onClick={() => setClaimQty((q) => Math.min(available, q + 1))}
                  disabled={claimQty >= available}
                >
                  +
                </button>
              </div>
              <p className="modal-qty__hint">de {available} disponibles</p>
            </div>
          )}

          <label htmlFor="claim-name" className="modal-label">
            ¿Cuál es tu nombre?
          </label>
          <input
            id="claim-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="modal-input"
            maxLength={60}
            required
            autoFocus
          />
          {error && <p className="modal-error">{error}</p>}
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="modal-btn"
          >
            {btnLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
