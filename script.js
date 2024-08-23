// initiate tooltip
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

function ShowSidebars() {
    $(".sidebars").css("display", "flex");
}

function HideSidebars() {
    $(".sidebars").css("display", "none");
}

const keyQueue = [];

function CopyKey(key) {
    keyQueue.push(key);
    if (keyQueue.length === 1) {
        processQueue();
    }
}

function processQueue() {
    const key = keyQueue[0];
    navigator.clipboard.writeText(key);
    Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    }).fire({
        icon: 'success',
        title: "'" + key + "'<br><br> Has been copied to your clipboard.",
        didClose: () => {
            keyQueue.shift();
            if (keyQueue.length > 0) {
                processQueue();
            }
        }
    });
}