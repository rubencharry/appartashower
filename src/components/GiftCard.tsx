import { useEffect, useState } from 'react';
import type { Gift } from '../lib/types';
import { CATEGORY_EMOJI, CATEGORY_CLASS } from '../lib/categories';
import ClaimModal from './ClaimModal';
import UnclaimModal from './UnclaimModal';

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
  const [showUnclaimModal, setShowUnclaimModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [imgErrored, setImgErrored] = useState(false);
  const [unclaiming, setUnclaiming] = useState(false);

  const claimed = gift.claimed_quantity ?? 0;
  const available = gift.quantity - claimed;
  const isClaimed = available <= 0;
  const isPartial = claimed > 0 && available > 0;

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
          ) : isPartial ? (
            <div className="gift-card__badge gift-card__badge--partial">
              <span>{available} {available === 1 ? 'restante' : 'restantes'}</span>
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

            <div className="gift-card__btn-group">
              {claimed > 0 && (
                <button
                  className="gift-card__btn-unclaim"
                  onClick={claimed > 1 ? () => setShowUnclaimModal(true) : handleUnclaim}
                  disabled={unclaiming}
                >
                  {unclaiming ? '...' : 'Cancelar'}
                </button>
              )}
              {available > 0 && (
                <button
                  className="gift-card__btn"
                  onClick={() => setShowModal(true)}
                >
                  Apartar
                </button>
              )}
            </div>
          </div>

          <p className="gift-card__units">
            {isPartial
              ? `${available} de ${gift.quantity} disponibles`
              : `${gift.quantity} ${gift.quantity === 1 ? 'unidad' : 'unidades'}`}
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

      {showUnclaimModal && (
        <UnclaimModal
          gift={gift}
          onClose={() => setShowUnclaimModal(false)}
          onUnclaimed={(updated) => {
            onUpdate(updated);
            setShowUnclaimModal(false);
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
