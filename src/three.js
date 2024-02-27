import * as THREE from 'three';
import * as dat from 'dat.gui';
import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'
import AbstractImage from '/abs.png'
import Stats from 'stats.js'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


export default class threeJS {
	constructor(options) {
		this.gsap = gsap.registerPlugin(ScrollTrigger);
		this.previousTime = 0;
		this.time = 0;
		this.container = options.dom;

		this.stats = new Stats()
		console.log(this.stats.showPanel)
		this.stats.showPanel(0)
		// this.container.appendChild(this.stats.dom);

		this.params = {
			exposure: 1,
			bloomStrength: 1.5,
			bloomThreshold: 0,
			bloomRadius: 0
		  };
		



		this.scene = new THREE.Scene();
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;

		this.camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.01, 1000);
		this.camera.position.set(0, 10, 10);

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha:true
		});
		this.renderer.setSize(this.width, this.height);
		this.container.appendChild(this.renderer.domElement);

		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		this.clock = new THREE.Clock();

		this.dracoloader = new DRACOLoader();
		this.dracoloader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1.6;

		this.gltf = new GLTFLoader();
		this.gltf.setDRACOLoader(this.dracoloader);
		this.isPlaying = true;

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.update();
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.1;


		//bloom



		

		this.settings();
		this.initiPost();
		this.addObjects();
		this.render();
		this.resize();
		this.setupResize();
	}

	addObjects() {
		// this.geometry = new THREE.SphereGeometry(1,1024,1024);
		// this.geometry = new THREE.PlaneGeometry(2,2,10,10);
		this.geometry = new THREE.IcosahedronGeometry(1,150);


		this.material = new THREE.ShaderMaterial({
			uniforms:{
				uTime:{value:0},
				// uResolution:{value:0},
				uTexture:{value: new THREE.TextureLoader().load(AbstractImage)}
			},
			vertexShader:vertexShader,
			fragmentShader:fragmentShader,
			// wireframe:true
		});
		
		this.cube = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.cube);
	}

	settings() {
		let that = this;
		this.settings = {
			exposure: 0.3,
			bloomThreshold: 0,
			bloomStrength: 1.1,
			bloomRadius: 1.1
		};
		this.gui = new dat.GUI();
		this.gui.add(this.settings, 'exposure', 0, 3, 0.1).onChange(() => {
			that.renderer.toneMappingExposure = this.settings.exposure;
		});
	}

	setupResize() {
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		window.addEventListener('resize', this.resize.bind(this));
	}
	initiPost() {}

	resize() {
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer.setSize(this.width, this.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		// this.composer.setSize(this.width, this.height);
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
	}
	stop() {
		this.isPlaying = false;
	}
	play() {
		if (!this.isPlaying) {
			this.render();
			this.isPlaying = true;
		}
	}

	render() 
	{
		this.elapsedTime = this.clock.getElapsedTime();
		this.deltaTime = this.elapsedTime - this.previousTime;
		this.previousTime = this.elapsedTime;
		this.time = 0.05;

		requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);
		this.renderer.clearDepth();

		if (!this.isPlaying) return;
		this.controls.update();

		this.stats.update()
		
		this.material.uniforms.uTime.value += this.time;
		
	}
}
