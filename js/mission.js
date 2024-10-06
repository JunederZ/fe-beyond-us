const cockpitButton = document.getElementById('cockpit-button');
const cockpitButton2 = document.getElementById('cockpit-bottom-button');

cockpitButton2.addEventListener('click', () => {
    console.log('Start button clicked');
    document.body.style.opacity = 0;
    setTimeout(() => {
        window.location.href = '/pages/cockpit';
    }, 1500);
})


cockpitButton.addEventListener('click', () => {
    console.log('Start button clicked');
    document.body.style.opacity = 0;
    setTimeout(() => {
        window.location.href = '/pages/cockpit';
    }, 1500);
})

