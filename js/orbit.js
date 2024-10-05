async function fetchData(name) {
  try {
    const response = await fetch('../database/systemplanet.json');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Parse and return the JSON data
    return data[name]; // Return the JSON data to be used outside
  } catch (error) {
    console.error('Error fetching JSON file:', error);
    return null; // Return null if there was an error
  }
}

let scene, camera, renderer, controls, raycaster, mouse;
planets = [];
texts=[]
let params = new URLSearchParams(document.location.search); //htttp*/?
let name = params.get("name")
console.log(name)


  let  planetDatax=null;


async function init() {
  // bikin scene, camera ,rendere, init biasa ajah
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 20, 50); 
  const canvas = document.getElementById('canvas'); 
  renderer = new THREE.WebGLRenderer({ canvas: canvas }); 
  renderer.setSize(window.innerWidth, window.innerHeight); 
 sun = new THREE.Mesh(

        new THREE.SphereGeometry(2, 30, 30),

        new THREE.MeshBasicMaterial({ color: 0xffffff })

    );

    scene.add(sun);
    
    //add text
     const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry('our star', {
      font: font,
      size: 1,
      height: 0.01,
      curveSegments: 1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const text = new THREE.Mesh(textGeometry, textMaterial);

  
    text.position.set(3, 0.1, 0);

    text.rotateX(3*Math.PI / 2);
    

    
    scene.add(text);
  });//end text
  for (key in planetDatax) {
  const geometry = new THREE.RingGeometry( planetDatax[key][0]+0.3, planetDatax[key][0], 32 ); const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ); const mesh = new THREE.Mesh( geometry, material );
  geometry.rotateX(Math.PI / 2); scene.add( mesh ); 

        const planet = new THREE.Mesh(

            new THREE.SphereGeometry(1.1, 30, 30),

            new THREE.MeshBasicMaterial({ color:  0x3374ff})

        );

        planet.position.x = planetDatax[key][0];

        planet.speed = planetDatax[key][1];

        scene.add(planet);

        planets.push(planet);
//        console.log(planetDatax[key][0],);
const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry(key, {
      font: font,
      size: 1,
      height: 0.01,
      curveSegments: 1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const text = new THREE.Mesh(textGeometry, textMaterial);

  
    text.position.set(planetDatax[key][0]+3, 0, 0);

    text.rotateX(3*Math.PI / 2);
    

    
    scene.add(text);
    texts.push(text);
  });

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
  controls.minDistance = 70;
  controls.maxDistance = 1000;
  controls.target = new THREE.Vector3(0, 0, 0); // Set the target to the center of the scene
  controls.update();

  // Create raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
/*
  // Add event listener for mouse click
  document.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(stars);
    if (intersects.length > 0) {
      const star = intersects[0].object;
      
        alert(`system name: ${star.userData.sysname}`);
     
    }
  });*/
/*
  // Add event listener for text click
  starText.addEventListener('click', () => {
    if (clickedStar) {
      alert(`system name: ${clickedStar.userData.sysname}`);
    }
  });*/
}

async function animate() {
  requestAnimationFrame(animate);
  controls.update();
  
  


    // Rotate each planet around the sun
		let i=0;
    for (key in planetDatax) {

        const planet = planets[i];
				const tex=texts[i];
        planet.position.x = planetDatax[key][0] * Math.cos(Date.now() * planet.speed);
        tex.position.z = planetDatax[key][0] * Math.sin(Date.now() * planet.speed);
        tex.position.x = planetDatax[key][0] * Math.cos(Date.now() * planet.speed);
        planet.position.z = planetDatax[key][0] * Math.sin(Date.now() * planet.speed);
        
        i+=1;

    }
    renderer.render(scene, camera);
}
async function main(){
planetDatax=await fetchData(name);
console.log("yo");
console.log(planetDatax);
 await init();
 await animate();

}
main();
