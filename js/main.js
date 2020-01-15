function createCubeMesh(x, y, z) {
    var geometry = new THREE.BoxGeometry(x, y, z);
    var material = new THREE.MeshLambertMaterial();
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


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
}

var controls = new THREE.OrbitControls(camera, renderer.domElement);


// White directional light at half intensity shining from the top.
var directionalLights = [new THREE.DirectionalLight(0xffffff, 0.5), new THREE.DirectionalLight(0xffffff, 0.5), new THREE.DirectionalLight(0xffffff, 0.5)];
scene.add(directionalLights[0]);

directionalLights[0].position.y += 2

var blocks = { width: 25, height: 25 }

var planes = new Array(blocks.width)
for (var i = 0; i < blocks.width; i++) {
    planes[i] = new Array(blocks.height)
}

var padding = 0.05;
for (var i = 0; i < blocks.width; i++) {
    for (var j = 0; j < blocks.height; j++) {
        var plane = createPlaneMesh(1 - padding, 1 - padding, 1 - padding)
        plane.rotation.x += toRadians(90);
        plane.position.y -= 1;

        plane.position.x = i
        plane.position.z = -j

        planes[i][j] = plane;

        scene.add(planes[i][j])
    }
}

camera.position.z = 10;
camera.position.x = blocks.width / 2;
camera.position.y = 5;
controls.target = new THREE.Vector3( blocks.width / 2, 0, -blocks.height / 2 );
controls.update()

var interval = 0.005

// var cube = createCubeMesh(1, 1, 1);
// scene.add(cube)
console.log(planes)

var clock = new THREE.Clock()
var deltaTotal = 0;
var intervalCounter = 0;
var planeIndex = 0;
var animationQueue = [];

function animate() {
    var deltaTime = clock.getDelta();
    deltaTotal += deltaTime;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    while (deltaTotal > interval) {
        deltaTotal = deltaTotal - interval;

        if (intervalCounter < blocks.width * blocks.height) {
            var j = intervalCounter % blocks.width;
            var i = Math.floor(intervalCounter / blocks.width);

            // planes[i][j].position.y += 1;
            planes[i][j].material.color.setHex( 0xff0000 );

            planeIndex += 1;
        }

        intervalCounter += 1;
    }

    // cube.rotation.x -= 0.05
    // cube.rotation.z -= 0.05

}
animate();
clock.start()