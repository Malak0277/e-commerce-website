document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const closeBtn = document.querySelector(".closebtn");
    const sidebarToggle = document.querySelector(".sidebar-toggle");

    console.log("Elements found:", {sidebar, closeBtn, sidebarToggle});
    function toggleNav() {
        if (sidebar.style.width === "250px") {
            closeNav();
        } else {
            openNav();
        }
    }

    function openNav() {
        sidebar.style.width = "250px";
        const container = document.getElementById("main2");
        const currentMargin = parseInt(window.getComputedStyle(container).marginLeft) || 0;
        container.style.marginLeft = (currentMargin + 150) + "px";
        sidebar.style.display = "block";
    }

    function closeNav() {
        sidebar.style.width = "0";
        const container = document.getElementById("main2");
        const currentMargin = parseInt(window.getComputedStyle(container).marginLeft) || 0;
        container.style.marginLeft = (currentMargin - 150) + "px";
        sidebar.style.display = "none";
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeNav);
    }
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", toggleNav);
    }
});
