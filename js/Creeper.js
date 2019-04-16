/**
 * Minecraft Creeper model
 * Ref: https://ithelp.ithome.com.tw/articles/10200287
 */

class Creeper extends THREE.Group {
  constructor() {
    super();

    this.init();
  }

  init() {
    // Geometries for head, body and foot
    const headGeo = new THREE.BoxGeometry( 4, 4, 4 );
    const bodyGeo = new THREE.BoxGeometry( 4, 8, 2 );
    const footGeo = new THREE.BoxGeometry( 2, 3, 2 );

    // Skin Color
    const creeperMat = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    // head
    this.head = new THREE.Mesh( headGeo, creeperMat );
    this.head.position.set( 0, 6, 0 );

    // body
    this.body = new THREE.Mesh( bodyGeo, creeperMat );
    this.body.position.set( 0, 0, 0 );

    // 4 feet
    this.foot1 = new THREE.Mesh( footGeo, creeperMat );
    this.foot1.position.set( -1, -5.5, 2 );
    this.foot2 = this.foot1.clone();
    this.foot2.position.set( -1, -5.5, -2 );
    this.foot3 = this.foot1.clone();
    this.foot3.position.set( 1, -5.5, 2 );
    this.foot4 = this.foot1.clone();
    this.foot4.position.set( 1, -5.5, -2 );

    // Combine 4 feet as a group
    this.feet = new THREE.Group();
    this.feet.add( this.foot1 );
    this.feet.add( this.foot2 );
    this.feet.add( this.foot3 );
    this.feet.add( this.foot4 );

    // Put head, body and feet into a single group
    this.add( this.head );
    this.add( this.body );
    this.add( this.feet );
  }
}
