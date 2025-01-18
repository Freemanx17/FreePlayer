document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const video = document.getElementById("video");
    const playButton = document.getElementById("playButton");
    const urlInput = document.getElementById("urlInput");
    const errorMessage = document.getElementById("errorMessage");
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    // قائمة الروابط المحفوظة
    let watchedLinks = [];

    // تبديل الوضع الليلي
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });

    // تشغيل الفيديو
    playButton.addEventListener("click", () => {
        const url = urlInput.value.trim();

        if (!url) {
            errorMessage.textContent = "الرجاء إدخال رابط صالح.";
            setTimeout(() => (errorMessage.textContent = ""), 3000);
            return;
        }

        // التحقق من الرابط إذا كان من YouTube أو غيره
        if (isYouTubeURL(url) || isUnsupportedPlatform(url)) {
            errorMessage.textContent = "هذا النوع من الروابط غير مدعوم حاليًا.";
            setTimeout(() => (errorMessage.textContent = ""), 3000);
            return;
        }

        if (Hls.isSupported() && url.endsWith(".m3u8")) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            video.play();
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            video.play();
        } else if (isValidVideoURL(url)) {
            video.src = url;
            video.play();
        } else {
            errorMessage.textContent = "هذا الرابط غير مدعوم.";
            setTimeout(() => (errorMessage.textContent = ""), 3000);
        }

        // حفظ الرابط
        if (watchedLinks.length >= 15) {
            watchedLinks.shift(); // إزالة الرابط الأول إذا تجاوز العدد 15
        }
        watchedLinks.push(url);
        updateDropdownMenu();
    });

    // تحديث القائمة المنسدلة
    function updateDropdownMenu() {
        dropdownMenu.innerHTML = "";
        watchedLinks.forEach((url, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}`; // إظهار الأرقام بدلاً من الروابط
            listItem.addEventListener("click", () => playVideoFromLink(url));
            dropdownMenu.appendChild(listItem);
        });
    }

    // تشغيل الفيديو من القائمة
    function playVideoFromLink(url) {
        if (Hls.isSupported() && url.endsWith(".m3u8")) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            video.play();
        } else {
            video.src = url;
            video.play();
        }
    }

    // إظهار القائمة المنسدلة
    dropdownButton.addEventListener("click", () => {
        dropdownMenu.classList.toggle("show");
    });

    // التحقق من رابط يوتيوب
    function isYouTubeURL(url) {
        return url.includes("youtube.com") || url.includes("youtu.be");
    }

    // التحقق من منصات غير مدعومة
    function isUnsupportedPlatform(url) {
        return (
            url.includes("facebook.com") ||
            url.includes("instagram.com") ||
            url.includes("vimeo.com")
        );
    }

    // التحقق من الروابط المدعومة
    function isValidVideoURL(url) {
        return url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg");
    }
});