const dt = 1.0 / 60.0; // seconds

class PhysicsEngine {
  constructor() {
    this.world = null;
    this.physicsMaterial  = null;
    this.groundBody  = null;
    this.sphereShape = null;
    this.sphereBody = null;

    this.mockBoxes = [];
    this.mockBoxMeshes = [];
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
    sphereBody.position.set( 0, 5, 0 );
    sphereBody.linearDamping = 0.9;
    world.addBody( sphereBody );

    this.sphereShape = sphereShape;
    this.sphereBody = sphereBody;
  }
  
  uninitialize() {
  }

  mock( scene, count ) {
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
      scene.add( boxMesh );
      boxBody.position.set( x, y, z );
      boxMesh.position.set( x, y, z );
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      this.mockBoxes.push( boxBody );
      this.mockBoxMeshes.push( boxMesh );
    }
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
  }
}