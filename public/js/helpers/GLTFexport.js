var gltfExporter = new THREE.GLTFExporter();

// set time and clocks
var date = new Date();
var currentTime = date.getTime();

function exportGLTF( input ) {
    var options = {};

    gltfExporter.parse( input, function ( result ) {
        var fileName = 'supershape-object-'+currentTime;
        if ( result instanceof ArrayBuffer ) {
            saveArrayBuffer( result, fileName +'.glb' );
        } else {
            var output = JSON.stringify( result, null, 2 );
            console.log( output );
            saveString( output, fileName+'.gltf' );
        }

    }, options );

}

function save( blob, filename ) {
    var link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link );

    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
}

function saveString( text, filename ) {
    save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}
