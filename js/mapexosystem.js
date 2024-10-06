let scene, camera, renderer, controls, raycaster, mouse;
window.location.href.replace(window.location.search,'');
let starText = document.getElementById('star-text');
let clickedStar = null;
function color(temp){
  if(temp<3500){return 0xfa360a;}
  else if(temp>=3500&&temp<6000){return 0xfad20a;}
  else if(temp>=6500&&temp<10000){return 0xebfcfc;}
  else{return 0x4a9bff;}
  
}
async function fetchData() {
  try {
    const response = await fetch('/tesout.json');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Parse and return the JSON data
    return data; // Return the JSON data to be used outside
  } catch (error) {
    console.error('Error fetching JSON file:', error);
    return null; // Return null if there was an error
  }
}

async function init() {
  // bikin scene, camera ,rendere, init biasa ajah
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 800);
  const canvas = document.getElementById('canvas'); 
  renderer = new THREE.WebGLRenderer({ canvas: canvas }); 
  renderer.setSize(window.innerWidth, window.innerHeight); 

  // bikin bintang merah
  const redStarGeometry = new THREE.SphereGeometry(0.06, 32, 32);
  const redStarMaterial = new THREE.MeshBasicMaterial({ color: 0xf5fa93 });
  const redStar = new THREE.Mesh(redStarGeometry, redStarMaterial);
  redStar.position.set(0,0,0);
  scene.add(redStar);
  // Create the text sprite
  const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry('our star', {
      font: font,
      size: 0.06,
      height: 0.001,
      curveSegments: 1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const text = new THREE.Mesh(textGeometry, textMaterial);

    // Set the text position
    text.position.set(0.23, 0.1, 0);
    //text.rotateZ(Math.PI / 2);
    text.rotateX(3*Math.PI / 2);
    

    // Add the text to the scene
    scene.add(text);
  });
  // Create the yellowish stars
  let stars = [];
  let data= await fetchData();
  for (let obj in data) {
    const starGeometry = new THREE.SphereGeometry(0.08, 32, 32);
    const starMaterial = new THREE.MeshBasicMaterial({ color: color(data[obj]["temperature"]),emissive: 0xffffff,
                                                       emissiveIntensity: 100});
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(data[obj]["xcor"],data[obj]["zcor"],data[obj]["ycor"]); // Random position
    star.userData.sysname = data[obj]["nama_sistem"]; // Generate a random integer and store it in the star
    star.userData.hostname = data[obj]["nama_bintang"];
    scene.add(star);
    stars.push(star);
  }

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
  controls.minDistance = 1;
  controls.maxDistance = 100;
  controls.target = new THREE.Vector3(0, 0, 0); // Set the target to the center of the scene
  controls.update();

  // Create raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Add event listener for mouse click
  document.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(stars);
    if (intersects.length > 0) {
      const star = intersects[0].object;
      window.location.href=("/pages/orbit?name="+star.userData.hostname+"&sistem="+star.userData.sysname);
       // alert(`system name= ${star.userData.hostname}`);
     
    }
  });

  // Add event listener for text click
  starText.addEventListener('click', () => {
    if (clickedStar) {
      window.location.href=("/pages/orbit?name="+star.userData.hostname);
    }
  });
}

async function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
async function main(){
 await init();
 await animate();

}
main();
