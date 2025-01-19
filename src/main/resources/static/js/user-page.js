function logout() {
    window.location.href = 'http://localhost:8080/logout'
}

function redirectToAdmin() {
    localStorage.removeItem('user_id');
    window.location.href = "http://localhost:8080/admin.html";
}

var global_user = {
    color: 'green'
};

window.addEventListener('DOMContentLoaded', async function loadUserData() {
    let userId = localStorage.getItem('user_id');
    let response = await fetch('http://localhost:8080/get-user-info', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: userId
    });
    if (!response.ok) alert(response.status)
    let object = await response.json();
    global_user.color = object.color;
    console.log(global_user);
    document.getElementById('username').textContent = "Имя: " + object.username;
    document.getElementById('id').textContent = "ID: " + object.id;
    setRandomImage(object);
});

async function loadAllAchievements() {
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
        const flag = usersAchievement.some(item => item.id === achievement.id);
        li.classList.add(flag? 'unlocked' : 'locked');
        li.classList.add('achievement-item')
        li.innerHTML = `
            <div class="achievement-content">
                <span class="achievement-name">${achievement.name} - ${achievement.description} - ${achievement.exp} XP</span>
            </div>
            <div class="buttons-container">
                <button onclick="toggleAchievement(${achievement.id})" class = ' ${flag ? 'delete-btn': 'edit-btn'}'>
                            ${flag ? 'Удалить': 'Добавить'}
                        </button>
            </div>
        `;
        list.appendChild(li);
    });
    const unlockedAchievements = document.querySelectorAll('.achievements ul li.unlocked');
    unlockedAchievements.forEach(achievement => {
        achievement.style.backgroundColor = global_user.color
    });
    updateUserProgress(allAchievement, usersAchievement);
}

async function toggleAchievement(achievementId) {
    let achievements = await loadUsersAchievement();
    let element = achievements.find(item => item.id === achievementId);
    let abvg = {
        userId: localStorage.getItem('user_id'),
        achievementId: achievementId
    }
    if (element === undefined) {
        let response = await fetch('http://localhost:8080/add-user-achievement', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(abvg)
        });
        if (!response.ok) alert(response.status)
    } else {
        let response = await fetch('http://localhost:8080/delete-achievement-from-user', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(abvg)
        });
        if (!response.ok) alert(response.status)
    }
    await loadAllAchievements();
    location.reload();
}

async function loadUsersAchievement() {
    let response = await fetch('http://localhost:8080/load-user-achievements', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: localStorage.getItem('user_id')
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
window.addEventListener('DOMContentLoaded', async function() {
    await loadAllAchievements();
});


function setRandomImage(user) {
    document.getElementById('random-photo').src = '/images/' + user.photo + '.jpg';
    document.getElementById('random-photo').style.borderColor = user.color;
    document.getElementById('username').style.backgroundColor = user.color;
    document.getElementById('progress').style.backgroundColor = user.color;
}