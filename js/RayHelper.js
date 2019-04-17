class RayHelper {
  constructor( ) {
    this.line = null;
  }

  attach( raycaster, scene ) {
    if( !raycaster || !scene ) return;

    const rayLineGeometry = new THREE.Geometry();
    rayLineGeometry.vertices.push( raycaster.ray.origin.clone() );
    rayLineGeometry.vertices.push( raycaster.ray.origin.clone().add( raycaster.ray.direction.clone().setLength( 10000 ) ) );
    const rayLineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00
    });

    const line = new THREE.Line( rayLineGeometry, rayLineMaterial );
    this.line = line;

    scene.add( line );
  }

  detach( scene ) {
    if( !this.line ) return;

    scene.remove( this.line );
    delete this.line;
    this.line = null;
  }
}