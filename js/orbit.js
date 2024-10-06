const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById('toggle-button');
const ulbar = document.getElementById("list-planet");
const textcontent=document.getElementById("content");
toggleButton.addEventListener('click', () => {
let tes="show"
  if (sidebar.classList.contains('collapsed')) {
    sidebar.classList.remove('collapsed');
    sidebar.classList.add('expanded');
    tes="show";
  } else {
    sidebar.classList.remove('expanded');
    sidebar.classList.add('collapsed');
    tes="hide";
  }
  console.log(tes);
});
function appendListItem(planetname,colour,starname) {
	planetnames=planetname.replace(/ /g, "%20");
	starname=starname.replace(/ /g, "%20");
  const listItem = document.createElement('li');
  listItem.innerHTML ="<a href=/pages/rplanet?nameplanet="+planetnames+"&namestar="+starname+">"+planetname+"</a>";

  ulbar.appendChild(listItem);
}
function appendText(name,planetnum,distance){
const titlesystem = document.createElement('h1');
const systemdec = document.createElement('p');
titlesystem.innerHTML=name;
systemdec.innerHTML=`this star's system has ${planetnum} planet(s), ${parseInt(distance*3.26)} light years from earth.`;
titlesystem.classList.add("text-content");
systemdec.classList.add("text-content");
textcontent.appendChild(titlesystem );
textcontent.appendChild(systemdec);
}
function typePlanet(inttype){
if(inttype==0){return "rocky";}
else if(inttype==1){return "water";}
else if(inttype==2){return "ice giant";}
else{return "gas giant";}
}

function intToHexColor(intValue) {
  if (intValue < 10) {
    intValue = 10; // Clamp values less than 10 to 10
  } else if (intValue > 20000) {
    intValue = 20000; // Clamp values greater than 20000 to 20000
  }

  let red, green, blue;

  if (intValue <= 500) {
    // Map intValue from 10-500 to red (pure red to greyish red)
    const scale = (intValue - 10) / (500 - 10); // Normalize to [0, 1]
    red = Math.round(255 - 167 * scale); // Transition from FF (255) to 88 (136)
    green = Math.round(0 + 136 * scale); // Transition from 00 (0) to 88 (136)
    blue = Math.round(0 + 136 * scale); // Transition from 00 (0) to 88 (136)
  } else {
    // Map intValue from 500-20000 to greyish red to pure blue
    const scale = (intValue - 500) / (20000 - 500); // Normalize to [0, 1]
    red = Math.round(136 * (1 - scale)); // Transition from 88 (136) to 00 (0)
    green = Math.round(136 * (1 - scale)); // Transition from 88 (136) to 00 (0)
    blue = Math.round(136 + 119 * scale); // Transition from 88 (136) to FF (255)
  }

  // Convert RGB to a hex number
  const hexColor = (red << 16) + (green << 8) + blue;
  
  return hexColor; // Return hex value as number (e.g., 0x888888)
}
async function fetchData(namestar) {
  try {
    const response = await fetch('../data/systemplanet.json');

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
async function fetchData2(namesistem) {
  try {
    const response = await fetch('../data/tesout.json');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Parse and return the JSON data
    return data[namesistem]; // Return the JSON data to be used outside
  } catch (error) {
    console.error('Error fetching JSON file:', error);
    return null; // Return null if there was an error
  }
}

let scene, camera, renderer, controls, raycaster, mouse;
planets = [];
texts=[]
let params = new URLSearchParams(document.location.search); //htttp*/?
let name = params.get("name");
let namesistem=params.get("sistem");
console.log(name)


  let  planetDatax=null;
  let sistemDatax=null;


async function init() {
  // bikin scene, camera ,rendere, init biasa ajah
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 20, 50); 
  const canvas = document.getElementById('canvas'); 
  renderer = new THREE.WebGLRenderer({ canvas: canvas,antialias: true }); 
  renderer.setSize(window.innerWidth, window.innerHeight); 
 sun = new THREE.Mesh(

        new THREE.SphereGeometry(2, 30, 30),

        new THREE.MeshBasicMaterial({ color: 0xffffff })
        //new THREE.MeshBasicMaterial({ color: 0xffffff,map: THREE.ImageUtils.loadTexture('/images/base5.jpg') })


    );

    scene.add(sun);
    
    //add text
     const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry(name, {
      font: font,
      size: 8,
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
  console.log("let "+name+" go "+key);
  appendListItem(key,intToHexColor(planetDatax[key][0]),name);
  const geometry = new THREE.RingGeometry( planetDatax[key][0]+0.3, planetDatax[key][0], 32 ); const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ); const mesh = new THREE.Mesh( geometry, material );
  geometry.rotateX(Math.PI / 2); scene.add( mesh ); 

        const planet = new THREE.Mesh(

            new THREE.SphereGeometry(1.1, 30, 30),

            new THREE.MeshBasicMaterial({ color:  intToHexColor(planetDatax[key][0])})

        );

        planet.position.x = planetDatax[key][0];

        planet.speed = planetDatax[key][1];
        planet.userData.type=planetDatax[key][7];

        scene.add(planet);
	
        planets.push(planet);
//        console.log(planetDatax[key][0],);
const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry(key, {
      font: font,
      size: 10,
      height: 0.01,
      curveSegments: 1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var text = new THREE.Mesh(textGeometry, textMaterial);

  
    text.position.set(planetDatax[key][0]+3, 0.0, 0.0);

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
  controls.minDistance = 40;
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
        tex.position.x = planetDatax[key][0] * Math.cos(Date.now() * planet.speed)+3;
        planet.position.z = planetDatax[key][0] * Math.sin(Date.now() * planet.speed);
        
        i+=1;

    }
    renderer.render(scene, camera);
}
async function main(){
planetDatax=await fetchData(name);
sistemDatax= await fetchData2(namesistem);
appendText(name,sistemDatax["jumlah_planet"],sistemDatax["jarak_parsec"]);
console.log("let it go");
console.log(sistemDatax);
 await init();
 await animate();

}
main();
