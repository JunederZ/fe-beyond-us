const cockpitButton = document.getElementById('cockpit-button');

cockpitButton.addEventListener('click', () => {
    console.log('Start button clicked');
    document.body.style.opacity = 0;
    setTimeout(() => {
        window.location.href = '/pages/cockpit';
    }, 2000);
})




const stellarButton = document.getElementById('stellar-button');

stellarButton.addEventListener('click', () => {
    console.log('Stellar button clicked');
    document.body.style.opacity = 0;
    setTimeout(() => {
        window.location.href = '/pages/system';
    }, 1);
})
