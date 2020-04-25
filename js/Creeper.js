/**
 * Minecraft Creeper model
 * Ref: https://ithelp.ithome.com.tw/articles/10200287
 */

class Creeper extends THREE.Group {
  constructor() {
    super();

    this.init();

    this.rotateHeadOffset = 0;
    this.walkOffset = 0;
    this.scaleHeadOffset = 0;
    this.walking = false;
    this.headSwinging = false;
    this.bodyScaking = false;
  }

  init() {
    // Geometries for head, body and foot
    
    // Skin Color
    const faceMap = new THREE.TextureLoader().load( 'img/creeper_face.png' );
    const skinMap = new THREE.TextureLoader().load( 'img/creeper_skin.png' ); 

    const skinMat = new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      map: skinMap
    });
    
    const headMaterials = [];
    for( let i = 0; i < 6; i++ ) {
        let map;

        if( i === 4 ) map = faceMap;
        else map = skinMap;

        headMaterials.push(new THREE.MeshStandardMaterial({ map }));
    }

    // head
    const headGeo = new THREE.BoxGeometry( 4, 4, 4 );
    //const creeperMat = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    this.head = new THREE.Mesh( headGeo, headMaterials );
    this.head.position.set( 0, 6, 0 ); 

    this.head.castShadow = true;
    this.head.receiveShadow = true;

    // body
    const bodyGeo = new THREE.BoxGeometry( 4, 8, 2 );
    this.body = new THREE.Mesh( bodyGeo, skinMat );
    this.body.position.set( 0, 0, 0 );
    this.body.castShadow = true;
    this.body.receiveShadow = true;

    // 4 feet
    const footGeo = new THREE.BoxGeometry( 2, 3, 2 );
    this.foot1 = new THREE.Mesh( footGeo, skinMat );
    this.foot1.position.set( -1, -5.5, -2 );
    this.foot1.castShadow = true;
    this.foot1.receiveShadow = true; 

    this.foot2 = this.foot1.clone();
    this.foot2.position.set( -1, -5.5, 2 );

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

  animate() {
    this.headAnimate();
    this.bodyAnimate();
    this.feetAminate();
  } 

  feetAminate() {
    if( !this.walking ) return;

    this.walkOffset += 0.04;
    this.foot1.rotation.x = Math.sin( this.walkOffset ) / 4; // 前腳左
    this.foot2.rotation.x = -Math.sin( this.walkOffset ) / 4; // 後腳左
    this.foot3.rotation.x = -Math.sin( this.walkOffset ) / 4; // 前腳右
    this.foot4.rotation.x = Math.sin( this.walkOffset ) / 4; // 後腳右
  }

  headAnimate() {
      if( !this.headSwinging ) return;

      this.rotateHeadOffset += 0.04;
      this.head.rotation.y = Math.sin( this.rotateHeadOffset );
  }

  bodyAnimate() {
    if( !this.bodyScaling ) return;

    this.scaleHeadOffset += 0.04;

    const scaleRate = Math.abs( Math.sin( this.scaleHeadOffset ) ) / 16 + 1;
    this.scale.set( scaleRate, scaleRate, scaleRate );
  }

  toggleAnimate() {
      this.headSwinging = !this.headSwinging;
      this.bodyScaling = !this.bodyScaling;
      this.walking = !this.walking;
  }
}
