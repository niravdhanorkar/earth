let container;
let buttons;
let clock;
let list;
let scene;
let rotating;
let universe;
let lineGroups ;
let linesYellow;
let linesWhite;
let linesRed;
let linesBlue;

function initScript() {
  container = document.querySelector('#globalArea');


  // CONTROLLER CONFIG
  const controller = new GIO.Controller(container);

  controller.setTransparentBackground(true);

  controller.init();

  scene = controller.getScene();

  rotating = controller.getRotation();
  console.log('controller', controller)
  const mainGroup = new THREE.Group();

  // LINES GROUP
  linesYellow = new THREE.Group();
  linesWhite = new THREE.Group();
  linesRed = new THREE.Group();
  linesBlue = new THREE.Group();

  // scene.add(linesGrey, linesWhite, linesRed, linesBlue);
  mainGroup.add(linesYellow, linesWhite, linesRed, linesBlue);
  scene.add(mainGroup);
  rotating.add(mainGroup);
  // rotating.add(linesGrey, linesWhite, linesRed, linesBlue);

  // FOR YELLOW LINES
  Array(6)
    .fill()
    .forEach((val, index) => {
      const line = createLine(90, 'yellow');
      line.position.x = 50 - 25 * index;
      line.rotation.y = (Math.PI / 3) * index;

      linesYellow.add(line);
    });

  // FOR WHITE LINES
  Array(6)
    .fill()
    .forEach((val, index) => {
      const whiteLine = createLine(90, '#fff');
      whiteLine.position.x = 30;
      whiteLine.rotation.y = -(Math.PI / 4) * (index + 1);

      linesWhite.add(whiteLine);
    });

  // FOR RED LINES
  Array(5)
    .fill()
    .forEach((val, index) => {
      const line = createLine(90, 'red');
      line.position.x = -50 + 25 * index;
      line.rotation.y = -(Math.PI / 3) * index;

      linesRed.add(line);
    });

  // FOR BLUE LINES
  Array(5)
    .fill()
    .forEach((val, index) => {
      const line = createLine(101, 'blue');
      line.rotation.y = (Math.PI / 4) * 1.5 * index;
      line.position.x = 10 * index;
      line.position.y = -2;
      linesBlue.add(line);
    });

  // FOR BLUE LINES
  Array(2)
    .fill()
    .forEach((val, index) => {
      const line = createLine(105, 'red');
      line.rotation.y = (Math.PI / 2) * (index + 1);
      line.position.x = -1;
      line.position.y = -10;

      linesRed.add(line);
    });

  buttons = document.querySelectorAll('.btn');
  buttons.forEach(button =>
    button.addEventListener('click', e => {
      button.classList.toggle('btn--disabled');

      const group = getLinesGroup(button);
      group.visible = !group.visible;
    })
  );


  clock = new THREE.Clock();

  lineGroups = [linesBlue, linesYellow, linesWhite, linesRed];

  const sphere = controller.getSphere();
  mainGroup.add(sphere);

  let rotateSphere = true;

  universe = createUniverse();
  scene.add(universe);

  rotating.add(universe);

  controller.setAutoRotation(true, 1.5);



  const camera = controller.getCamera();
  camera.position.z = 1200;

  // COUNTRY PICK EVENT
  const countryHeading = document.querySelector('#countryName');
  const countryNameList = document.querySelector('#countryNameList');

  controller.onCountryPicked(country => {
    const zoomedPosition = 1000;
    if (
      country.name === countryHeading.innerText &&
      camera.position.z === zoomedPosition
    ) {
      controller.setAutoRotation(true, 1.5);
      gsap.to(camera.position, { z: 1200, duration: 0.8, delay: 0.2 });
    } else {
      controller.setAutoRotation(false);
      gsap.to(camera.position, { z: zoomedPosition, duration: 0.8 });
    }

    countryHeading.innerText = countryNameList.innerText = country.name;

    // dispatch new event with country data
    var event = new CustomEvent('country-select', { detail: JSON.stringify(country)});
    document.dispatchEvent(event);
    getCountryData(country);
  });

  list = document.querySelector('#citiesList');

  animate();
}


function createLine(radius = 90, color = 'yellow') {
  const segments = 64, // 64
    material = new THREE.LineBasicMaterial({ color }),
    geometry = new THREE.CircleGeometry(radius, segments, 0, 2);
  // geometry = new THREE.CircleGeometry(radius, segments, 0);

  geometry.vertices.shift();

  // Non closed circle with one open segment:
  const line = new THREE.Line(geometry, material);

  // Closed Loop
  // const line = new THREE.LineLoop(geometry, material);
  line.position.x = 60;

  scene.add(line);
  rotating.add(line);
  return line;
}




function getLinesGroup(button) {
  switch (button.getAttribute('data-line-group')) {
    case 'red':
      return linesRed;
    case 'blue':
      return linesBlue;
    case 'yellow':
      return linesYellow;
    case 'white':
      return linesWhite;
  }
}


function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  universe.rotation.x = (elapsed * Math.PI) / 200;
  universe.rotation.y = (elapsed * Math.PI) / 200;

  const rotationFactor = Math.PI / 6;

  lineGroups.forEach(group =>
    group.children.forEach(
      (line, index) =>
        (line.rotation.z = (index + 2) * elapsed * rotationFactor)
    )
  );
}





async function getCountryData({ ISOCode: countryCode }) {
  list.innerHTML = 'Loading...';
  const dataSream = await fetch(
    `https://geo-services-by-mvpc-com.p.rapidapi.com/cities/significant?sort=population%2Cdesc&language=en&countrycode=${countryCode}&pourcent=0.05&limit=10`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'geo-services-by-mvpc-com.p.rapidapi.com',
        'x-rapidapi-key': '09b9b8a67bmsh36f57e28c6fdfd0p17d991jsn07fc4e92911e',
      },
    }
  );

  const { data: cities } = await dataSream.json();

  list.innerHTML = '';

  cities.forEach(city => {
    const li = createListItem(city.name, city.population);
    list.appendChild(li);
  });
}

function createListItem(cityName, value) {
  const li = document.createElement('li');
  li.classList.add('list__item');

  const cityNameElement = document.createElement('span');
  const cityValueElement = document.createElement('span');

  cityNameElement.classList.add('city-name');
  cityValueElement.classList.add('city-name');

  const cityNameText = document.createTextNode(cityName);
  const cityValueText = document.createTextNode(value);

  cityNameElement.appendChild(cityNameText);
  cityValueElement.appendChild(cityValueText);

  li.append(cityNameElement, cityValueElement);

  return li;
}

// BACKGROUND

function createUniverse() {
  var universeMesh = new THREE.Mesh();
  universeMesh.geometry = new THREE.SphereGeometry(500, 128, 128);
  universeMesh.material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('galaxy.png'),
    side: THREE.BackSide,
  });

  return universeMesh;
}

// console.log(universe);
