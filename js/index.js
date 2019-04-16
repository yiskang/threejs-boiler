// Put your three.js codes below
(function() {

    // Prepare stage scene
    const scene = new THREE.Scene();

    // Add actors of this scene

    // Axes helper
    let axes = new THREE.AxesHelper( 20 )
    scene.add( axes );// Put your three.js codes below
    (function() {
    
        // Prepare stage scene
        const scene = new THREE.Scene();
    
        // Add actors of this scene
    
        // Axes helper
        
    
        // Creeper
        
    
        // Ground
        
      
        // Add camera
        
      
        // Set up stage light
        
      
        // Set up renderer
        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0xeeeeee, 1.0 );
        renderer.shadowMap.enable = true;
      
        document.body.appendChild( renderer.domElement );
      
        // Start rendering.
        function render() {
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

    // Creeper
    const creeper = new Creeper();
    scene.add( creeper );

    // Ground
    const planeGeometry = new THREE.PlaneGeometry( 60, 60 );
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    let plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set( 0, -7, 0 );
    scene.add( plane );
  
    // Add camera
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 30, 30, 30 );
    camera.lookAt( scene.position );
  
    // Set up stage light
    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set( -10, 40, 30)
    scene.add(spotLight)
  
    // Set up renderer
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xeeeeee, 1.0 );
    renderer.shadowMap.enable = true;
  
    document.body.appendChild( renderer.domElement );
  
    // Start rendering.
    function render() {
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