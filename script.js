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


    const crackrows = $("#CrackApps");
    const cards = document.querySelectorAll('.card-crack');
    const types = new Set();

    crackrows.html('');
    var bgcolor = "";
    var opacity = "";
    var source = "";
    var available = 0;
    var issues = 0;
    var deleted = 0;
    var total = 0;

    $.getJSON("CardItems.json", function (data) {

        if (data.length === 0) {
            crackrows.append('<div class="col"><h1 class="text-center">No items found!</h1></div>');
            return;
        }

        $.each(data, function (index, item) {
            total++;
            if (item.source === "MediaFire") {
                source = item.source;
                item.source = "MF";
            } else {
                source = item.source;
                item.source = "App";
            }

            if (item.status === "Downloadable") {
                bgcolor = "bg-success";
                opacity = "opacity-100";
                available++;
            } else if (item.status === "Not Working Properly") {
                bgcolor = "bg-warning";
                opacity = "opacity-100";
                issues++;
            } else if (item.status === "Deleted") {
                bgcolor = "bg-danger";
                opacity = "opacity-25";
                deleted++;
            } else {
                bgcolor = "bg-secondary";
            }

            const card = document.createElement('div');
            card.classList.add('col', 'scalein');
            card.dataset.apptype = item.family;
            card.innerHTML = `
            <div class="card h-100 card-crack bg-transparent">
              <img src="${item.image}" class="card-img-top px-5 py-3 rounded" alt="${item.name}">
              <div class="card-body text-bg-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">Version: ${item.version}<br>Size: ${item.size}</p>
                <span class="vstack gap-1">
                <span class="badge text-${bgcolor}">${item.status}</span>
                <span class="badge bg-primary">${item.apptype}</span>
                </span>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary ${opacity}">
                  <a href="${item.link}" class="link-underline link-underline-opacity-0" target="_blank">
                    <svg width="20" height="20" fill="currentColor">
                      <use xlink:href="#${item.source}" />
                    </svg>
                    ${source}
                  </a>
                </small>
              </div>
            </div>
          `;

            types.add(item.family);
            $('#CrackAppsCount').text("There are " + total + " apps available, " + available + " are downloadable, " + issues + " have issues, and " + deleted + " have been deleted.");
            crackrows.append(card);
        });

        // create a all button
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
        button.textContent = 'All';
        button.onclick = () => FilterCrack('All');
        document.querySelector('.hstack').appendChild(button);

        // create a button for each type
        types.forEach(type => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
            button.textContent = type;
            button.id = "btn" + type;
            button.onclick = () => FilterCrack(type);
            document.querySelector('.hstack').appendChild(button);
        });

        function FilterCrack(type) {
            const cards = document.querySelectorAll('.card-crack');
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.classList.remove('text-bg-primary');
                button.classList.add('btn-outline-secondary');
            });
            $('#btn' + type).removeClass('btn-outline-secondary').addClass('text-bg-primary');


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
});

