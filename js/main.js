function createCubeMesh(x, y, z) {
    var geometry = new THREE.BoxGeometry(x, y, z);
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh(geometry, material);
    return cube;
}

function createPlaneMesh(x, y, z) {
    var geometry = new THREE.PlaneGeometry(x, y, z);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);
    return plane;
}

document.body.addEventListener("keydown", e => {
    switch (e.key.toLowerCase()) {
        case ('w'):
            break;

        case ('s'):
            break;

        case ('a'):
            break;

        case ('d'):
            break;
    }
})

document.body.addEventListener("keyup", e => {
    switch (e.key.toLowerCase()) {
        case ('w'):
            break;

        case ('s'):
            break;

        case ('a'):
            break;

        case ('d'):
            break;
    }

})


var blocks = { width: 70, height: 70 }

var cameraPadding = 10;

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(-blocks.width - cameraPadding, blocks.width + cameraPadding, blocks.height + cameraPadding, -blocks.height - cameraPadding, -blocks.height, blocks.height);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
}

// White directional light at half intensity shining from the top.
var directionalLights = [new THREE.DirectionalLight(0xffffff, 0.5), new THREE.DirectionalLight(0xffffff, 0.5), new THREE.DirectionalLight(0xffffff, 0.5)];
scene.add(directionalLights[0]);

directionalLights[0].position.y += 2

var cubes = new Array(blocks.width)
for (var i = 0; i < blocks.width; i++) {
    cubes[i] = new Array(blocks.height)
}

var group = new THREE.Group();

var padding = 0.1;
for (var i = 0; i < blocks.width; i++) {
    for (var j = 0; j < blocks.height; j++) {
        var cube = createCubeMesh(1 - padding, 1 - padding, 1 - padding)
        cube.rotation.x += toRadians(90);
        cube.position.y -= 1;

        cube.position.x = i
        cube.position.z = -j

        cubes[i][j] = cube;
        group.add(cubes[i][j])
    }
}

scene.add(group)

// camera.position.z = 5;
camera.position.x = 0;
camera.position.y = blocks.height / 2;

// var magicAngle = toRadians(Math.atan(1/Math.sqrt(2)));
var magicAngle = toRadians(54.735);

var rotationVectorX = new THREE.Vector3( 1, 0, 0)
var rotationVectorY = new THREE.Vector3( 0, 0, 1)

// var controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.target = new THREE.Vector3(blocks.width / 2, 0, -blocks.height / 2);

var interval = 0.005

var clock = new THREE.Clock()
var deltaTotal = 0;
var intervalCounter = 0;
var planeIndex = 0;
var animationQueue = [];

function distanceTo(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz )
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

var centerPoint = new THREE.Vector3(blocks.width / 2, -1, -blocks.height / 2);

let highestDist = 20;
let lowestDist = 0;

let speed = 5;

var magicAngle = toRadians(54.735);

var rotationVectorX = new THREE.Vector3( 1, 0, 0)
var rotationVectorY = new THREE.Vector3( 0, 1, 0)

group.rotateOnAxis( rotationVectorX, magicAngle);
group.rotateOnAxis( rotationVectorY,  toRadians(45));

function animate() {
    var deltaTime = clock.getDelta();
    deltaTotal += deltaTime;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    let blockWidth = blocks.width;
    for (let y = 0; y < blocks.height; y++) {
        for (let x = 0; x < blocks.width; x++) {
            let cubePos = cubes[x][y].position;
            let cubePosVector = new THREE.Vector3( cubePos.x, cubePos.y, cubePos. z);
            let distanceFromCenter = cubePosVector.distanceTo( centerPoint );

            let speedDelta = Math.sin(deltaTotal * 2);
            let speedDeltaDifference = map_range(speedDelta, -1, 1, 3, 7)
            let delta = Math.sin(deltaTotal / 20);
            let differenceDelta = map_range(delta, -1, 1, 2, 7)

            let distanceRemapped = map_range(distanceFromCenter, 0, 20, -differenceDelta, differenceDelta)

            let sin = Math.sin((deltaTotal * -1 * speed) + distanceRemapped);
            let size = map_range(sin, -1, 1, 10, 30)
            
            cubes[x][y].scale.z = size;
            // cubes[x][y].position.y = size / 2;
    
        }
    }
}
animate();
clock.start()
