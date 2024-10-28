let linkData = JSON.parse(localStorage.getItem('data'));
if (!linkData) {
    localStorage.setItem('data', JSON.stringify(initData));
    linkData = initData;
}
function addMobilePrevLink() {
    const defaultsLinks = document.querySelector(".defaults-links")
    defaultsLinks.innerHTML = '';
    linkData.forEach(({ defaultSelect, id, platfroms, link }) => {
        const div = document.createElement('div');
        div.innerHTML = `
             <p value=${link} title='copy to clipboard' class="link ${defaultSelect.name.toLowerCase()}">
                <span>${defaultSelect.icon} ${defaultSelect.name}</span>
                <i class="bi bi-arrow-right arrow"></i>
            </p>
        `
        defaultsLinks.appendChild(div);
    })
    copyToClipBoard()
}
addMobilePrevLink()

function copyToClipBoard() {
    const links = document.querySelectorAll('.link')
    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            console.log(link.getAttribute('value'))
            navigator.clipboard.writeText(link.getAttribute('value'));
            toastMessage()
        })
    })
}

function toastMessage() {
    const toast = document.getElementById("toast");
    toast.className = "toast show";

    setTimeout(() => {
        toast.className = "toast";
    }, 1000);
}