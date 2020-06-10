var gui = new dat.GUI();

var controls = new function() {
    this.takeImage = function(){ saveAsImage() };
    this.exportShape = function(){ exportGLTF() };
    this.researchLink = function() {window.open('http://paulbourke.net/geometry/supershape/')};
    this.backgroundColor = 0x1a1a1a;
    this.form = 'Fullform';
    this.emissiveColor = 0xa000000;
    this.shapeColor1 = 0xffffff;
    this.stripes = 1;
    this.shapeColor2 = 0x000000;

    this.radialSegments = 80;
    this.heightSegments = 60;
    this.wireframe = false;

    this.radius = 1;
    this.m1 = 5;
    this.n11 = 1;
    this.n21 = 1;
    this.n31 = 2;
    
    this.height = 1;
    this.m2 = 5;
    this.n12 = 1;
    this.n22 = 1;
    this.n32 = 3;
    
    this.a1 = 1;
    this.b1 = 1;
    this.a2 = 1;
    this.b2 = 1;
};

var general = gui.addFolder('Superformula 3D');
general.add(controls, 'takeImage').name('Take screenshot');
general.add(controls, 'exportShape').name('Export Shape (ff)');
general.add(controls, 'researchLink').name('Learn more');
general.open();

var f0 = gui.addFolder('Form & Color');
f0.addColor(controls, 'backgroundColor').name('Background');
f0.add(controls, 'form', [ 'None', 'Lines', 'Points', 'Fullform']);
// f0.add(controls, 'wireframe').name('Show Quad Wireframe');
f0.addColor(controls, 'shapeColor1').name('Mesh Color');
f0.addColor(controls, 'emissiveColor').name('Emissive Color');
f0.add(controls, 'stripes', 0, 3).step(1).name('Stripe Freq');
f0.addColor(controls, 'shapeColor2').name('Stripe Color');
f0.open();

var f1 = gui.addFolder('Supershape 1');
f1.add(controls, 'm1',0,100).step(1).name('m1 - lat freq');
f1.add(controls, 'radius',1,5);
f1.add(controls, 'n11',0.1,10);
f1.add(controls, 'n21',0.1,10);
f1.add(controls, 'n31',0.1,10);
f1.add(controls, 'a1',0.1,10);
f1.add(controls, 'b1',0.1,10);
f1.close();

var f2 = gui.addFolder('Supershape 2');
f2.add(controls, 'm2',0,100).step(1).name('m2 - long freq');
f2.add(controls, 'height',1,5);
f2.add(controls, 'n12',0.1,10);
f2.add(controls, 'n22',0.1,10);
f2.add(controls, 'n32',0.1,10);
f2.add(controls, 'a2',0.1,20);
f2.add(controls, 'b2',0.1,20);
f2.close();
