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

$(document).ready(function () {
    const cards = document.querySelectorAll('.card-crack');
    const types = new Set();
    cards.forEach(card => {
        if (card.parentElement.dataset.apptype) {
            types.add(card.parentElement.dataset.apptype);
        }
    });

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
    button.textContent = 'All';
    button.onclick = () => FilterCrack('All');
    document.querySelector('.hstack').appendChild(button);

    types.forEach(type => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
        button.textContent = type;
        button.onclick = () => FilterCrack(type);
        document.querySelector('.hstack').appendChild(button);
    });

    function FilterCrack(type) {
        const cards = document.querySelectorAll('.card-crack');
        cards.forEach(card => {
            if (type === 'All') {
                card.parentElement.style.display = 'block';
            } else if (card.parentElement.dataset.apptype === type) {
                card.parentElement.style.display = 'block';
            } else {
                card.parentElement.style.display = 'none';
            }
        });
    }
});

