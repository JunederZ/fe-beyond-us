const textcontent=document.getElementById("content");
function appendText(name,contentext){
const titlesystem = document.createElement('h1');
const systemdec = document.createElement('p');
titlesystem.innerHTML=name;
systemdec.innerHTML=contentext;
systemdec.classList.add("text-content");
textcontent.appendChild(titlesystem );
textcontent.appendChild(systemdec);
}

function typeTexture(inte){
if(inte==1){return "1_merahbanget.png";}
else if(inte==2){return "2_merahdikit.png";}  
else if(inte==3){return "3_merahmars.png";}    
else if(inte==4){return "4_kuning.png";}
else if(inte==5){return "5_putihabuabu.png";}
else if(inte==6){return "6_birudikitmerah.png";}
else {return "7_birubanget.png";}    
}
function typePlanet(inttype){
if(inttype==0){return "a rocky planet, perfect for playing rock paper scissor!";}
else if(inttype==1){return "a water planet, or mostly covered by water, wanna swim?";}
else if(inttype==2){return "wow the \"ice giant\", maybe it has big ice cream?";}
else{return "its a gas giant,maybe we should cover our nose!";}
}

async function fetchData(namestar) {
  try {
    const response = await fetch('/systemplanet.json');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Parse and return the JSON data
    return data[namestar]; // Return the JSON data to be used outside
  } catch (error) {
    console.error('Error fetching JSON file:', error);
    return null; // Return null if there was an error
  }
}
let scene, camera, renderer, controls, raycaster, mouse;
let params = new URLSearchParams(document.location.search); //htttp*/?namestar=&nameplanet=
let namestar = params.get("namestar");
let nameplanet = params.get("nameplanet");
let stardata=null;
let planetdata=null;


async function init() {
  // bikin scene, camera ,rendere, init biasa ajah
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 800);
  const canvas = document.getElementById('canvas'); 
  renderer = new THREE.WebGLRenderer({ canvas: canvas }); 
  renderer.setSize(window.innerWidth, window.innerHeight); 

  // bikin bintang merah
  const redStarGeometry = new THREE.SphereGeometry(4, 32, 32);
  const redStarMaterial = new THREE.MeshBasicMaterial({ color: 0xf5fa93,map: THREE.ImageUtils.loadTexture("/images/"+typeTexture(planetdata[7])) });
  const redStar = new THREE.Mesh(redStarGeometry, redStarMaterial);
  redStar.position.set(0,0,0);
  scene.add(redStar);
  starTexture = new THREE.TextureLoader().load('/images/starback.jpg');
 starTexture.encoding = THREE.sRGBEncoding;
   starTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = starTexture;
 
 

  // Add lighting to the scene
  const ambientLight = new THREE.AmbientLight(0x444444);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(0, 0, -5);
  scene.add(pointLight);

  // Create OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 70;
  controls.target = new THREE.Vector3(0, 0, 0); // Set the target to the center of the scene
  controls.update();

  // Create raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

 

 
}

async function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
async function main(){
 stardata=await fetchData(namestar);
 planetdata=stardata[nameplanet];
 appendText(nameplanet,typePlanet(planetdata[8]));
 await init();
 await animate();

}
main();










