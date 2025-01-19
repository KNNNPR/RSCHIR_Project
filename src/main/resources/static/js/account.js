function logout() {
    window.location.href = 'http://localhost:8080/logout'
}

async function loadUserData() {
    let response = await fetch('http://localhost:8080/load-user-data', {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) alert(response.status)
    let account = await response.json();
    document.getElementById('username').value = account.username;
    document.getElementById('username').style.backgroundColor = account.color;
    document.getElementById('progress').style.backgroundColor = account.color;
    document.getElementById('id').textContent = "ID: " + account.id;
    let account_rofls = {
        photo: account.photo,
        color: account.color
    }
    return account_rofls;
}

async function saveAccount(photo_source, color) {
    let id = document.getElementById('id').textContent.substring(4);
    let username = document.getElementById('username').value;

    let account = {
        id: id,
        username: username,
        photo: photo_source,
        color: color
    }
    let response = await fetch('http://localhost:8080/save-changes', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(account)
    });
    if (!response.ok) alert(response.status)
}

async function loadAllAchievements(account_rofls) {
    const list = document.getElementById('achievement-list');
    list.innerHTML = '';
    let response = await fetch('http://localhost:8080/load-all-achievements', {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) alert(response.status)
    let allAchievement = await response.json();
    let usersAchievement = await loadUsersAchievement();
    allAchievement.forEach(achievement => {
        const li = document.createElement('li');
        let flag = false;
        usersAchievement.forEach(ach =>{
            if (ach.id == achievement.id) {
                flag = true;
            }
        });
        li.classList.add(flag? 'unlocked' : 'locked');
        li.classList.add('achievement-item')
        li.innerHTML = `
            <div class="achievement-content" onclick="toggleDetails(this)">
                <span class="achievement-name">${achievement.name} - ${achievement.description} - ${achievement.exp} XP</span>
            </div>
        `;
        list.appendChild(li);
    });
    const unlockedAchievements = document.querySelectorAll('.achievements ul li.unlocked');
    unlockedAchievements.forEach(achievement => {
        achievement.style.backgroundColor = account_rofls.color
    });
    updateUserProgress(allAchievement, usersAchievement);
}

async function loadUsersAchievement() {
    let idText = document.getElementById('id').textContent;
    let accountId = idText.slice('ID: '.length, idText.length);
    let response = await fetch('http://localhost:8080/load-user-achievements', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: accountId
    });
    if (!response.ok) alert(response.status);
    return await response.json();
}

function updateUserProgress(allAchievement, usersAchievement) {
    var progress = 0;
    usersAchievement.forEach(achievement =>{
        progress += achievement.exp;
    });
    var maxProgress = 0;
    allAchievement.forEach(achievement =>{
        maxProgress += achievement.exp;
    });

    const progressBar = document.querySelector('.progress-bar div');
    progressBar.style.width = maxProgress > 0 ? `${(progress / maxProgress) * 100}%` : '0%';
}


function setRandomImage(account_rofls) {
    document.getElementById('random-photo').src = `/images/${account_rofls.photo}.jpg`;
    document.getElementById('random-photo').style.borderColor = account_rofls.color;
}

function coolSettings(account_rofls) {
    const profileImage = document.getElementById('random-photo');
    const photoModal = document.getElementById('photo-modal');
    const photoSelection = document.getElementById('photo-selection');
    const colorButtons = document.querySelectorAll('.color-btn');
    const applyButton = document.getElementById('applyPhoto');
    const closeButton = document.getElementById('closePhotoModal');

    let selectedPhoto = `/images/${account_rofls.photo}.jpg`;
    let selectedColor = account_rofls.color;

    profileImage.addEventListener('click', () => {
        photoModal.style.display = 'flex';
        loadPhotos();
    });

    closeButton.addEventListener('click', () => {
        photoModal.style.display = 'none';
    });

    function loadPhotos() {
        photoSelection.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const img = document.createElement('img');
            img.src = `/images/${i}.jpg`;
            img.dataset.photo = `/images/${i}.jpg`;
            img.addEventListener('click', () => selectPhoto(img));
            photoSelection.appendChild(img);
        }
    }

    function selectPhoto(img) {
        document.querySelectorAll('#photo-selection img').forEach(photo => {
            photo.classList.remove('selected');
        });
        img.classList.add('selected');
        selectedPhoto = img.dataset.photo;
    }

    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            colorButtons.forEach(btn => btn.style.border = 'none');
            button.style.border = '2px solid black';
            selectedColor = button.dataset.color;
        });
    });

    applyButton.addEventListener('click', async function () {
        if (selectedPhoto) {
            profileImage.src = `${selectedPhoto}`;
        }
        if (selectedColor) {
            profileImage.style.borderColor = selectedColor;
        }
        await saveAccount(selectedPhoto.substring('/images/'.length, selectedPhoto.length - 4), selectedColor);
        photoModal.style.display = 'none';
        location.reload();
    });
}

document.getElementById('username').addEventListener('input', async function() {
    let photo = document.getElementById('random-photo').getAttribute('src');
    let photo_source = photo.substring('/images/'.length, photo.length - 4);
    let element = document.getElementById('username');
    let color = window.getComputedStyle(element).backgroundColor;
    const colorMap = {
        "rgb(255, 0, 0)": "red",
        "rgb(0, 255, 0)": "green",
        "rgb(255, 255, 0)": "yellow",
        "rgb(0, 0, 255)": "blue",
    };
    await saveAccount(photo_source, colorMap[color]);
});


window.addEventListener('DOMContentLoaded', async function() {
    let account_rofls = await loadUserData();
    await loadAllAchievements(account_rofls);
    setRandomImage(account_rofls);
    coolSettings(account_rofls);
});