const dt = 1.0 / 60.0; // seconds

class PhysicsEngine {
  constructor( scene, camera ) {
    this.world = null;
    this.physicsMaterial  = null;
    this.groundBody  = null;
    this.sphereShape = null;
    this.sphereBody = null;
    this.scene = scene;
    this.camera = camera;

    this.mockBoxes = [];
    this.mockBoxMeshes = [];

    this.bullets = [];
    this.bulletMeshes = [];

    this.shotHandler = ( event ) => this.shot( event );
  }

  initialize() {
    // 初始化 cannon.js、重力、碰撞偵測
    const world = new CANNON.World();
    world.gravity.set( 0, -20, 0 );
    world.broadphase = new CANNON.NaiveBroadphase();
    this.world = world;

    // 解算器設定
    const solver = new CANNON.GSSolver();
    solver.iterations = 7;
    solver.tolerance = 0.1;
    const split = true;
    if( split )
      world.solver = new CANNON.SplitSolver( solver );
    else
      world.solver = solver;

    // 接觸材質相關設定（摩擦力、恢復係數）
    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    const physicsMaterial = new CANNON.Material( 'slipperyMaterial' );
    this.physicsMaterial = physicsMaterial;
    const physicsContactMaterial = new CANNON.ContactMaterial(
      physicsMaterial,
      physicsMaterial,
      0.0, // 摩擦力
      0.3 // 恢復係數
    );
    world.addContactMaterial( physicsContactMaterial );

    // 鼠標控制器剛體
    const sphereShape = new CANNON.Sphere( 1.5 );
    const sphereBody = new CANNON.Body( { mass: 5 } );
    sphereBody.addShape( sphereShape );
    sphereBody.position.set( 10, 0, 10 );
    sphereBody.linearDamping = 0.9;
    world.addBody( sphereBody );

    this.sphereShape = sphereShape;
    this.sphereBody = sphereBody;

    this.bindEvents();
  }
  
  uninitialize() {
    this.clearEvents();
  }

  bindEvents() {
    window.addEventListener(
      'click',
      this.shotHandler
    );
  }

  clearEvents() {
    window.removeEventListener(
      'click',
      this.shotHandler
    );
  }

  mock( count ) {
    // Add boxes
    const halfExtents = new CANNON.Vec3( 1, 1, 1 );
    const boxShape = new CANNON.Box( halfExtents );
    const boxGeometry = new THREE.BoxGeometry(
      halfExtents.x * 2,
      halfExtents.y * 2,
      halfExtents.z * 2
    );
  
    for( let i = 0; i < count; i++ ) {
      const x = ( Math.random() - 0.5 ) * 30;
      const y = 10 + ( Math.random() - 0.5 ) * 1;
      const z = ( Math.random() - 0.5 ) * 30;
      const boxBody = new CANNON.Body( { mass: 5 } );
      boxBody.addShape( boxShape );
      const boxMaterial = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff
      });
      const boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );
      this.world.addBody( boxBody );
      this.scene.add( boxMesh );
      boxBody.position.set( x, y, z );
      boxMesh.position.set( x, y, z );
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      this.mockBoxes.push( boxBody );
      this.mockBoxMeshes.push( boxMesh );
    }
  }

  shot( event ) {
    if( !event ) return;

    if( this.bullets.length >= 10 ) {
      for( let i = 0; i < this.bullets.length; i++ ) {
        this.bulletMeshes[i].geometry.dispose();
        this.scene.remove( this.bulletMeshes[i] );
        this.world.remove( this.bullets[i] );
      }
      this.bullets.length = 0;
      this.bulletMeshes.length = 0;
    }

    const ballShape = new CANNON.Sphere( 0.2 );
    const ballGeometry = new THREE.SphereGeometry( ballShape.radius, 32, 32 );
    const shootVelocity = 15;
    const ballMass = 20;
    const ballColor = 0x93882f;

    // 取得目前玩家位置
    const playerBody = this. sphereBody;
    let x = playerBody.position.x;
    let y = playerBody.position.y;
    let z = playerBody.position.z;

    // 子彈剛體與網格
    const ammoBody = new CANNON.Body({ mass: ballMass })
    ammoBody.addShape( ballShape );
    const ammoMaterial = new THREE.MeshStandardMaterial({ color: ballColor });
    const ammoMesh = new THREE.Mesh( ballGeometry, ammoMaterial );
    this.world.addBody( ammoBody );
    this.scene.add( ammoMesh );
    ammoMesh.castShadow = true;
    ammoMesh.receiveShadow = true;
    this.bullets.push( ammoBody );
    this.bulletMeshes.push( ammoMesh );

    // 取得滑鼠在網頁上 (x, y) 位置
    const raycaster = new THREE.Raycaster();
    let shootDirection = new THREE.Vector3();
    let mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

    // 透過 raycaster 取得目前玩家朝向方向
    raycaster.setFromCamera( mouse, this.camera );
    // 取得 raycaster 方向並決定發射方向
    shootDirection.copy( raycaster.ray.direction );

    ammoBody.velocity.set(
      shootDirection.x * shootVelocity,
      shootDirection.y * shootVelocity,
      shootDirection.z * shootVelocity
    );

    // Move the ball outside the player sphere
    x += shootDirection.x * ( this.sphereShape.radius * 1.02 + ballShape.radius );
    y += shootDirection.y * ( this.sphereShape.radius * 1.02 + ballShape.radius );
    z += shootDirection.z * ( this.sphereShape.radius * 1.02 + ballShape.radius );
    ammoBody.position.set( x, y, z );
    ammoMesh.position.set( x, y, z );
  }

  update( navigation ) {
    if( !navigation.enabled ) return;
    
    this.world.step( dt );
    // Update box mesh positions
    const boxes = this.mockBoxes;
    const boxMeshes = this.mockBoxMeshes;
    for( let i = 0; i < boxes.length; i++ ) {
      boxMeshes[i].position.copy( boxes[i].position );
      boxMeshes[i].quaternion.copy( boxes[i].quaternion );
    }

    // Update bullet mesh positions
    const bullets = this.bullets;
    const bulletMeshes = this.bulletMeshes;
    for( let i = 0; i < bullets.length; i++ ) {
      bulletMeshes[i].position.copy( bullets[i].position );
      bulletMeshes[i].quaternion.copy( bullets[i].quaternion );
    }
  }
}