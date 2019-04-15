// Put your three.js codes below
(function() {

    // Prepare stage scene
    const scene = new THREE.Scene();

    // Add actors of this scene
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set( 0, 0, 0 );
    scene.add( cube );
  
    // Add camera
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.set( 10, 10, 10 );
    camera.lookAt( scene.position );
  
    // Set up stage light
    const pointLight = new THREE.PointLight( 0xffffff );
    pointLight.position.set( 10, 10, -10 );
    scene.add( pointLight );
  
    // Set up renderer
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xeeeeee, 1.0 );
    renderer.shadowMap.enable = true;
  
    document.body.appendChild( renderer.domElement );
  
    //Make the cube rotate
    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
  
    // Start rendering.
    function render() {
      animate();
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