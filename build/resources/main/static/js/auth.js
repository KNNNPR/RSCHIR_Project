async function registerUser() {
    let name = document.getElementById('register-name').value;
    let email = document.getElementById('register-email').value;
    let password = document.getElementById('register-password').value;
    const data = {
        email,
        password,
        name
    };
    const response = await fetch('http://localhost:8080/sign-up', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        alert(response.status);
    }
    location.reload();
}

let isLogin = true;

function toggleForm(login) {
    isLogin = !isLogin; // Переключаем состояние
    document.getElementById('login-form').style.display = isLogin ? 'block' : 'none';
    document.getElementById('register-form').style.display = isLogin ? 'none' : 'block';
    document.getElementById('toggle-button').innerText = isLogin ? 'Регистрация' : 'Авторизация';
}
