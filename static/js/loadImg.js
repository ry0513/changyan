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

    const $container = $ry(".container");
    $container.on("click", "[class='card-img_item']", (e) => {
        const $el = $ry(e.target);
        const $parents = $el.parents(".card-img");
        console.log(!$parents.attr("viewer"));

        if (!$parents.attr("viewer")) {
            console.log(444);
            new Viewer($parents.get(), {
                //   button: false,
                //   movable: false,
                initialCoverage: "1",
                toggleOnDblclick: false,
                slideOnTouch: false,
                navbar: false,
                title: false,
                toolbar: false,
                url: (image) => {
                    return $ry(image).attr("data-url").split("@")[0] + "@";
                },
            }).view($el.attr("sort"));
            // viewer;
            $parents.attr("viewer", "true");
        }
        // console.log($el.attr("data-url"));
        // console.log($el.parents(".card-img").get());

        // console.log(document.querySelector(".card-img"));

        // fileList.splice(`${$el.attr("sort")}`, 1);
        // $el.remove();
        // $ry(".release-img_item").each((el, index) => {
        //     $ry(el).attr("sort", index);
        // });
    });
})();
