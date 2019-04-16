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
    creeper.toggleAnimate();
    scene.add( creeper );

    // Ground
    const planeGeometry = new THREE.PlaneGeometry( 80, 80 );
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set( 0, -7, 0 );
    plane.receiveShadow = true;
    scene.add( plane );
  
    // Add camera
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 30, 30, 30 );
    camera.lookAt( scene.position );

    // Add OrbitControls
    const navTool = new THREE.OrbitControls( camera );
    navTool.enableDamping = true;
    navTool.dampingFactor = 0.25;
  
    // Set up stage light
    const spotLight = new THREE.SpotLight( 0xffffff, 5, 100 );
    spotLight.position.set( -10, 20, 20 );
    scene.add( spotLight );

    const pointLight = new THREE.PointLight( 0xccffcc, 1, 100 );
    pointLight.castShadow = true;
    pointLight.position.set( -30, 30, 30 );
    scene.add( pointLight );

    const ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add( ambientLight );
  
    // Set up renderer
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.setClearColor( 0xeeeeee, 1.0 );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
    document.body.appendChild( renderer.domElement );
  
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

})();