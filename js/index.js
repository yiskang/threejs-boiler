// Put your three.js codes below
(function() {

    // Prepare stage scene
    const scene = new THREE.Scene();

    // Add actors of this scene

    // Axes helper
    const axes = new THREE.AxesHelper( 20 );
    scene.add( axes ); 

    // Creeper
    const creeper = new Creeper();
    scene.add( creeper );
    creeper.toggleAnimate();

    // Ground
    const planeGeometry = new THREE.PlaneGeometry( 60, 60 );
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true; 

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set( 0, -7, 0 );
    scene.add( plane ); 
  
    // Add camera
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 30, 30, 30 );
    camera.lookAt( scene.position );
  
    // Set up stage light
    const spotLight = new THREE.SpotLight( 0xffffff, 5, 50 );
    spotLight.position.set( -10, 20, 20 );
    scene.add( spotLight );

    const spotLightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add( spotLightHelper ); 

    const ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add( ambientLight ); 

    const pointLight = new THREE.PointLight( 0xccffcc, 1, 100 );
    pointLight.castShadow = true;
    pointLight.position.set( -30, 30, 30 );
    scene.add( pointLight );
  
    // Set up renderer
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xeeeeee, 1.0 );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
    document.body.appendChild( renderer.domElement );

    const navTool = new THREE.OrbitControls( camera, renderer.domElement );
    navTool.enableDamping = true;
    navTool.dampingFactor = 0.25;
  
    // Start rendering.
    function render() {
      navTool.update();

      creeper.animate();

      requestAnimationFrame( render );
      renderer.render( scene, camera );
    }
  
    render();

    window.addEventListener( 'resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );
    });

    const animateBtn = document.getElementById( 'animate' );

    animateBtn.addEventListener( 'click', function() {
        creeper.toggleAnimate();
    });


    const rayHelper = new RayHelper();

    renderer.domElement.addEventListener( 'dblclick', function( event ) {
      rayHelper.detach( scene );

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2()
  
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
  
      raycaster.setFromCamera( mouse.clone(), camera );
      
      rayHelper.attach( raycaster, scene );

  
      const intersects = raycaster.intersectObjects( creeper.children );
  
      console.log( intersects );
  
      const result = intersects[0];
  
      if( !result ) return;

      console.log( result );

      const hitPoint = result.point;
      const backVec = hitPoint.clone().add( raycaster.ray.direction.clone().setLength( 10000 ) );
      const backVecH = backVec.projectOnPlane( new THREE.Vector3( 0, 1, 0 ) );
      backVecH.normalize();

      const backwardVec = backVecH.multiplyScalar( 5 );
      const newPos = creeper.position.clone().add( backwardVec );
      creeper.position.set( newPos.x, newPos.y, newPos.z );
  });  

})();