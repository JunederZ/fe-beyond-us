
const nextButton = document.getElementById('next-button');

nextButton.addEventListener('click', () => {
    console.log('Start button clicked');
    document.body.style.opacity = 0;
    setTimeout(() => {
        window.location.href = '/pages/mission.html';
    }, 2000);
})