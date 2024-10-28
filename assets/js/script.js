import { initData } from "./data.js";

const heroLinkContainer = document.querySelector(".hero-link-container");
const addLink = document.getElementById("add-link")

let linkData = JSON.parse(localStorage.getItem('data'));
if (!linkData) {
    localStorage.setItem('data', JSON.stringify(initData));
    linkData = initData;
}

// create custom dropdown start 

function dropdownCall() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach((dropdown) => {
        const dropdownPlaceldor = dropdown.querySelector('.dropdown-placeldor span');
        const dropdownList = dropdown.querySelector('.dropdown-list');
        const dropdownItems = dropdown.querySelectorAll('.dropdown-item');

        // Toggle the dropdown list on click
        dropdown.addEventListener('click', (e) => {
            dropdownList.classList.toggle('active');
        });

        // Update placeholder with selected item
        dropdownItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                const selectTarget = e.target;
                dropdownPlaceldor.innerHTML = selectTarget.innerHTML;
            });
        });

        // Close the dropdown if clicked outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdownList.classList.remove('active');
            }
        });
    });
}
// create custom dropdown end 


// create a single card for every link
function createCard(data) {
    heroLinkContainer.innerHTML = '';

    data.forEach(({ id, link, platfroms, defaultSelect }, index) => {
        const mainDiv = document.createElement('div');
        mainDiv.setAttribute("data-id", id)
        mainDiv.className = 'hero-link';
        mainDiv.innerHTML = `
        <div class="link-card-header">
            <p class="link-title">Link #${index + 1}</p>
            <p class="remove">Remove</p>
        </div>
        <div>
            <label>Platfrom</label>
            <div class="dropdown">
                <p class="dropdown-placeldor" >
                    <span>${defaultSelect.icon} ${defaultSelect.name}</span>
                    <i class="bi bi-chevron-down"></i>
                </p>
                <div class="dropdown-list">
                    ${platfroms.map(plat => `<p class="dropdown-item" id="${id}" data-value=${plat.name.toLowerCase()}>${plat.icon} ${plat.name}</p>`).join('')}
                </div>
            </div>
        </div>
        <div>
            <label for="input-1">Link</label>
            <input type="text" placeholder="Add Link" value=${link} class="link-input-filed">
            <small class="error">Empty</small>
        </div>
        `;
        heroLinkContainer.append(mainDiv)
    })
    dropdownCall();
    // storeLocal(data)
    addMobilePrevLink()
    removeItem()
    cardCallForDarg()

}
createCard(linkData);

// modal start
const modal = document.querySelector(".modal")
const modalClose = document.getElementById("modal-close")
addLink.addEventListener("click", () => {
    modal.classList.add("active")
    newCardItem()
})

modalClose.addEventListener("click", () => {
    modal.classList.remove("active")
})

// modal end

// add new link in the card data
function newCardItem() {
    const linkAddForm = document.getElementById("link-add-form")

    const handleClick = (e) => {
        e.preventDefault();

        const iconInput = document.getElementById("icon-input").value;
        const labelInput = document.getElementById("label-input").value;
        const linkInput = document.getElementById("link-input").value;

        // New platform object
        const newPlatform = {
            id: generateRandomString(5),
            name: labelInput,
            icon: iconInput
        };

        const prevPlatfroms = linkData.length > 0 ? linkData[linkData.length - 1].platfroms : [];

        // Create a new object for the new data entry
        const newObj = {
            id: generateRandomString(6),
            link: linkInput,
            defaultSelect: {
                icon: iconInput,
                name: labelInput
            },
            platfroms: [
                ...prevPlatfroms,
                newPlatform
            ]
        };

        linkData.forEach(item => {
            item.platfroms.push(newPlatform);
        });

        // Push the new object into the data array
        linkData.push(newObj);
        console.log(linkData)
        storeLocal(linkData)
        createCard(linkData);
        // removeItem(linkData)
        // addMobilePrevLink(linkData)
        cardCallForDarg()

        document.getElementById("icon-input").value = ''
        document.getElementById("label-input").value = ''
        document.getElementById("link-input").value = ''

        modal.classList.remove("active")

        // Remove the event listener after it has been triggered
        linkAddForm.removeEventListener('submit', handleClick);
    };
    linkAddForm.addEventListener('submit', handleClick);
}

