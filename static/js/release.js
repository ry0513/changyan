(() => {
    const mime = [
        //type:类型，h：16字节标识【根据需要，自行添加】
        { type: "image/png", h: "89504e47" },
        { type: "image/gif", h: "47494638" },
        {
            type: "image/jpeg",
            h: "ffd8ffe0,ffd8ffe1,ffd8ffe2,ffd8ffe3,ffd8ffe8",
        },
        { type: "image/webp", h: "524946461c" },
        { type: "Windows Bitmap/bmp", h: "424D" },
        { type: "TIFF/tif", h: "49492A00" },
        { type: "CAD/dwg", h: "41433130" },
        { type: "Adobe Photoshop/psd", h: "384250" },
    ];
    function check(header) {
        for (let i in mime) {
            let arr = mime[i].h.split(",");
            let offset = (mime[i].offset || -1) + 1; //偏移量
            for (let j in arr) {
                let byte = arr[j].toLowerCase().replace(/\s+/g, "");
                if (header.indexOf(byte) == offset) {
                    return mime[i].type;
                }
            }
        }
        return "unknown";
    }
    function loadMime(file, callback) {
        console.log(file);
        let blob = file.slice(0, 128); //仅获取前128字节。
        let reader = new FileReader();
        reader.onloadend = function (e) {
            let arr = new Uint8Array(e.target.result).subarray(0, 200);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            let type = check(header);
            // return type;
            callback(type);
        };
        reader.readAsArrayBuffer(blob);
    }

    const $imageButton = $ry(".release-button_image");
    const $content = $ry(".release-input textarea");
    const $file = $ry(".release-file");
    const $send = $ry(".release-button_send");
    const $imagesEl = $ry(".release-img");

    const fileList = [];
    const preview = (sort, url) => {
        const item_x = document.createElement("div");
        const item = document.createElement("div");
        item_x.className = "release-img_item_x";
        item.className = "release-img_item";
        item.append(item_x);
        item.setAttribute("sort", sort);
        item.style.backgroundImage = `url(${url})`;
        console.log(item);
        $imagesEl.append(item);
    };

    $imageButton.click(() => {
        $file.click();
    });

    $send.click(() => {
        const formData = new FormData();
        formData.append("content", $content.val());
        fileList.forEach((item) => {
            formData.append("images", item);
        });

        axios({
            url: "/api/release",
            method: "post",
            data: formData,
        }).then(({ data }) => {
            console.log(data);
            // response.data.pipe(fs.createWriteStream("ada_lovelace.jpg"));
        });
    });

    $file.on("change", (e) => {
        const _fileList = e.target.files;
        console.log(_fileList);
        // loadMime(_fileList[0], () => {});
        for (let i = 0; i < _fileList.length; i++) {
            if (fileList.length === 9) {
                $msg.warning("图片不得超过9张哦~~~", 1500);
                break;
            }
            const item = _fileList[i];
            fileList.push(item);
            const sort = fileList.length - 1;
            preview(sort, window.URL.createObjectURL(fileList[sort]));
        }
        $file.val("");
        console.log(fileList[0]);
        console.log(window.URL.createObjectURL(fileList[0]));
    });

    $imagesEl.on("click", ".release-img_item_x", (e) => {
        const $el = $ry(e.target).parents(".release-img_item");
        console.log($el.attr("sort"));
        fileList.splice(`${$el.attr("sort")}`, 1);
        $el.remove();

        $ry(".release-img_item").each((el, index) => {
            $ry(el).attr("sort", index);
        });
        console.log(fileList);
    });
})();
