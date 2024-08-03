const key = "e17bd81fabd8224566bdfed36eb8936a";
const unsplashApiKey = 'WQJBe6TDJCuUny2mPJl064XIdnwxqqnkApw0XC2mD2s';
const fallbackImageUrl = 'https://source.unsplash.com/random';

function clearScreen() {
    document.querySelector(".city").innerHTML = "";
    document.querySelector(".temp").innerHTML = "";
    document.querySelector(".text-forecast").innerHTML = "";
    document.querySelector(".humidity").innerHTML = "";
    document.querySelector(".img-forecast").src = "";
}

function displayError(message) {
    clearScreen();
    document.querySelector(".error-message").innerHTML = message;
}

function populatingTheScreen(data) {
    clearScreen();
    document.querySelector(".city").innerHTML = "Tempo em " + data.name;
    document.querySelector(".temp").innerHTML = Math.floor(data.main.temp) + "°C";
    document.querySelector(".text-forecast").innerHTML = data.weather[0].description;
    document.querySelector(".humidity").innerHTML = "Umidade Relativa do Ar: " + data.main.humidity + "%";
    document.querySelector(".img-forecast").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    
    updateBackgroundImage(data.name);
}

async function fetchImage(query) {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashApiKey}`
        );
        const data = await response.json();
        if (data.results.length > 0) {
            return data.results[0].urls.regular;
        } else {
            return fallbackImageUrl;
        }
    } catch (error) {
        return fallbackImageUrl;
    }
}

async function updateBackgroundImage(query) {
    const imageUrl = await fetchImage(query);
    document.querySelector('body').style.backgroundImage = `url(${imageUrl})`;
}

async function searchCity(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`
        );
        if (!response.ok) {
            throw new Error('Cidade não encontrada');
        }
        const data = await response.json();

        populatingTheScreen(data);
        await updateBackgroundImage(city);
        document.querySelector(".error-message").innerHTML = "";
    } catch (error) {
        displayError("Cidade não encontrada. Verifique o nome da cidade e tente novamente.");
    }
}

function clickSearchButton() {
    const city = document.querySelector(".input-city").value;
    searchCity(city);
}
