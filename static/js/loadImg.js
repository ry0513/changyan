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
                setTimeout(() => {
                    img.src = src;
                    img.onload = () => {
                        el.style.backgroundImage = `url(${src})`;
                        el.classList.remove("loading", "loadImg");
                    };
                    img.onerror = () => {
                        el.classList.remove("loading", "loadImg");
                        el.classList.add("loadImg-err");
                    };
                }, 1000);
            }
        }
    };
    const getOffset = (obj) => {
        const t = obj.offsetTop;
        while (obj.offsetparent) {
            obj = obj.offsetparent;
            t = t + obj.offsetTop;
        }
        return {
            top: t,
            bottom: t + obj.offsetHeight,
        };
    };
    loadImg();
    let timeout = null;
    let startTime = Date.parse(new Date()); // 开始时间
    window.addEventListener("scroll", () => {
        if (timeout !== null) clearTimeout(timeout);
        const curTime = Date.parse(new Date()); // 当前时间
        if (curTime - startTime >= 1000) {
            // 时间差>=1秒直接执行
            loadImg();
            startTime = curTime;
        } else {
            // 否则延时执行，像滚动了一下，差值<1秒的那种也要执行
            timeout = setTimeout(loadImg, 300);
        }
    });
})();
