(() => {
    const $imageButton = $ry(".release-button_image");
    const $content = $ry(".release-input textarea");
    const $file = $ry(".release-file");
    const $send = $ry(".release-button_send");
    const $imagesEl = $ry(".release-img");
    const $usercode = $ry(".release-usercode");

    const fileList = [];
    const preview = (sort, url) => {
        const item_x = document.createElement("div");
        const item = document.createElement("div");
        item_x.className = "iconfont icon-close";
        item.className = "release-img_item";
        item.append(item_x);
        item.setAttribute("sort", sort);
        item.style.backgroundImage = `url(${url})`;
        $imagesEl.append(item);
    };

    $imageButton.click(() => {
        $file.click();
    });

    $send.click(() => {
        if ($content.val().length === 0 && fileList.length === 0) {
            $msg.warning("内容和图片不可以都为空");
            return;
        }
        if (!$usercode.val().includes("-")) {
            $msg.warning("身份码格式错误");
            return;
        }

        const formData = new FormData();
        formData.append("content", $content.val());
        fileList.forEach((item) => {
            formData.append("images", item);
        });
        const upload = document.createElement("div");
        upload.className = "upload";
        const iconfont = document.createElement("div");
        iconfont.className = "iconfont icon-loading";
        upload.append(iconfont);
        const uploadText = document.createElement("div");
        uploadText.innerHTML = "等待中";
        uploadText.className = "upload-text";
        upload.append(uploadText);
        $ry("body").append(upload);
        axios({
            url: "/api/release",
            method: "post",
            data: formData,
            headers: {
                "User-Code": $usercode.val(),
            },
            onUploadProgress: function (progressEvent) {
                const complete =
                    ((progressEvent.loaded / progressEvent.total) * 100) | 0;
                if (complete === 100) {
                    $ry(".upload-text").html("处理中 ^_^");
                } else {
                    $ry(".upload-text").html(`已上传${complete}%`);
                }
            },
        }).then(({ data }) => {
            if (data.code === 0) {
                $ry(".upload-text").html("已完成，即将返回首页 ^_^");
                location.href = "/";
            } else {
                $ry(".upload").remove();
                $msg.error(data.data, 1500);
            }
        });
    });

    $file.on("change", (e) => {
        const _fileList = e.target.files;
        for (let i = 0; i < _fileList.length; i++) {
            const item = _fileList[i];
            if (fileList.length === 9) {
                $msg.warning("图片不得超过9张哦~~~", 1500);
                break;
            }
            if (item.size > 1024 * 1024 * 5) {
                break;
            }
            if (!["image/png", "image/jpeg", "image/gif"].includes(item.type)) {
                break;
            }
            fileList.push(item);
            const sort = fileList.length - 1;
            preview(sort, window.URL.createObjectURL(fileList[sort]));
        }
        $file.val("");
    });

    $imagesEl.on("click", ".icon-close", (e) => {
        const $el = $ry(e.target).parents(".release-img_item");
        fileList.splice(`${$el.attr("sort")}`, 1);
        $el.remove();
        $ry(".release-img_item").each((el, index) => {
            $ry(el).attr("sort", index);
        });
    });
})();
