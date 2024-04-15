"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";

import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
	Lensflare,
	LensflareElement,
} from "three/examples/jsm/objects/Lensflare";
interface SceneProps {
	onLoaded: () => void;
}
const Scene: FC<SceneProps> = ({ onLoaded }) => {
	const { scene, gl, camera } = useThree();
	const ambientLightRef = useRef<THREE.AmbientLight>(null);
	const spotLight = useRef<THREE.SpotLight>(null);
	const mixerRef = useRef<THREE.AnimationMixer | null>(null);

	const textureFlare0 = useLoader(
		THREE.TextureLoader,
		"https://cdn.jsdelivr.net/gh/Sean-Bradley/First-Car-Shooter@main/dist/client/img/lensflare0.png"
	);
	const rgbeTexture = useLoader(RGBELoader, "/kloppenheim_06_puresky_1k.hdr");

	useEffect(() => {
		rgbeTexture.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = rgbeTexture;
		scene.background = rgbeTexture;
	}, [textureFlare0, rgbeTexture, scene]);

	useEffect(() => {
		const loader = new GLTFLoader();
		loader.load("/mouayad4.glb", (gltf) => {
			console.log(gltf);
			scene.add(gltf.scene);
			const mouayad = gltf.scene.getObjectByName("Mouayad") as THREE.Mesh;
			if (mouayad) {
				mouayad.castShadow = true;
				mouayad.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						child.castShadow = true;
					}
				});
			}
			const car = gltf.scene.getObjectByName("SketchUp") as THREE.Mesh;
			if (car) {
				car.castShadow = true;
				car.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						child.castShadow = true;
					}
				});
			}

			const animations = gltf.animations;
			if (animations && animations.length) {
				const mixer = new THREE.AnimationMixer(gltf.scene);
				mixerRef.current = mixer;
				// mixerRef.current = new THREE.AnimationMixer(gltf.scene);
				if (mixer) {
					// Check the local variable instead of the ref directly
					animations.forEach((clip) => {
						const action = mixer.clipAction(clip); // Use local variable
						action.play();
					});
				}
			}
			gltf.scene.position.set(0, 0, 0);

			const plane = gltf.scene.getObjectByName("Plane") as THREE.Mesh;
			plane.receiveShadow = true;
			const spotLight = gltf.scene.getObjectByName("Spot") as THREE.SpotLight;
			spotLight.intensity /= 2;
			spotLight.castShadow = true;

			const lensflare = new Lensflare();
			lensflare.addElement(new LensflareElement(textureFlare0, 1000, 0));
			spotLight.add(lensflare);
			scene.add(gltf.scene);
			onLoaded();
		});
	}, [scene]);

	useFrame(() => {
		if (camera instanceof ThreePerspectiveCamera) {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
		}
		gl.setSize(window.innerWidth, window.innerHeight);
	});

	useFrame((state, delta) => {
		if (mixerRef.current) {
			mixerRef.current.update(delta);
		}
	});

	return (
		<>
			<ambientLight ref={ambientLightRef} intensity={1} />
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
				far={50}
				position={[-2, 1, 8]}
			/>
			<OrbitControls enableDamping />
			<Stats />
		</>
	);
};

const ThreeScene = () => {
	const [isLoading, setIsLoading] = useState(true);
	const handleLoaded = () => {
		setIsLoading(false);
	};
	return (
		<div className='relative w-full h-full'>
			{isLoading && (
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-white z-10'>
					Loading...
				</div>
			)}

			<Canvas shadows>
				<Scene onLoaded={handleLoaded} />{" "}
			</Canvas>
		</div>
	);
};

export default ThreeScene;
