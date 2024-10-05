const cockpitButton = document.getElementById('cockpit-button');

cockpitButton.addEventListener('click', () => {
    console.log('Start button clicked');
    document.body.style.opacity = 0;
    setTimeout(() => {
        window.location.href = '/pages/cockpit';
    }, 2000);
})