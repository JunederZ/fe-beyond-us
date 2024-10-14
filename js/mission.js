const cockpitButton = document.getElementById('cockpit-button');
const cockpitButton2 = document.getElementById('cockpit-bottom-button');

cockpitButton.addEventListener('click', () => {
    console.log('Start button clicked');
    setTimeout(() => {
        window.location.href = '/pages/cockpit';
    }, 1);
})

cockpitButton2.addEventListener('click', () => {
    console.log('Start button clicked');
    setTimeout(() => {
        window.location.href = '/pages/cockpit';
    }, 1);
})





const stellarButton = document.getElementById('stellar-button');
const stellarButton2 = document.getElementById('stellar-bottom-button');

stellarButton.addEventListener('click', () => {
    console.log('Stellar button clicked');
    setTimeout(() => {
        window.location.href = '/pages/system';
    }, 1);
})
stellarButton2.addEventListener('click', () => {
    console.log('Stellar button clicked');
    setTimeout(() => {
        window.location.href = '/pages/system';
    }, 1);
})



