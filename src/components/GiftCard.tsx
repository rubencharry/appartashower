import { useState } from 'react';
import type { Gift } from '../lib/types';
import { CATEGORY_EMOJI } from '../lib/categories';
import ClaimModal from './ClaimModal';

interface Props {
  gift: Gift;
  onUpdate: (gift: Gift) => void;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);
}

function GiftImage({ gift }: { gift: Gift }) {
  const [errored, setErrored] = useState(false);
  const emoji = gift.category ? CATEGORY_EMOJI[gift.category] : '🎁';

  if (errored) {
    return (
      <div className="gift-card__image-placeholder">
        <span>{emoji}</span>
      </div>
    );
  }

  return (
    <img
      src={`/img/${gift.code}.png`}
      alt={gift.name}
      className="gift-card__image"
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

export default function GiftCard({ gift, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [unclaiming, setUnclaiming] = useState(false);
  const isClaimed = Boolean(gift.claimed_by);
  const emoji = gift.category ? CATEGORY_EMOJI[gift.category] : null;

  async function handleUnclaim() {
    setUnclaiming(true);
    try {
      const res = await fetch('/api/unclaim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftId: gift.id }),
      });
      if (res.ok) onUpdate(await res.json());
    } finally {
      setUnclaiming(false);
    }
  }

  const imageWrap = (
    <div className="gift-card__image-wrap">
      <GiftImage gift={gift} />

      {gift.link && (
        <div className="gift-card__link-overlay">
          <span className="gift-card__link-icon">↗</span>
          <span>Ver referencia</span>
        </div>
      )}

      {isClaimed ? (
        <div className="gift-card__badge gift-card__badge--claimed">
          <span>✓</span>
          <span>Apartado</span>
        </div>
      ) : (
        <div className="gift-card__badge gift-card__badge--available">
          <span>Disponible</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className={`gift-card ${isClaimed ? 'gift-card--claimed' : ''}`}>
        {gift.link ? (
          <a href={gift.link} target="_blank" rel="noopener noreferrer" className="gift-card__image-link">
            {imageWrap}
          </a>
        ) : (
          imageWrap
        )}

        <div className="gift-card__body">
          <div className="gift-card__meta">
            {emoji && gift.category && (
              <span className="gift-card__category">
                <span>{emoji}</span>
                <span>{gift.category}</span>
              </span>
            )}
            {gift.location && (
              <span className="gift-card__location">{gift.location}</span>
            )}
          </div>

          <h3 className="gift-card__name">{gift.name}</h3>

          <div className="gift-card__footer">
            <div className="gift-card__price-wrap">
              <span className="gift-card__price">{formatPrice(gift.price)}</span>
              {gift.quantity > 1 && (
                <span className="gift-card__quantity">× {gift.quantity}</span>
              )}
            </div>

            {isClaimed ? (
              <button
                className="gift-card__btn-unclaim"
                onClick={handleUnclaim}
                disabled={unclaiming}
              >
                {unclaiming ? 'Liberando...' : 'Cancelar reserva'}
              </button>
            ) : (
              <button
                className="gift-card__btn"
                onClick={() => setShowModal(true)}
              >
                Apartar
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ClaimModal
          gift={gift}
          onClose={() => setShowModal(false)}
          onClaimed={(updated) => {
            onUpdate(updated);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
