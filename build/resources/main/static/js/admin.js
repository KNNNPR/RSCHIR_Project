let achievements = [];

function logout() {
    window.location.href = 'http://localhost:8080/logout'
}

function renderUsers(users) {
    const list = document.getElementById('user-list');
    list.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `${user.username} 
            <button onclick="redirectToUser(${user.id})" class = 'btn edit-btn'>Перейти</button>`;
        list.appendChild(li);
    });
}

function openAchievementModal(achievement = null) {
    let id = (achievement) ? ('с id ' + achievement.id) : '';
    document.getElementById('h3').textContent = 'Добавить/Редактировать Ачивку ' + id;
    document.getElementById('achievement-name').value = achievement ? achievement.name : '';
    document.getElementById('achievement-description').value = achievement ? achievement.description : '';
    document.getElementById('achievement-exp').value = achievement ? achievement.exp : '';
    document.getElementById('achievement-modal').style.display = 'flex';
}

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('achievement-modal').style.display = 'none';
});

document.getElementById('saveAchievement').addEventListener('click', async function() {
    const name = document.getElementById('achievement-name').value;
    const description = document.getElementById('achievement-description').value;
    const exp = parseInt(document.getElementById('achievement-exp').value);

    if (!name || !description || isNaN(exp)) {
        return;
    }

    let h3 = document.getElementById('h3').textContent;
    let account_id = h3.substring('Добавить/Редактировать Ачивку с id '.length, h3.length);
    const existingAchievement = achievements.find(a => a.id === account_id);
    if (account_id) {
        const saveAchievement = {
            id: account_id,
            name: name,
            description: description,
            exp: exp
        };
        let response = await fetch(`http://localhost:8080/save-achievement/${account_id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(saveAchievement)
        });
        if (!response.ok) alert(response.status)
    } else {
        const newAchievement = {
            id: -1,
            name: name,
            description: description,
            exp: exp
        };
        let response = await fetch('http://localhost:8080/save-achievement', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(newAchievement)
        });
        if (!response.ok) alert(response.status)
    }
    await renderAchievements();
    document.getElementById('achievement-modal').style.display = 'none';
});

function editAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    openAchievementModal(achievement);
}

async function deleteAchievement(id) {
    let response = await fetch('http://localhost:8080/delete-achievement', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: id
    });
    if (!response.ok) alert(response.status)
    achievements = achievements.filter(a => a.id !== id);
    await renderAchievements();
}

function redirectToUser(userId) {
    localStorage.setItem('user_id', userId);
    window.location.href = "http://localhost:8080/user-page.html";
}

document.addEventListener('DOMContentLoaded', async function() {
    let responseAchievement = await fetch('http://localhost:8080/load-all-achievements', {
        method: 'GET',
        credentials: 'include'
    });

    if (!responseAchievement.ok) alert(responseAchievement.status);
    await renderAchievements(await responseAchievement.json());

    let responseUsers = await fetch("http://localhost:8080/get-all-users", {
        method: 'GET',
        credentials: 'include'
    });
    if (!responseUsers.status) alert(responseUsers.status)
    renderUsers(await responseUsers.json());
});

document.getElementById('addAchievementBtn').addEventListener('click', function() {
    openAchievementModal();
});

document.getElementById("saveAchievement").addEventListener("click", function(event) {
    event.preventDefault();

    let isValid = true;

    let errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(function(message) {
        message.remove();
    });

    const requiredFields = document.querySelectorAll("#achievement-modal input[required], #achievement-modal textarea[required]");

    requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
            isValid = false;

            field.style.border = "2px solid red";
            let errorMessage = document.createElement("div");
            errorMessage.className = "error-message";
            errorMessage.textContent = "Надо заполнить";
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
        } else {
            field.style.border = "2px solid green";
        }
    });
});

async function renderAchievements() {
    achievements = [];
    const list = document.getElementById('achievement-list');
    list.innerHTML = '';

    let response = await fetch('http://localhost:8080/load-all-achievements', {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) alert(response.status)
    let json = await response.json();
    json.forEach(achievement => {
        achievements.push(achievement);
        const li = document.createElement('li');
        li.classList.add('achievement-item');
        li.innerHTML = `
            <div class="achievement-content" onclick="toggleDetails(this)">
                <span class="achievement-name">${achievement.name}</span>
                <div class="achievement-details" style="display: none;">
                    <p>Описание: ${achievement.description}</p>
                    <p>Опыт: ${achievement.exp} XP</p>
                </div>
            </div>
            <div class="buttons-container">
                <button class="btn edit-btn" onclick="editAchievement(${achievement.id})">Редактировать</button>
                <button class="btn delete-btn" onclick="deleteAchievement(${achievement.id})">Удалить</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function toggleDetails(contentElement) {
    const details = contentElement.querySelector('.achievement-details');
    details.style.display = (details.style.display === 'block') ? 'none' : 'block';
}

