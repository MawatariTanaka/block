export const playSound = (src) => {
    const allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach((audio) => audio.pause());
    const audio = new Audio(src);
    audio.play();
};
