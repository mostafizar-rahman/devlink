import { initData } from "./data.js"

// ------------- Profile image change
const profileImage = document.getElementById('profile-image')
const imagePreview = document.getElementById('image-preview')
let uploadImage
profileImage.addEventListener("change", (e) => {
    const imgUrl = URL.createObjectURL(e.target.files[0])
    imagePreview.src = imgUrl
    uploadImage = imgUrl

})

const profileForm = document.getElementById("profile-form")
const profileImgPreview = document.getElementById("profile-img-preview")
const userName = document.querySelector(".userName")
const userEmail = document.querySelector(".userEmail")
const fisrtError = document.querySelector(".first-name-error")
const lastError = document.querySelector(".last-name-error")
profileForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const email = document.getElementById('email').value

    if (firstName === "") {
        fisrtError.style.display = "block"
        fisrtError.innerHTML = "Enter Your First Name And Min 3 Letters"
        return
    }
    else if (firstName.length < 3) {
        fisrtError.style.display = "block"
        fisrtError.innerHTML = "Enter Your First Name And Min 3 Letters"
        return
    }
    else if (lastName === "") {
        lastError.style.display = "block"
        lastError.innerHTML = "Enter Your Last Name And Min 3 Letters"
        return
    }
    else if (lastName.length < 3) {
        lastError.style.display = "block"
        lastError.innerHTML = "Enter Your Last Name And Min 3 Letters"
        return
    }
    else {
        fisrtError.style.display = "none"
        lastError.style.display = "none"
    }
    if (uploadImage) {
        profileImgPreview.src = uploadImage
    }
    userName.innerHTML = firstName + ' ' + lastName
    userEmail.innerHTML = email

    toastMessage()
})

function toastMessage() {
    const toast = document.getElementById("toast");
    toast.className = "toast show";

    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}


// 
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
}
addMobilePrevLink()