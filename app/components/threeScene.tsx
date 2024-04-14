"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
	Lensflare,
	LensflareElement,
} from "three/examples/jsm/objects/Lensflare";

const Scene = () => {
	const { scene, gl, camera } = useThree();
	const ambientLight = useRef();
	const spotLight = useRef();
	const mixerRef = useRef(); // Ref to hold the mixer

	const textureFlare0 = useLoader(
		THREE.TextureLoader,
		"https://cdn.jsdelivr.net/gh/Sean-Bradley/First-Car-Shooter@main/dist/client/img/lensflare0.png"
	);
	const rgbeTexture = useLoader(RGBELoader, "/kloppenheim_06_puresky_1k.hdr");

	useEffect(() => {
		rgbeTexture.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = rgbeTexture;
		scene.background = rgbeTexture;

		// const lensflare = new Lensflare();
		// lensflare.addElement(new LensflareElement(textureFlare0, 1000, 0));
		// spotLight.current.add(lensflare);
	}, [textureFlare0, rgbeTexture, scene]);

	useEffect(() => {
		const loader = new GLTFLoader();
		loader.load("/mouayad.glb", (gltf) => {
			scene.add(gltf.scene);
			const mouayad = gltf.scene.getObjectByName("Mouayad") as THREE.Mesh;
			mouayad.castShadow = true;
			if (mouayad) {
				mouayad.castShadow = true;
				mouayad.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						child.castShadow = true;
					}
				});
			}

			const animations = gltf.animations;
			if (animations && animations.length) {
				mixerRef.current = new THREE.AnimationMixer(gltf.scene);
				animations.forEach((clip) => {
					const action = mixerRef.current.clipAction(clip);
					action.play();
				});
			}
			gltf.scene.position.set(0, 0, 0);

			const plane = gltf.scene.getObjectByName("Plane") as THREE.Mesh;
			plane.receiveShadow = true;
			const spotLight = gltf.scene.getObjectByName("Spot") as THREE.SpotLight;
			spotLight.intensity /= 2;
			spotLight.castShadow = true;

			const name = gltf.scene.getObjectByName("name") as THREE.Mesh;
			(
				(name.material as THREE.MeshStandardMaterial).map as THREE.Texture
			).colorSpace = THREE.LinearSRGBColorSpace;

			const phone = gltf.scene.getObjectByName("phone") as THREE.Mesh;
			(
				(phone.material as THREE.MeshStandardMaterial).map as THREE.Texture
			).colorSpace = THREE.LinearSRGBColorSpace;

			const mail = gltf.scene.getObjectByName("e-mail") as THREE.Mesh;
			(
				(mail.material as THREE.MeshStandardMaterial).map as THREE.Texture
			).colorSpace = THREE.LinearSRGBColorSpace;

			const qoute = gltf.scene.getObjectByName("qoute") as THREE.Mesh;
			(
				(qoute.material as THREE.MeshStandardMaterial).map as THREE.Texture
			).colorSpace = THREE.LinearSRGBColorSpace;

			const lensflare = new Lensflare();
			lensflare.addElement(new LensflareElement(textureFlare0, 1000, 0));
			spotLight.add(lensflare);
			scene.add(gltf.scene);
		});
	}, [scene]);

	useFrame(() => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		gl.setSize(window.innerWidth, window.innerHeight);
	});

	useFrame((state, delta) => {
		if (mixerRef.current) {
			mixerRef.current.update(delta);
		}
	});

	return (
		<>
			<ambientLight ref={ambientLight} intensity={1} />
			<spotLight
				ref={spotLight}
				position={[10, 10, 10]}
				angle={0.15}
				penumbra={1}
				castShadow
				intensity={0.5}
			/>
			<PerspectiveCamera
				makeDefault
				fov={75}
				aspect={window.innerWidth / window.innerHeight}
				near={0.1}
				far={100}
				position={[1, 2, 4]}
			/>
			<OrbitControls enableDamping />
			<Stats />
		</>
	);
};

const ThreeScene = () => {
	return (
		<Canvas shadows>
			<Scene />
		</Canvas>
	);
};

export default ThreeScene;
