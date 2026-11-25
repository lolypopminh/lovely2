(function () {
    const STORAGE_ANGER_KEY = 'apology_anger_level';

    function getAngerLevel() {
        const saved = localStorage.getItem(STORAGE_ANGER_KEY);
        if (saved === null || isNaN(Number(saved))) return 50;
        return Math.max(0, Math.min(100, Number(saved)));
    }

    function setAngerLevel(val) {
        const clamped = Math.max(0, Math.min(100, val));
        localStorage.setItem(STORAGE_ANGER_KEY, String(clamped));
        renderMeter();
    }

    function renderMeter() {
        const level = getAngerLevel();
        const meterFill = document.getElementById('meter-fill');
        const bulbLabel = document.getElementById('bulb-label');
        const tempText = document.getElementById('temp-text');
        const statusEmoji = document.getElementById('status-emoji');
        const statusText = document.getElementById('status-text');
        const miniMeterValue = document.getElementById('mini-meter-value');

        if (miniMeterValue) {
            miniMeterValue.innerText = level + '°C';
        }

        if (!meterFill || !bulbLabel || !tempText || !statusEmoji || !statusText) {
            return;
        }

        meterFill.style.height = level + '%';
        bulbLabel.innerText = level + '°';

        if (level >= 75) {
            statusEmoji.innerText = '🤬';
            tempText.innerText = level + '°C — ปรอทแตกแล้ว!';
            statusText.innerText = 'ระดับความโกรธพุ่งสูงมาก เค้าผิดไปแล้วจ้า';
        } else if (level >= 40) {
            statusEmoji.innerText = '😡';
            tempText.innerText = level + '°C — กำลังงอน';
            statusText.innerText = 'ยังงอนอยู่ใช่ไหม ง้อต่ออีกนิดนะ';
        } else if (level > 0) {
            statusEmoji.innerText = '🥺';
            tempText.innerText = level + '°C — เริ่มใจอ่อน';
            statusText.innerText = 'อุณหภูมิเริ่มเย็นลงแล้ว ใกล้หายงอนยังน้า';
        } else {
            statusEmoji.innerText = '🥰';
            tempText.innerText = '0°C — หายงอนแล้ว!';
            statusText.innerText = 'เย็นสบายชื่นใจ เย้! รักที่สุดเลยครับ';
        }
    }

    // Home Page Controls
    const btnForgiven = document.getElementById('btn-forgiven');
    const btnUnforgiven = document.getElementById('btn-unforgiven');

    if (btnForgiven) {
        btnForgiven.addEventListener('click', () => {
            const nextLevel = Math.max(0, getAngerLevel() - 15);
            setAngerLevel(nextLevel);

            if (nextLevel === 0) {
                setTimeout(() => {
                    window.location.href = 'memories.html';
                }, 350);
            }
        });
    }

    if (btnUnforgiven) {
        if (getAngerLevel() >= 100) {
            btnUnforgiven.classList.add('triggered-alert');
        }

        btnUnforgiven.addEventListener('click', () => {
            const nextLevel = Math.min(100, getAngerLevel() + 15);
            setAngerLevel(nextLevel);

            if (nextLevel >= 100) {
                btnUnforgiven.classList.add('triggered-alert');
                setTimeout(() => {
                    window.location.href = 'minigame.html';
                }, 350);
            }
        });
    }

    // Mini Game Page Controls
    const weaponButtons = document.querySelectorAll('.weapon-btn');
    const characterSlot = document.getElementById('character');
    const hitEffect = document.getElementById('hit-effect');
    const attackCaption = document.getElementById('attack-caption');
    const btnResetMeter = document.getElementById('btn-reset-meter');

    if (weaponButtons.length > 0 && characterSlot) {
        weaponButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const weaponName = btn.dataset.weapon;
                const weaponIcon = btn.dataset.icon;
                const effectIcon = btn.dataset.effect;

                const nextLevel = Math.max(0, getAngerLevel() - 10);
                setAngerLevel(nextLevel);

                characterSlot.classList.remove('hit-animation');
                void characterSlot.offsetWidth;
                characterSlot.classList.add('hit-animation');

                const alternateCharacterImage = characterSlot.dataset.hitSrc;
                if (alternateCharacterImage) {
                    characterSlot.src = alternateCharacterImage;
                }

                if (hitEffect) hitEffect.innerText = `${effectIcon} ${weaponIcon} ${effectIcon}`;
                if (attackCaption) {
                    attackCaption.innerText = `โดน "${weaponName}" เข้าเต็มๆ! ความเดือดลดลง 10° (เหลือ ${nextLevel}°C)`;
                }

                setTimeout(() => {
                    if (hitEffect) hitEffect.innerText = '💕';
                }, 450);
            });
        });
    }

    if (btnResetMeter) {
        btnResetMeter.addEventListener('click', () => {
            setAngerLevel(50);
        });
    }

    renderMeter();
})();
