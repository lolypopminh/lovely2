    (function () {
      const celebrationLayer = document.getElementById('celebration-layer');
      const showerLoveBtn = document.getElementById('shower-love-btn');
      const envelopeCard = document.getElementById('envelope-card');
      const toggleLetterBtn = document.getElementById('toggle-letter-btn');
      const sealLabel = document.getElementById('seal-label');

      const candleEls = Array.from(document.querySelectorAll('.candle-group'));
      const blowCandlesBtn = document.getElementById('blow-candles-btn');
      const relightCandlesBtn = document.getElementById('relight-candles-btn');
      const wishBanner = document.getElementById('wish-banner');
      const wishStatus = document.getElementById('wish-status');

      const COLORS = ['#e11d48', '#fb7185', '#f59e0b', '#be123c', '#ff4d79'];

      function createParticleSVG(kind, color) {
        if (kind === 'mouse') {
          return `<svg width="28" height="25" viewBox="0 0 36 32" fill="none">
            <circle cx="9" cy="9" r="6.5" fill="#22181c"/>
            <circle cx="27" cy="9" r="6.5" fill="#22181c"/>
            <circle cx="18" cy="19" r="9.5" fill="#22181c"/>
            <path d="M18 11 C14 7, 10 9, 12 13 C13 15, 16 14, 18 12.5 Z" fill="${color}"/>
            <path d="M18 11 C22 7, 26 9, 24 13 C23 15, 20 14, 18 12.5 Z" fill="${color}"/>
          </svg>`;
        }
        return `<svg width="24" height="22" viewBox="0 0 24 22" fill="none">
          <path d="M12 20.5 C12 20.5, 2.5 14, 2.5 8 C2.5 4.8, 5 2.3, 8.2 2.3 C10.1 2.3, 11.3 3.3, 12 4.7 C12.7 3.3, 13.9 2.3, 15.8 2.3 C19 2.3, 21.5 4.8, 21.5 8 C21.5 14, 12 20.5, 12 20.5 Z" fill="${color}" stroke="#22181c" stroke-width="1.8"/>
        </svg>`;
      }

      function spawnLoveBurst(count) {
        for (let i = 0; i < count; i++) {
          const el = document.createElement('div');
          el.className = 'floating-particle';
          const left = 6 + Math.random() * 88;
          const duration = 2.6 + Math.random() * 2.1;
          const delay = Math.random() * 0.55;
          const rot = (Math.random() * 70 - 35).toFixed(1) + 'deg';
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];
          const kind = i % 3 === 0 ? 'mouse' : 'heart';

          el.style.left = left + 'vw';
          el.style.bottom = '-36px';
          el.style.animationDuration = duration + 's';
          el.style.animationDelay = delay + 's';
          el.style.setProperty('--rot', rot);
          el.innerHTML = createParticleSVG(kind, color);

          celebrationLayer.appendChild(el);
          window.setTimeout(function () {
            el.remove();
          }, (duration + delay + 0.2) * 1000);
        }
      }

      showerLoveBtn.addEventListener('click', function () {
        spawnLoveBurst(22);
      });

      // Love Letter Envelope Toggle
      toggleLetterBtn.addEventListener('click', function () {
        const isOpen = envelopeCard.classList.toggle('is-open');
        toggleLetterBtn.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
          sealLabel.textContent = 'Tap the seal to fold your letter';
          spawnLoveBurst(14);
        } else {
          sealLabel.textContent = 'Tap the seal to open your birthday letter';
        }
      });

      // Birthday Candles Logic
      const candleLit = [true, true, true];

      function updateCandleUI() {
        let litCount = 0;
        candleEls.forEach(function (el, idx) {
          if (candleLit[idx]) {
            el.classList.remove('candle-out');
            litCount++;
          } else {
            el.classList.add('candle-out');
          }
        });

        if (litCount === 0) {
          wishBanner.classList.add('wish-complete');
          wishStatus.textContent = 'Happy Birthday, My Love! May every single wish of yours come true!';
          blowCandlesBtn.hidden = true;
          relightCandlesBtn.hidden = false;
          spawnLoveBurst(28);
        } else {
          wishBanner.classList.remove('wish-complete');
          wishStatus.textContent =
            litCount === 1
              ? '1 candle left glowing â€” blow it out to seal your wish!'
              : litCount + ' candles glowing bright â€” make your sweetest wish!';
          blowCandlesBtn.hidden = false;
          relightCandlesBtn.hidden = true;
        }
      }

      candleEls.forEach(function (el, idx) {
        el.addEventListener('click', function () {
          if (candleLit[idx]) {
            candleLit[idx] = false;
            updateCandleUI();
          }
        });

        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (candleLit[idx]) {
              candleLit[idx] = false;
              updateCandleUI();
            }
          }
        });
      });

      blowCandlesBtn.addEventListener('click', function () {
        candleLit[0] = false;
        candleLit[1] = false;
        candleLit[2] = false;
        updateCandleUI();
      });

      relightCandlesBtn.addEventListener('click', function () {
        candleLit[0] = true;
        candleLit[1] = true;
        candleLit[2] = true;
        updateCandleUI();
      });

      // Gentle welcome burst on load
      window.setTimeout(function () {
        spawnLoveBurst(10);
      }, 350);
    })();
