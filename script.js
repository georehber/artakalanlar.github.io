// Gerekli tüm elemanları seç
const modal = document.getElementById('videoModal');
const modalContent = document.querySelector('.modal-content');
const player = document.getElementById('youtubePlayer');
const closeBtn = document.querySelector('.close-btn');
const fullscreenBtn = document.querySelector('.fullscreen-btn');
const expandBtns = document.querySelectorAll('.expand-btn');

// CSS'teki animasyon süresi (milisaniye)
const transitionDuration = 300; 
let currentVideoSrc = ''; // Oynatılacak videoyu sakla

// --- VİDEOYU AÇMA ANİMASYONU ---
expandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 1. Tıklanılan kartı ve video linkini al
        const card = btn.closest('.video-card');
        currentVideoSrc = btn.getAttribute('data-video-src');
        
        // 2. Kartın ekranın neresinde olduğunu hesapla (merkezini bul)
        const cardRect = card.getBoundingClientRect();
        const originX = cardRect.left + cardRect.width / 2;
        const originY = cardRect.top + cardRect.height / 2;

        // 3. Modal'ın animasyon merkezini (transform-origin) o nokta yap
        modal.style.transformOrigin = `${originX}px ${originY}px`;

        // 4. Modalı göster (CSS animasyonunu tetikle)
        modal.style.display = 'flex';
        
        // Not: display:flex'in uygulanması için küçük bir gecikme
        requestAnimationFrame(() => {
            modal.classList.add('is-visible');
        });

        // 5. (EN ÖNEMLİ DÜZELTME)
        // Videoyu, animasyon bittikten sonra yükle
        setTimeout(() => {
            player.src = currentVideoSrc + "?autoplay=1";
        }, transitionDuration);
    });
});

// --- VİDEOYU KAPATMA ANİMASYONU ---
function closeModal() {
    // Tam ekrandan çık (eğer açıksa)
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }

    // Kapanma animasyonunu başlat
    modal.classList.remove('is-visible');
    
    // Videoyu hemen durdur (sesin devam etmemesi için)
    player.src = ''; 
    
    // Animasyon bittikten sonra modalı DOM'dan gizle
    setTimeout(() => {
        modal.style.display = 'none';
        // Animasyon merkezini sıfırla (bir sonraki açılış için)
        modal.style.transformOrigin = 'center center'; 
    }, transitionDuration);
}

// Kapatma (X) butonuna tıklandığında
closeBtn.onclick = closeModal;

// Modalın dışına (arka plana) tıklandığında
modal.onclick = function(event) {
    if (event.target === modal) { // Sadece arka plana tıklanırsa
        closeModal();
    }
}

// --- TAM EKRAN İŞLEVİ (Değişiklik yok) ---
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        if (modalContent.requestFullscreen) {
            modalContent.requestFullscreen();
        } else if (modalContent.mozRequestFullScreen) {
            modalContent.mozRequestFullScreen();
        } else if (modalContent.webkitRequestFullscreen) {
            modalContent.webkitRequestFullscreen();
        } else if (modalContent.msRequestFullscreen) {
            modalContent.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// Tam ekran durumu değiştiğinde buton simgesini güncelle
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.innerHTML = '&#x2611;'; 
        fullscreenBtn.title = 'Küçült';
    } else {
        fullscreenBtn.innerHTML = '&#x2610'; 
        fullscreenBtn.title = 'Tam Ekran';
    }
});
/* === EASTER EGG (Storymaps Yazınca Linki Aç) === */

// 1. Hedef kelimemizi belirliyoruz
const secretCode = ['s', 't', 'o', 'r', 'y', 'm', 'a', 'p', 's'];
let keyBuffer = []; // Kullanıcının bastığı tuşları tutacağımız yer

// 2. Klavyeden basılan tuşları dinle
window.addEventListener('keydown', (e) => {
    
    // Basılan tuşu al ve küçük harfe çevir
    const key = e.key.toLowerCase();

    // 3. Tuşu hafızaya (buffer) ekle
    keyBuffer.push(key);

    // 4. Hafızayı temiz tut (sadece son 9 tuşu sakla)
    // secretCode'un uzunluğundan (9) daha fazla tuş varsa, en eskisini sil
    keyBuffer.splice(0, keyBuffer.length - secretCode.length);

    // 5. Hafızadaki tuşlar, gizli kodumuzla eşleşiyor mu?
    if (keyBuffer.join('') === secretCode.join('')) {
        
        // 6. EŞLEŞTİ! Şimdi linki bul ve aç.
        // (Link'i HTML'deki storymaps butonundan dinamik olarak alıyoruz)
        const storymapsLinkElement = document.querySelector('.storymaps-nav a');
        
        if (storymapsLinkElement) {
            const storymapsUrl = storymapsLinkElement.href;
            
            // Linki yeni sekmede aç
            window.open(storymapsUrl, '_blank');
            
            // Hafızayı temizle (tekrar yazılabilmesi için)
            keyBuffer = [];
        }
    }
});