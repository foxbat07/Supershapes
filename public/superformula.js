
// essentials
var gui = new dat.GUI();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ antialias: true });
// var spriteMap = new THREE.TextureLoader().load("assets/circle-64.png" );

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var trackBallControls = new THREE.TrackballControls( camera, renderer.domElement );

var lights = [];
var points = [];
var colors = [];
var faces = [];
var geometry;

lights[0] = new THREE.PointLight( 0xffffff, 0, 0 );
lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[3] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[0].position.set( 0, 0, 200 );
lights[1].position.set( 100, 200, 100 );
lights[2].position.set( -100, -100, -100 );
lights[3].position.set( 0, -100, 100 );

var controls = new function() {
    this.researchLink = 'http://paulbourke.net/geometry/supershape/';
    this.backgroundColor = 0x323232;
    this.emissiveColor = 0x000000;
    this.shapeColor1 = 0xffffff;
    this.shapeColor2 = 0x000000;
    this.stripes = 1;
    
    this.radialSegments = 80;
    this.heightSegments = 60;
    this.wireframe = false;

    this.radius = 1;
    this.a1 = 1;
    this.b1 = 1;
    this.m1 = 5;
    this.n11 = 1;
    this.n21 = 1;
    this.n31 = 2;

    this.height = 1;
    this.a2 = 1;
    this.b2 = 1;
    this.m2 = 5;
    this.n12 = 1;
    this.n22 = 1;
    this.n32 = 3;
    
};

var general = gui.addFolder('Superformula 3D | Mohit Hingorani');
general.add(controls,'researchLink').name('Research Link');
general.addColor(controls, 'backgroundColor').name('Background');
general.add(controls, 'wireframe').name('Show Wireframe');
general.add(controls, 'stripes', 1, 3).step(1).name('Stripe Freq');
general.addColor(controls, 'shapeColor1').name('Mesh Color 1');
general.addColor(controls, 'shapeColor2').name('Mesh Color 2');
general.addColor(controls, 'emissiveColor').name('Emissive Color');
general.open();

var f1 = gui.addFolder('Supershape 1');
f1.add(controls, 'radius',1,5);
f1.add(controls, 'a1',0.1,5);
f1.add(controls, 'b1',0.1,5);
f1.add(controls, 'm1',0,100).step(1);
f1.add(controls, 'n11',0.1,10);
f1.add(controls, 'n21',0.1,10);
f1.add(controls, 'n31',0.1,10);
f1.open();

var f2 = gui.addFolder('Supershape 2');
f2.add(controls, 'height',1,5);
f2.add(controls, 'a2',0.1,10);
f2.add(controls, 'b2',0.1,10);
f2.add(controls, 'm2',0,100).step(1);
f2.add(controls, 'n12',0.1,10);
f2.add(controls, 'n22',0.1,10);
f2.add(controls, 'n32',0.1,10);
f2.open();


geometry = new THREE.CylinderGeometry( 1, 1, controls.height, controls.radialSegments, controls.heightSegments, true );
var meshMaterial = new THREE.MeshPhongMaterial( { emissive: 0x000000, side: THREE.DoubleSide, flatShading: true, vertexColors: THREE.FaceColors } );
// var meshMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors, side: THREE.DoubleSide } );			
var superShape = new THREE.Mesh( geometry, meshMaterial );

init();
animate();

function init(){
    camera.position.z = 3;			
    trackBallControls.rotateSpeed = 5;
    trackBallControls.zoomSpeed = 2;

    scene.add(superShape);
    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
    scene.add(lights[3]);
}

function animate() {
    // superShape.rotation.x += 0.005;
    requestAnimationFrame(animate);
    trackBallControls.update();
    render();
};

function render() {
    
    scene.background = new THREE.Color(controls.backgroundColor);
    meshMaterial.wireframe = controls.wireframe;
    meshMaterial.emissive.set(new THREE.Color(controls.emissiveColor));

    // reset variables
    points = [];
    colors = [];
    faces = [];

    for ( var q = 0 ; q < controls.heightSegments + 1; q++)
    {	
        for ( var p = 0 ; p < controls.radialSegments; p++)
        {
            var j = ( q * Math.PI ) / (controls.heightSegments ) - Math.PI/2;
            var i = ( p * 2 * Math.PI ) / (controls.radialSegments ) - Math.PI;
            
            var t11,t21,r1;
            var t12,t22,r2;
            var x,y,z;
            
            t11 = Math.cos((controls.m1 * i) /4 ) / controls.a1;
            t11 = Math.abs(t11);
            t11 = Math.pow(t11,controls.n21);

            t21 = Math.sin((controls.m1 * i) /4 ) / controls.b1;
            t21 = Math.abs(t21);
            t21 = Math.pow(t21,controls.n31);

            r1 = Math.pow(t11+t21, 1/controls.n11);


            t12 = Math.cos((controls.m2 * j) /4 ) / controls.a2;
            t12 = Math.abs(t12);
            t12 = Math.pow(t12,controls.n22);

            t22 = Math.sin((controls.m2 * j) /4 ) / controls.b2;
            t22 = Math.abs(t22);
            t22 = Math.pow(t22,controls.n32);

            r2 = Math.pow(t12+t22, 1/controls.n12);

            if( Math.abs(r1 || r2) == 0 ){
                x = 0;
                y = 0;
                z = 0;
            } else {
                r1 = 1/r1;
                r2 = 1/r2;
                
            x  = r1 * Math.cos(i) * r2 * Math.cos(j);
            y =  r2 * Math.sin(j);
            z =  r1 * Math.sin(i) * r2 * Math.cos(j);
            }
            
            // push the point to points
            points.push( new THREE.Vector3( controls.radius * x, controls.height * y, controls.radius * z ));
        }
    }
    geometry.vertices = points;		// very important
    
    // for ( var i = 0; i < geometry.faces.length - 2; i += 2 ) {
    // 	// var faceColor = Math.random() * 0xffffff;
    // 	geometry.faces[i].color.setHex(0xffffff);
    // 	geometry.faces[i+1].color.setHex(0x000000);
    // }
        
        for ( var i = 0; i < geometry.faces.length; i +=2 ) {
            // var faceColor = Math.random() * 0xffffff;
            // if(parseInt(i/120)%2 == 0) { alternate along long axis
            if(i % (4 * parseInt(controls.stripes)) == 0) {
                geometry.faces[i].color.setHex(controls.shapeColor1);
                geometry.faces[i+1].color.setHex(controls.shapeColor1);
            }
            else {
                geometry.faces[i].color.setHex(controls.shapeColor2);
                geometry.faces[i+1].color.setHex(controls.shapeColor2);
            }
        }
            
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    renderer.render( scene, camera );
}

window.addEventListener( 'resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );
