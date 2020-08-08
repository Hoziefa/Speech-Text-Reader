const elements = {
    main: document.querySelector("main"),
    voicesSelect: document.getElementById("voices"),
    textarea: document.getElementById("text"),
    readBtn: document.getElementById("read"),
    toggleBtn: document.getElementById("toggle"),
    closeBtn: document.getElementById("close"),
    voicesBox: document.getElementById("text-box"),
};

const data = [
    {
        image: "./img/drink.jpg",
        text: "I'm Thirsty",
    },
    {
        image: "./img/food.jpg",
        text: "I'm Hungry",
    },
    {
        image: "./img/tired.jpg",
        text: "I'm Tired",
    },
    {
        image: "./img/hurt.jpg",
        text: "I'm Hurt",
    },
    {
        image: "./img/happy.jpg",
        text: "I'm Happy",
    },
    {
        image: "./img/angry.jpg",
        text: "I'm Angry",
    },
    {
        image: "./img/sad.jpg",
        text: "I'm Sad",
    },
    {
        image: "./img/scared.jpg",
        text: "I'm Scared",
    },
    {
        image: "./img/outside.jpg",
        text: "I Want To Go Outside",
    },
    {
        image: "./img/home.jpg",
        text: "I Want To Go Home",
    },
    {
        image: "./img/school.jpg",
        text: "I Want To Go To School",
    },
    {
        image: "./img/grandma.jpg",
        text: "I Want To Go To Grandmas",
    },
];

const msg = new SpeechSynthesisUtterance();
let voices;

const renderBox = ({ image, text }) => {
    let markup = `<div class="box"><img src="${image}" alt="${text}" /><p class="info">${text}</p></div>`;

    elements.main.insertAdjacentHTML("beforeend", markup);
};

data.forEach(renderBox);

const renderVoice = ({ name, lang }) => {
    let markup = `<option value="${name}">${name} (${lang})</option>`;

    elements.voicesSelect.insertAdjacentHTML("beforeend", markup);
};

const populateVoices = _ => {
    voices = speechSynthesis.getVoices();

    voices.filter(({ lang }) => lang.includes("en")).forEach(renderVoice);
};

const speakVoice = (text, startOver = true) => {
    msg.text = text;

    speechSynthesis.cancel();

    startOver && speechSynthesis.speak(msg);
};

const changeVoiceController = ({ target: { value } }) => {
    msg.voice = voices.find(({ name }) => name.includes(value));

    let speechText = elements.textarea.value.trim().toLowerCase();

    speakVoice(speechText);
};

speechSynthesis.addEventListener("voiceschanged", populateVoices, { once: true });

elements.toggleBtn.addEventListener("click", _ => elements.voicesBox.classList.toggle("show"));

elements.voicesBox.addEventListener("click", ({ currentTarget: voicesContainer, target }) => {
    if (target.matches(".close")) return voicesContainer.classList.remove("show");

    let textVoice = target.closest(".text-box").querySelector("#text").value.trim().toLowerCase();

    target.matches("#read") && speakVoice(textVoice);
});

elements.main.addEventListener("click", ({ currentTarget: main, target }) => {
    if (!target.matches(".box, .box *")) return;

    main.querySelectorAll(".box").forEach(box => box.classList.remove("active"));

    let closestBox = target.closest(".box");

    closestBox?.classList.add("active");

    setTimeout(_ => closestBox?.classList.remove("active"), 1200);

    let speechText = closestBox?.querySelector(".info").textContent.trim().toLowerCase();

    speakVoice(speechText);
});

elements.voicesSelect.addEventListener("change", changeVoiceController);
