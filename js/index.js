// Put your three.js codes below
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