// Remove item from container
function removeItem() {
    const removes = document.querySelectorAll(".remove")
    removes.forEach((item) => {
        item.addEventListener('click', (e) => {
            // item.parentNode.parentNode.remove()
            const itemId = item.parentNode.parentNode.getAttribute('data-id')

            const withoutDelete = linkData.filter(({ id }) => id != itemId)
            const nowDefaultSelectArray = withoutDelete.map(item => item.defaultSelect);
            const nowItem = withoutDelete.map((prevItem) => {
                return {
                    ...prevItem,
                    platfroms: nowDefaultSelectArray
                }
            })
            linkData = nowItem
            createCard(nowItem)
            storeLocal(nowItem)
            // addMobilePrevLink(nowItem)
        })
    })
}


// darg and drop functionlity 
function cardCallForDarg() {
    const heroLink = document.querySelectorAll(".hero-link");
    let dragSrcEl = null;
    heroLink.forEach((item, index) => {
        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
    });

    function handleDragStart(e) {
        dragSrcEl = this;
        this.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', '');
    }

    function handleDragEnd(e) {
        const updatedData = Array.from(heroLinkContainer.children).map(child => {
            const id = child.getAttribute('data-id');
            return linkData.find(item => item.id == id);
        });
        // Save the updated array to localStorage
        localStorage.setItem('data', JSON.stringify(updatedData));
        linkData = updatedData
        // addMobilePrevLink(updatedData)
        createCard(updatedData)
    }

    function handleDragOver(e) {
        e.preventDefault(); // Required to allow the drop action
        this.style.opacity = '1';
        if (dragSrcEl !== this) {
            // Move the item you're hovering over visually
            const containerChildren = Array.from(heroLinkContainer.children);

            const hoverIndex = containerChildren.indexOf(this);
            const dragIndex = containerChildren.indexOf(dragSrcEl);
            // Visual move: push the hovered item up or down depending on drag position
            if (hoverIndex > dragIndex) {
                heroLinkContainer.insertBefore(dragSrcEl, this.nextSibling);
            } else {
                heroLinkContainer.insertBefore(dragSrcEl, this);
            }
        }

        return false;
    }
}


function linkUpdate() {
    const linksForm = document.getElementById("links-form");

    linksForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isLinkValid = true;

        const updatedData = linkData.map((item) => {
            const card = document.querySelector(`[data-id='${item.id}']`);
            const linkInput = card.querySelector('.link-input-filed').value;
            const error = card.querySelector('.error');

            const selectedDropdown = card.querySelector('.dropdown-placeldor span').innerHTML;

            const parser = new DOMParser();
            const doc = parser.parseFromString(selectedDropdown, 'text/html');
            const selectedIcon = doc.querySelector('i').outerHTML;
            const selectedName = doc.body.textContent.trim();


            if (linkInput.trim() === '') {
                error.style.display = "block";
                error.innerHTML = "Enter Your Link";
                isLinkValid = false;
            } else {
                error.style.display = "none";
                return {
                    ...item,
                    link: linkInput,
                    defaultSelect: {
                        icon: selectedIcon,
                        name: selectedName,
                    },
                };
            }
        });

        if (isLinkValid) {
            storeLocal(updatedData);
            linkData = updatedData;
            addMobilePrevLink();
            toastMessage()
        }
    });
}

linkUpdate();

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


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

function storeLocal(data) {
    const dataConvertString = JSON.stringify(data)
    localStorage.setItem('data', dataConvertString)

}

function toastMessage() {
    const toast = document.getElementById("toast");
    toast.className = "toast show";

    setTimeout(() => {
        toast.className = "toast";
    }, 1000);
}