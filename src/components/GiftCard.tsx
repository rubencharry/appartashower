import { useEffect, useState } from 'react';
import type { Gift } from '../lib/types';
import { CATEGORY_EMOJI, CATEGORY_CLASS } from '../lib/categories';
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

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export default function GiftCard({ gift, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [imgErrored, setImgErrored] = useState(false);
  const [unclaiming, setUnclaiming] = useState(false);
  const isClaimed = Boolean(gift.claimed_by);
  const emoji = gift.category ? CATEGORY_EMOJI[gift.category] : '🎁';
  const categoryEmoji = gift.category ? CATEGORY_EMOJI[gift.category] : null;
  const categoryClass = gift.category ? CATEGORY_CLASS[gift.category] : '';

  useEffect(() => {
    if (!showLightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowLightbox(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showLightbox]);

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

  return (
    <>
      <div className={`gift-card ${isClaimed ? 'gift-card--claimed' : ''} ${categoryClass}`}>
        <div className="gift-card__image-wrap">
          {imgErrored ? (
            <div className="gift-card__image-placeholder">
              <span>{emoji}</span>
            </div>
          ) : (
            <img
              src={`/img/${gift.code}.webp`}
              alt={gift.name}
              className="gift-card__image"
              loading="lazy"
              onError={() => setImgErrored(true)}
            />
          )}

          {!imgErrored && (
            <button
              className="gift-card__eye-btn"
              onClick={() => setShowLightbox(true)}
              aria-label="Ver imagen completa"
            >
              <EyeIcon />
            </button>
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

          {gift.link && (
            <a
              href={gift.link}
              target="_blank"
              rel="noopener noreferrer"
              className="gift-card__ref-btn"
            >
              ↗ Ver referencia
            </a>
          )}
        </div>

        <div className="gift-card__body">
          <div className="gift-card__meta">
            {categoryEmoji && gift.category && (
              <span className="gift-card__category">
                <span>{categoryEmoji}</span>
                <span>{gift.category}</span>
              </span>
            )}
            {gift.location && (
              <span className="gift-card__location">{gift.location}</span>
            )}
          </div>

          <h3 className="gift-card__name">{gift.name}</h3>

          <div className="gift-card__footer">
            <span className="gift-card__price">
              {formatPrice(gift.price)}
              <span className="gift-card__price-cu">c/u</span>
            </span>

            {isClaimed ? (
              <button
                className="gift-card__btn-unclaim"
                onClick={handleUnclaim}
                disabled={unclaiming}
              >
                {unclaiming ? '...' : 'Cancelar'}
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

          <p className="gift-card__units">
            {gift.quantity} {gift.quantity === 1 ? 'unidad' : 'unidades'}
          </p>
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

      {showLightbox && (
        <div className="lightbox-backdrop" onClick={() => setShowLightbox(false)}>
          <button
            className="lightbox-close"
            onClick={() => setShowLightbox(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>
          <img
            src={`/img/${gift.code}.webp`}
            alt={gift.name}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
