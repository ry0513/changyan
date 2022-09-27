(() => {
    const loadImg = () => {
        const iH = document.documentElement.clientHeight;
        const t = document.documentElement.scrollTop || document.body.scrollTop;
        const imgList = document.querySelectorAll(".loadImg");
        for (let i = 0; i < imgList.length; i++) {
            const el = imgList[i];
            if (
                !el.stop &&
                getOffset(el).top < iH + t &&
                getOffset(el).bottom > t
            ) {
                el.stop = true;
                const img = new Image();
                const src = el.getAttribute("data-url");
                img.src = src;
                img.onload = () => {
                    el.style.backgroundImage = `url(${src})`;
                    el.classList.remove("loading", "loadImg");
                };
            }
        }
    };
    function getOffset(obj) {
        var t = obj.offsetTop;
        while (obj.offsetparent) {
            obj = obj.offsetparent;
            t = t + obj.offsetTop;
        }
        return {
            top: t,
            bottom: t + obj.offsetHeight,
        };
    }
    loadImg();
    window.addEventListener("scroll", () => {
        loadImg();
    });
})();
