const generatecard = (() => {
    return {
        init: async (languageData) => {
            gcard(languageData.card.items.research, "img/research/research_500x500_72ppi.png", "https://research.duckode.com", languageData);
            gcard(languageData.card.items.library, "img/csharplib/topic-csharplib_1024x_144ppi.png", "https://topic-csharplib.duckode.com", languageData);
            gcard(languageData.card.items.game, "img/windowgame(unity)/windowgame(unity)_1024x_72ppi.png", "https://drive.google.com/drive/folders/1Y2YbJTjPOvvKPhIOK-HLZuO4djRawdMp?usp=sharing", languageData);
        },

    }
    async function gcard(t, i, l, languageData) {
        const cardarea = document.querySelector('.card-area');
        const cardbase = document.createElement('div');
        cardbase.className = "card-base";
        cardarea.appendChild(cardbase);
        if (t.trim() !== '') {
            const span = document.createElement('span');
            span.textContent = t;
            cardbase.appendChild(span);
        }
        checkImageSrc(i)
            .then((isValid) => {
                if (isValid) {
                    cardbase.querySelector('.img-buffer').remove();
                    const img = document.createElement('img');
                    cardbase.appendChild(img);
                    img.setAttribute("src", i);
                    img.setAttribute("alt", "");
                    img.setAttribute("draggable", "false");
                } else if (!isValid && t.trim() === '') {
                    cardbase.remove();
                }
                const basebtn = document.createElement('div');
                basebtn.className = "card-btn-base";
                cardbase.appendChild(basebtn);
                const btn = document.createElement('button');
                btn.className = 'card-btn';
                btn.textContent = languageData.card.readmore;
                basebtn.appendChild(btn);
            });
        function checkImageSrc(src) {
            return new Promise((resolve) => {
                var img = new Image();
                const imgbuffer = document.createElement('img');
                imgbuffer.className = 'img-buffer';
                imgbuffer.setAttribute("src", "../img/buffer/buffer_100x100_72ppi.png");
                imgbuffer.setAttribute("alt", "");
                cardbase.appendChild(imgbuffer);
                img.onload = function () {
                    resolve(true);
                };
                img.onerror = function () {
                    resolve(false);
                };
                img.src = src;
            });
        }
        if (l !== null && l !== undefined && l.trim() !== '') {
            clickutils.click(cardbase, 0, () => {
                const a = document.createElement('a')
                a.href = l;
                a.click();
            });
        }
    }
})();
export default generatecard;