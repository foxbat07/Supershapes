// Source via Thrax S
// https://glitch.com/edit/#!/city-simple?path=public%2Fquadlines.js%3A1%3A0
// https://glitch.com/~city-simple

// This function turns a regular geoemtry into lines that can be attached to a LineSegments mesh. 

function makeQuadLines(typicalGeometry) {
  let geom = typicalGeometry.clone();

  let v0 = new THREE.Vector3();
  let v1 = new THREE.Vector3();
  let v2 = new THREE.Vector3();
  let e0 = new THREE.Vector3();
  let e1 = new THREE.Vector3();
  let e2 = new THREE.Vector3();
  let verts = geom.vertices;
  let lines = [];
  var lsGeometry = new THREE.BufferGeometry();

  var indices = [];
  // console.log("Quad Buffer Geometry");
  if(geom.type=='BufferGeometry'){
    let idx = geom.index.array
    let vts = geom.attributes.position.array
    for (let i = 0,ct = idx.length; i < ct; i+=3) {
      let vi0=idx[i]*3
      let vi1=idx[i+1]*3
      let vi2=idx[i+2]*3
      v0.set(vts[vi0],vts[vi0+1],vts[vi0+2])
      v1.set(vts[vi1],vts[vi1+1],vts[vi1+2])
      v2.set(vts[vi2],vts[vi2+1],vts[vi2+2])
      e0.copy(v1).sub(v0);
      e1.copy(v2).sub(v1);
      e2.copy(v0).sub(v2);
      let d10 = Math.abs(e1.dot(e0));
      let d21 = Math.abs(e2.dot(e1));
      let d02 = Math.abs(e0.dot(e2));
      //find 2 ortho-ish edges
      if (d10 < d21) {
        if (d10 < d02) {
          indices.push(idx[i], idx[i+1], idx[i+1], idx[i+2]);
        } else {
          indices.push(idx[i+1], idx[i+2], idx[i+2], idx[i+0]);
        }
      } else {
        if (d21 < d02) {
          indices.push(idx[i+1], idx[i+2], idx[i+2], idx[i+0]);
        } else {
          indices.push(idx[i+2], idx[i+0], idx[i+0], idx[i+1]);
        }
      }
    }
  }else
  for (let i = 0; i < geom.faces.length; i++) {
    let f = geom.faces[i];
    e0.copy(verts[f.b]).sub(verts[f.a]);
    e1.copy(verts[f.c]).sub(verts[f.b]);
    e2.copy(verts[f.a]).sub(verts[f.c]);
    let d10 = Math.abs(e1.dot(e0));
    let d21 = Math.abs(e2.dot(e1));
    let d02 = Math.abs(e0.dot(e2));

    //find 2 ortho-ish edges
    if (d10 < d21) {
      if (d10 < d02) {
        indices.push(f.a, f.b, f.b, f.c);
      } else {
        indices.push(f.b, f.c, f.c, f.a);
      }
    } else {
      if (d21 < d02) {
        indices.push(f.b, f.c, f.c, f.a);
      } else {
        indices.push(f.c, f.a, f.a, f.b);
      }
    }
  }

  lsGeometry.setIndex(indices);
  lsGeometry.computeBoundingSphere();
  
  if (lsGeometry) {
    lsGeometry.setAttribute("position", new THREE.Vector3(0,0,0));
  }

  // console.log(lsGeometry);
  return lsGeometry;
}

