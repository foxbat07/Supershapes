// Superformula.js by Mohit Hingorani

// essentials
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100000 );
var renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    preserveDrawingBuffer: true
});
var spriteMap = new THREE.TextureLoader().load("assets/circle-64.png" );

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var trackBallControls = new THREE.TrackballControls( camera, renderer.domElement );

var lights = [];
var points = [];
var colors = [];
var faces = [];

lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[3] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[0].position.set( 0, -200, 1000 );
lights[1].position.set( -1000, 0, -1000 );
lights[2].position.set( 1000, 0, -1000 );
lights[3].position.set( 0, 500, 1000 );

//split geometry for better control
var geometry = new THREE.CylinderGeometry( 1, 1, controls.height, controls.radialSegments, controls.heightSegments, true );
var lineGeometry = new THREE.CylinderGeometry( 1, 1, controls.height, controls.radialSegments, controls.heightSegments, true );
var pointGeometry = new THREE.CylinderGeometry( 1, 1, controls.height, controls.radialSegments, controls.heightSegments, true );
var quadGeometry = makeQuadLines(geometry);
quadGeometry.addAttribute("position", new THREE.Vector3(0,0,0));

// var meshMaterial = new THREE.MeshNormalMaterial( { side: THREE.DoubleSide } );
var meshMaterial = new THREE.MeshPhongMaterial( { emissive: 0x000000, side: THREE.DoubleSide,vertexColors: THREE.FaceColors } );
// var meshMaterial = new THREE.MeshStandardMaterial( { emissive: 0x000000, side: THREE.DoubleSide, flatShading: false, vertexColors: THREE.FaceColors } );
var pointMaterial = new THREE.PointsMaterial( { color: 0xffffff, map: spriteMap,transparent: true, size: 1 } );
var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
var quadMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
// var quadMaterial = new THREE.LineBasicMaterial({ color: "orange", opacity: 0.3, transparent: true, blending: THREE.AdditiveBlending, vertexColors: false, depthWrite: false, depthTest: true });


var superShape = new THREE.Mesh( geometry, meshMaterial );
var superPoints = new THREE.Points( pointGeometry, pointMaterial );
var superLine = new THREE.Line( lineGeometry, lineMaterial );
var superQuad = new THREE.LineSegments(quadGeometry, quadMaterial);

init();
animate();

function init(){
    camera.position.z = 500;			
    trackBallControls.rotateSpeed = 5;
    trackBallControls.zoomSpeed = 2;

    scene.add(superPoints);
    scene.add(superLine);
    scene.add(superShape);
    scene.add(superQuad);
    
    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
    scene.add(lights[3]);
}

function animate() {
    requestAnimationFrame(animate);
    trackBallControls.update();
    scene.background = new THREE.Color(controls.backgroundColor);

    showShape(controls.form);
    
    superQuad.visible = controls.wireframe;
    meshMaterial.emissive.set(new THREE.Color(controls.emissiveColor));
    lineMaterial.color.set(new THREE.Color(controls.shapeColor1));
    quadMaterial.color.set(new THREE.Color(controls.shapeColor1));
    pointMaterial.color.set(new THREE.Color(controls.shapeColor1));

    render();
};

function render() {
    // reset variables
    vertices = [];
    colors = [];
    faces = [];

    // update shape, we move around each ring of vertices and update the position
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
            
            // push the point to vertices
            vertices.push( new THREE.Vector3( controls.radius * x, controls.height * y, controls.radius * z ));
        }
    }

    // very important
    geometry.vertices = vertices;		
    lineGeometry.vertices = vertices;
    pointGeometry.vertices = vertices;
    
    // update face color 
    for ( var i = 0; i < geometry.faces.length; i +=2 ) {
        // if(parseInt(i/120)%2 == 0) { alternate along long axis
        if(i % (4 * parseInt(controls.stripes)) == 0) {
            geometry.faces[i].color.set(controls.shapeColor1);
            geometry.faces[i+1].color.set(controls.shapeColor1);
        }
        else {
            geometry.faces[i].color.set(controls.shapeColor2);
            geometry.faces[i+1].color.set(controls.shapeColor2);
        }
    }

    pointGeometry.verticesNeedUpdate = true;
    lineGeometry.verticesNeedUpdate = true;
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;

    // quadGeometry = makeQuadLines(geometry);

    renderer.render( scene, camera );
}

window.addEventListener( 'resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

function showShape(form) {
    
    if(form == 'Lines') {
        superLine.visible = true;
        superShape.visible = superPoints.visible = false;
    }
    
    else if(form == 'Points') {
        superPoints.visible = true;
        superShape.visible = superLine.visible = false;
    }
    
    else if(form == 'Fullform') {
        superShape.visible = true;
        superPoints.visible = superLine.visible = false;
    }

    else if(form == 'None') {
        superShape.visible = superPoints.visible = superLine.visible = false;
    }
};