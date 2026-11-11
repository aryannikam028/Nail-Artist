import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export type AnimationPoseMode = "showcase" | "glamour" | "breeze";
export type IntroScene = "scene1" | "scene2" | "scene3" | "scene4" | "scene5" | "completed";

export interface Cinematic3DStudioRef {
  replayGreeting: () => void;
  switchPose: (mode: AnimationPoseMode) => void;
  playAudio: () => Promise<void>;
}

interface Cinematic3DStudioProps {
  isIntroPlaying: boolean;
  onSceneChange?: (scene: IntroScene) => void;
  onIntroComplete: () => void;
  onAudioBlockedChange?: (blocked: boolean) => void;
  poseMode?: AnimationPoseMode;
  className?: string;
}

export const Cinematic3DStudio = forwardRef<Cinematic3DStudioRef, Cinematic3DStudioProps>(
  (
    {
      isIntroPlaying,
      onSceneChange,
      onIntroComplete,
      onAudioBlockedChange,
      poseMode = "showcase",
      className = "w-full h-full",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Three.js References
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const avatarGroupRef = useRef<THREE.Group | null>(null);

    // Rig Bones
    const headBoneRef = useRef<THREE.Bone | null>(null);
    const neckBoneRef = useRef<THREE.Bone | null>(null);
    const rightArmRef = useRef<THREE.Bone | null>(null);
    const rightForeArmRef = useRef<THREE.Bone | null>(null);
    const rightHandRef = useRef<THREE.Bone | null>(null);

    // Morph Targets for Facial Expression and Lip-Sync
    const morphMeshesRef = useRef<THREE.Mesh[]>([]);

    // Animation Mixer and Clips
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const actionsRef = useRef<{
      showcase?: THREE.AnimationAction;
      glamour?: THREE.AnimationAction;
      breeze?: THREE.AnimationAction;
      idle?: THREE.AnimationAction;
    }>({});
    const currentActionRef = useRef<THREE.AnimationAction | null>(null);

    // Waving & Lip Sync State Tracking
    const waveWeightRef = useRef(0);
    const waveStartTimeRef = useRef(-1);
    const isWavingRef = useRef(false);

    // Web Audio API for Real-time Lip-Sync
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const isAudioConnectedRef = useRef(false);

    // Luxury Environment Elements
    const bottleGroup1Ref = useRef<THREE.Group | null>(null);
    const bottleGroup2Ref = useRef<THREE.Group | null>(null);
    const nailGlintsRef = useRef<{ mesh: THREE.Mesh; idx: number }[]>([]);
    const pearlsRef = useRef<{ mesh: THREE.Mesh; basePos: THREE.Vector3 }[]>([]);
    const petalsRef = useRef<
      { mesh: THREE.Mesh; speed: number; rotSpeed: number; swing: number }[]
    >([]);
    const lightsRef = useRef<{
      roseLight: THREE.PointLight;
      goldLight: THREE.PointLight;
      spotLight: THREE.SpotLight;
      rimLight: THREE.PointLight;
    } | null>(null);

    // Current Pose and Mouse Parallax tracking
    const poseModeRef = useRef<AnimationPoseMode>(poseMode);
    const isIntroPlayingRef = useRef(isIntroPlaying);
    isIntroPlayingRef.current = isIntroPlaying;

    const mouseRef = useRef({
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      hasMoved: false,
    });

    // Helper: Safely set morph target values
    const setMorph = useCallback((name: string, value: number) => {
      morphMeshesRef.current.forEach((mesh) => {
        if (
          mesh.morphTargetDictionary &&
          mesh.morphTargetDictionary[name] !== undefined
        ) {
          const idx = mesh.morphTargetDictionary[name];
          if (mesh.morphTargetInfluences) {
            mesh.morphTargetInfluences[idx] = value;
          }
        }
      });
    }, []);

    // Switch Skeletal Animation Action
    const switchAnimation = useCallback((mode: AnimationPoseMode) => {
      poseModeRef.current = mode;
      const actions = actionsRef.current;
      const targetAction =
        mode === "glamour"
          ? actions.glamour || actions.showcase
          : mode === "breeze"
          ? actions.breeze || actions.showcase
          : actions.showcase || actions.idle;

      if (targetAction && targetAction !== currentActionRef.current) {
        if (currentActionRef.current) {
          currentActionRef.current.fadeOut(0.4);
        }
        targetAction.reset().fadeIn(0.4).play();
        currentActionRef.current = targetAction;
      }
    }, []);

    useEffect(() => {
      switchAnimation(poseMode);
    }, [poseMode, switchAnimation]);

    // Audio Playback with Web Audio Initializer
    const playAudioGreeting = useCallback(async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        // Initialize Web Audio API on user or permitted playback
        if (!isAudioConnectedRef.current) {
          try {
            const AudioContextClass =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext })
                .webkitAudioContext;
            if (AudioContextClass) {
              const ctx = new AudioContextClass();
              const analyser = ctx.createAnalyser();
              analyser.fftSize = 128;
              analyser.smoothingTimeConstant = 0.5;
              const source = ctx.createMediaElementSource(audio);
              source.connect(analyser);
              analyser.connect(ctx.destination);

              audioCtxRef.current = ctx;
              analyserRef.current = analyser;
              dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
              isAudioConnectedRef.current = true;
            }
          } catch (e) {
            console.warn("Web Audio connection notice:", e);
          }
        }

        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          await audioCtxRef.current.resume();
        }

        audio.currentTime = 0;
        await audio.play();
        onAudioBlockedChange?.(false);
      } catch (err) {
        console.warn("Audio autoplay blocked by browser policy:", err);
        onAudioBlockedChange?.(true);
      }
    }, [onAudioBlockedChange]);

    // Trigger Waving Gesture
    const triggerWave = useCallback(() => {
      isWavingRef.current = true;
      waveStartTimeRef.current = performance.now() / 1000;
    }, []);

    // Full Replay Function (Accessible via Ref)
    const replayGreeting = useCallback(() => {
      triggerWave();
      playAudioGreeting();
    }, [triggerWave, playAudioGreeting]);

    useImperativeHandle(
      ref,
      () => ({
        replayGreeting,
        switchPose: (mode) => switchAnimation(mode),
        playAudio: playAudioGreeting,
      }),
      [replayGreeting, switchAnimation, playAudioGreeting]
    );

    // 5-Scene Cinematic Intro Sequence Timeline using GSAP (Automatic, NO Skip Button)
    const playCinematicSequence = useCallback(() => {
      const camera = cameraRef.current;
      const bottle1 = bottleGroup1Ref.current;
      const lights = lightsRef.current;

      if (!camera || !bottle1 || !lights) return;

      const tl = gsap.timeline({
        onComplete: () => {
          onSceneChange?.("completed");
          onIntroComplete();
        },
      });

      // SCENE 1 (0.0s - 1.2s): Brand Reveal — Soft ambient atmosphere with sparkles
      onSceneChange?.("scene1");
      camera.position.set(0.12, 1.45, 1.45);
      camera.lookAt(0.04, 1.4, 0);
      lights.spotLight.intensity = 1.8;
      lights.roseLight.intensity = 1.4;
      lights.goldLight.intensity = 1.2;

      tl.to({}, { duration: 1.2 });

      // SCENE 2 (1.2s - 2.0s): Character Reveal — Glide camera to reveal 3D girl
      tl.call(() => {
        onSceneChange?.("scene2");
      })
        .to(camera.position, {
          x: 0,
          y: 1.48,
          z: 1.55,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: () => camera.lookAt(0, 1.42, 0),
        })
        .to(
          lights.spotLight,
          { intensity: 3.8, duration: 0.8, ease: "power1.inOut" },
          "<"
        )
        .to(
          lights.roseLight,
          { intensity: 3.4, duration: 0.8, ease: "power1.inOut" },
          "<"
        );

      // SCENE 3 (2.0s - 4.8s): Hello & Wave Animation — Smiles, blinks, waves, speaks greeting
      tl.call(() => {
        onSceneChange?.("scene3");
        triggerWave();
        playAudioGreeting();
      }).to(camera.position, {
        x: 0.02,
        y: 1.47,
        z: 1.52,
        duration: 2.8,
        ease: "sine.inOut",
        onUpdate: () => camera.lookAt(0, 1.42, 0),
      });

      // SCENE 4 (4.8s - 6.6s): Nail Art Showcase — Gently gestures to manicure with diamond glints
      tl.call(() => {
        onSceneChange?.("scene4");
      })
        .to(camera.position, {
          x: -0.06,
          y: 1.43,
          z: 1.42,
          duration: 1.8,
          ease: "sine.inOut",
          onUpdate: () => camera.lookAt(0.03, 1.38, 0),
        })
        .to(lights.goldLight, { intensity: 3.8, duration: 1.2 }, "<")
        .to(
          bottle1.rotation,
          {
            y: Math.PI * 2,
            duration: 1.8,
            ease: "power1.out",
          },
          "<"
        );

      // SCENE 5 (6.6s - 7.6s): Website Reveal — Automatic seamless transition to homepage
      tl.call(() => {
        onSceneChange?.("scene5");
      }).to(camera.position, {
        x: 0,
        y: 1.48,
        z: 1.55,
        duration: 1.0,
        ease: "power2.inOut",
        onUpdate: () => camera.lookAt(0, 1.42, 0),
      });
    }, [
      onSceneChange,
      onIntroComplete,
      triggerWave,
      playAudioGreeting,
    ]);

    // Mount Three.js Scene and Load Assets
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth || 550;
      const height = container.clientHeight || 600;

      // 1. SCENE & CAMERA
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
      camera.position.set(0, 1.48, 1.55);
      camera.lookAt(0, 1.42, 0);
      cameraRef.current = camera;

      // 2. RENDERER (Clean Alpha Transparent)
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);

      // 3. STUDIO LIGHTING
      const ambientLight = new THREE.AmbientLight(0xfff5f8, 2.4);
      scene.add(ambientLight);

      const spotLight = new THREE.SpotLight(0xffffff, 3.8);
      spotLight.position.set(1.5, 3.2, 2.4);
      spotLight.angle = Math.PI / 3.2;
      spotLight.penumbra = 0.8;
      scene.add(spotLight);

      const roseLight = new THREE.PointLight(0xb76e79, 3.4, 10);
      roseLight.position.set(-1.8, 2.0, 1.6);
      scene.add(roseLight);

      const goldLight = new THREE.PointLight(0xf5e6d3, 3.0, 8);
      goldLight.position.set(1.8, 1.2, 1.4);
      scene.add(goldLight);

      const rimLight = new THREE.PointLight(0xffccd9, 2.6, 6);
      rimLight.position.set(0, 2.6, -1.2);
      scene.add(rimLight);

      lightsRef.current = { roseLight, goldLight, spotLight, rimLight };

      // 4. LOAD THE 3D RIGGED CHARACTER (avaturn.glb)
      const avatarGroup = new THREE.Group();
      avatarGroup.position.set(0, 0, 0);
      scene.add(avatarGroup);
      avatarGroupRef.current = avatarGroup;

      const textureLoader = new THREE.TextureLoader();
      const pinkJacketTex = textureLoader.load("/models/avaturn_look_pink.jpg");
      pinkJacketTex.colorSpace = THREE.SRGBColorSpace;
      pinkJacketTex.flipY = false;

      const gltfLoader = new GLTFLoader();
      const fbxLoader = new FBXLoader();

      // Helper to load FBX animation clip and convert centimeter tracks to meters once
      const loadFBXClip = (
        url: string,
        onLoaded: (clip: THREE.AnimationClip) => void
      ) => {
        fbxLoader.load(url, (fbx) => {
          if (fbx.animations && fbx.animations.length > 0) {
            const clip = fbx.animations[0];
            clip.tracks.forEach((track) => {
              if (track.name.endsWith(".position")) {
                for (let i = 0; i < track.values.length; i++) {
                  track.values[i] *= 0.01;
                }
              }
            });
            onLoaded(clip);
          }
        });
      };

      // 5. DIAMOND CROSS NAIL GLINTS (Sparkling on manicured fingertips)
      const glintShape = new THREE.Shape();
      const starRadiusOuter = 0.024;
      const starRadiusInner = 0.005;
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? starRadiusOuter : starRadiusInner;
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) glintShape.moveTo(x, y);
        else glintShape.lineTo(x, y);
      }
      glintShape.closePath();
      const glintGeo = new THREE.ShapeGeometry(glintShape);
      const glintMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      });

      const nailGlints: { mesh: THREE.Mesh; idx: number }[] = [];

      gltfLoader.load(
        "/models/avaturn.glb",
        (gltf) => {
          const model = gltf.scene;
          avatarGroup.add(model);

          model.traverse((child) => {
            if ((child as THREE.Bone).isBone) {
              const bName = child.name;
              if (bName === "Head") headBoneRef.current = child as THREE.Bone;
              if (bName === "Neck") neckBoneRef.current = child as THREE.Bone;
              if (bName === "RightArm") rightArmRef.current = child as THREE.Bone;
              if (bName === "RightForeArm") rightForeArmRef.current = child as THREE.Bone;
              if (bName === "RightHand") rightHandRef.current = child as THREE.Bone;
            }

            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              // Apply Pink Luxury tailored blazer material
              if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                if (mat.name === "avaturn_look_0_material") {
                  mat.map = pinkJacketTex;
                  mat.roughness = 0.55;
                  mat.metalness = 0.05;
                  mat.needsUpdate = true;
                }
                if (mat.name === "Head" || mat.name === "Body") {
                  mat.roughness = 0.38;
                }
              }

              if (mesh.morphTargetDictionary) {
                morphMeshesRef.current.push(mesh);
              }
            }
          });

          // Set Initial Warm Feminine Smile
          setMorph("mouthSmile", 0.45);
          setMorph("mouthSmileLeft", 0.25);
          setMorph("mouthSmileRight", 0.25);

          // Attach diamond sparkle glints to finger tip bones
          const fingerBoneNames = [
            "LeftHandIndex3",
            "LeftHandMiddle3",
            "LeftHandRing3",
            "RightHandIndex3",
            "RightHandMiddle3",
            "RightHandRing3",
          ];

          fingerBoneNames.forEach((bName, idx) => {
            const bone = model.getObjectByName(bName);
            if (bone) {
              const glint = new THREE.Mesh(glintGeo, glintMat.clone());
              glint.position.set(0, 0.03, 0);
              bone.add(glint);
              nailGlints.push({ mesh: glint, idx });
            }
          });
          nailGlintsRef.current = nailGlints;

          // Animation Mixer
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          // 1. Showcase Manicure Animation
          loadFBXClip("/models/showcase.fbx", (clip) => {
            clip.name = "showcase";
            const action = mixer.clipAction(clip);
            actionsRef.current.showcase = action;

            if (poseModeRef.current === "showcase") {
              action.reset().fadeIn(0.4).play();
              currentActionRef.current = action;
            }
          });

          // 2. Glamour Dance Animation
          loadFBXClip("/models/dance.fbx", (clip) => {
            clip.name = "glamour";
            const action = mixer.clipAction(clip);
            actionsRef.current.glamour = action;

            if (poseModeRef.current === "glamour") {
              if (currentActionRef.current) currentActionRef.current.fadeOut(0.4);
              action.reset().fadeIn(0.4).play();
              currentActionRef.current = action;
            }
          });

          // 3. Rose Breeze Animation
          loadFBXClip("/models/gesture.fbx", (clip) => {
            clip.name = "breeze";
            const action = mixer.clipAction(clip);
            actionsRef.current.breeze = action;

            if (poseModeRef.current === "breeze") {
              if (currentActionRef.current) currentActionRef.current.fadeOut(0.4);
              action.reset().fadeIn(0.4).play();
              currentActionRef.current = action;
            }
          });

          // 4. Idle Animation
          loadFBXClip("/models/idle.fbx", (clip) => {
            clip.name = "idle";
            const action = mixer.clipAction(clip);
            actionsRef.current.idle = action;

            if (!currentActionRef.current) {
              action.reset().fadeIn(0.4).play();
              currentActionRef.current = action;
            }
          });

          // Trigger intro timeline if active
          if (isIntroPlayingRef.current) {
            playCinematicSequence();
          }
        },
        undefined,
        (err) => {
          console.error("Error loading 3D avatar:", err);
          onIntroComplete();
        }
      );

      // 6. BUILD 3D CRYSTAL NAIL POLISH BOTTLES
      const createLuxuryBottle = (bodyColor = 0xefa6c8, capColor = 0xb76e79) => {
        const bGroup = new THREE.Group();

        // Faceted Glass Body
        const bodyGeo = new THREE.CylinderGeometry(0.09, 0.12, 0.25, 8);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.92,
          opacity: 1,
          transparent: true,
          roughness: 0.05,
          ior: 1.52,
          thickness: 0.3,
          reflectivity: 0.95,
          clearcoat: 1.0,
        });
        const glassBody = new THREE.Mesh(bodyGeo, glassMat);
        bGroup.add(glassBody);

        // Pink Lacquer Core
        const fluidGeo = new THREE.CylinderGeometry(0.07, 0.095, 0.2, 8);
        const fluidMat = new THREE.MeshStandardMaterial({
          color: bodyColor,
          roughness: 0.12,
          metalness: 0.08,
        });
        const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
        fluidMesh.position.y = -0.02;
        bGroup.add(fluidMesh);

        // Rose-Gold Metallic Cap
        const capGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.2, 24);
        const capMat = new THREE.MeshStandardMaterial({
          color: capColor,
          roughness: 0.22,
          metalness: 0.9,
        });
        const capMesh = new THREE.Mesh(capGeo, capMat);
        capMesh.position.y = 0.2;
        bGroup.add(capMesh);

        return bGroup;
      };

      const bottle1 = createLuxuryBottle(0xefa6c8, 0xb76e79);
      bottle1.position.set(0.68, 1.25, 0.3);
      bottle1.scale.set(0.75, 0.75, 0.75);
      scene.add(bottle1);
      bottleGroup1Ref.current = bottle1;

      const bottle2 = createLuxuryBottle(0xf8c8dc, 0x934e59);
      bottle2.position.set(-0.68, 1.45, -0.1);
      bottle2.scale.set(0.65, 0.65, 0.65);
      scene.add(bottle2);
      bottleGroup2Ref.current = bottle2;

      // 7. FRESHWATER PEARLS
      const pearlGeo = new THREE.SphereGeometry(0.028, 32, 32);
      const pearlMat = new THREE.MeshPhysicalMaterial({
        color: 0xfff0f5,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        ior: 1.55,
      });

      const pearls: { mesh: THREE.Mesh; basePos: THREE.Vector3 }[] = [];
      const pearlPositions = [
        [-0.6, 1.22, 0.25],
        [-0.5, 1.62, 0.15],
        [0.58, 1.58, 0.2],
        [0.65, 1.15, 0.25],
      ];

      pearlPositions.forEach(([px, py, pz]) => {
        const pearl = new THREE.Mesh(pearlGeo, pearlMat);
        const basePos = new THREE.Vector3(px, py, pz);
        pearl.position.copy(basePos);
        scene.add(pearl);
        pearls.push({ mesh: pearl, basePos });
      });
      pearlsRef.current = pearls;

      // 8. 3D FLOATING ROSE PETALS
      const petalShape = new THREE.Shape();
      petalShape.moveTo(0, 0);
      petalShape.bezierCurveTo(0.025, 0.045, 0.05, 0.075, 0, 0.12);
      petalShape.bezierCurveTo(-0.05, 0.075, -0.025, 0.045, 0, 0);
      const petalGeo = new THREE.ShapeGeometry(petalShape);
      const petalMat = new THREE.MeshPhysicalMaterial({
        color: 0xf29bb0,
        roughness: 0.5,
        metalness: 0.02,
        transmission: 0.35,
        thickness: 0.1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });

      const petals: {
        mesh: THREE.Mesh;
        speed: number;
        rotSpeed: number;
        swing: number;
      }[] = [];
      for (let i = 0; i < 12; i++) {
        const pMesh = new THREE.Mesh(petalGeo, petalMat);
        pMesh.position.set(
          (Math.random() - 0.5) * 2.2,
          1.1 + Math.random() * 1.5,
          (Math.random() - 0.5) * 1.2
        );
        pMesh.scale.setScalar(0.65 + Math.random() * 0.5);
        pMesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        scene.add(pMesh);
        petals.push({
          mesh: pMesh,
          speed: 0.005 + Math.random() * 0.008,
          rotSpeed: 0.012 + Math.random() * 0.02,
          swing: Math.random() * Math.PI * 2,
        });
      }
      petalsRef.current = petals;

      // 9. MOUSE TRACKING
      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseRef.current.targetX = x * 1.4;
        mouseRef.current.targetY = -y * 1.1;
        mouseRef.current.hasMoved = true;
      };
      window.addEventListener("mousemove", onMouseMove);

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || 550;
        const h = container.clientHeight || 600;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // Quaternion storage for procedural wave blending
      const targetArmQuat = new THREE.Quaternion();
      const targetForeArmQuat = new THREE.Quaternion();
      const targetHandQuat = new THREE.Quaternion();
      const eulerHolder = new THREE.Euler();

      // 10. MAIN ANIMATION LOOP
      let reqId: number;
      const clock = new THREE.Clock();
      let blinkTimer = 0;
      let isBlinking = false;
      let blinkProgress = 0;

      const animate = () => {
        reqId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();
        const nowSec = performance.now() / 1000;
        const currentMode = poseModeRef.current;

        // Smooth Mouse Parallax
        const mouse = mouseRef.current;
        if (!mouse.hasMoved) {
          mouse.targetX = Math.sin(elapsed * 0.7) * 0.16;
          mouse.targetY = Math.cos(elapsed * 0.9) * 0.1;
        }
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;

        // Mixer Update for full skeletal pose
        if (mixerRef.current) {
          mixerRef.current.update(delta);
        }

        // Pitch Correction (+0.36 forward pitch) & Gaze tracking: looks directly into visitor's eyes!
        if (headBoneRef.current) {
          headBoneRef.current.rotation.x += 0.36 - mouse.y * 0.12;
          headBoneRef.current.rotation.y += mouse.x * 0.22;
        }
        if (neckBoneRef.current) {
          neckBoneRef.current.rotation.x += 0.12;
          neckBoneRef.current.rotation.y += mouse.x * 0.1;
        }

        // 3D Procedural Hand Wave Calculation & Slerp Blending
        if (isWavingRef.current && waveStartTimeRef.current > 0) {
          const waveElapsed = nowSec - waveStartTimeRef.current;
          if (waveElapsed < 0.5) {
            waveWeightRef.current = waveElapsed / 0.5;
          } else if (waveElapsed < 2.8) {
            waveWeightRef.current = 1.0;
          } else if (waveElapsed < 3.5) {
            waveWeightRef.current = 1.0 - (waveElapsed - 2.8) / 0.7;
          } else {
            waveWeightRef.current = 0.0;
            isWavingRef.current = false;
          }
        }

        const waveWeight = waveWeightRef.current;
        if (waveWeight > 0.001) {
          // Preset 3 Natural Wave:
          // RightArm: (-0.4, -0.5, -1.0)
          // RightForeArm: (-1.3, 0.5, 0)
          // RightHand: (0.1, 0, sin(time * 7.0) * 0.35)
          eulerHolder.set(-0.4, -0.5, -1.0);
          targetArmQuat.setFromEuler(eulerHolder);

          eulerHolder.set(-1.3, 0.5, 0);
          targetForeArmQuat.setFromEuler(eulerHolder);

          const handSway = Math.sin(elapsed * 7.2) * 0.35;
          eulerHolder.set(0.1, 0, handSway);
          targetHandQuat.setFromEuler(eulerHolder);

          if (rightArmRef.current) {
            rightArmRef.current.quaternion.slerp(targetArmQuat, waveWeight);
          }
          if (rightForeArmRef.current) {
            rightForeArmRef.current.quaternion.slerp(targetForeArmQuat, waveWeight);
          }
          if (rightHandRef.current) {
            rightHandRef.current.quaternion.slerp(targetHandQuat, waveWeight);
          }
        }

        // Real-Time Lip-Sync Calculation
        const audio = audioRef.current;
        if (audio && !audio.paused && !audio.ended) {
          const t = audio.currentTime;

          // Frequency energy from Web Audio API or fallback speech modulation
          let energy = 0;
          if (analyserRef.current && dataArrayRef.current) {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
            let sum = 0;
            for (let i = 1; i < 20; i++) sum += dataArrayRef.current[i];
            energy = Math.min(1.0, (sum / 19) / 110);
          }
          if (energy < 0.05) {
            energy = Math.max(
              0,
              Math.sin(t * 14.0) * 0.55 + Math.sin(t * 8.5) * 0.45
            );
          }

          // Phoneme Viseme Mapping based on Exact Speech Timings:
          // 0.1s - 1.7s: "Hello, gorgeous!"
          // 1.7s - 3.65s: "Welcome to Nails by Sanu!"
          // 3.65s - 5.7s: "Ready to find your perfect nail look?"
          // 5.7s - 7.6s: "Let's make your nails beautiful!"
          if (t >= 0.1 && t < 1.7) {
            setMorph("viseme_aa", energy * 0.45);
            setMorph("viseme_E", energy * 0.5);
            setMorph("viseme_O", energy * 0.4);
            setMorph("mouthOpen", energy * 0.55);
            setMorph("jawOpen", energy * 0.35);
            setMorph("mouthSmile", 0.35 + energy * 0.2);
          } else if (t >= 1.7 && t < 3.65) {
            setMorph("viseme_E", energy * 0.5);
            setMorph("viseme_aa", energy * 0.55);
            setMorph("viseme_O", energy * 0.35);
            setMorph("mouthOpen", energy * 0.6);
            setMorph("jawOpen", energy * 0.4);
            setMorph("mouthSmile", 0.4);
          } else if (t >= 3.65 && t < 5.7) {
            setMorph("viseme_E", energy * 0.55);
            setMorph("viseme_I", energy * 0.4);
            setMorph("viseme_O", energy * 0.5);
            setMorph("mouthOpen", energy * 0.55);
            setMorph("jawOpen", energy * 0.35);
            setMorph("mouthSmile", 0.38);
          } else if (t >= 5.7 && t <= 7.6) {
            setMorph("viseme_E", energy * 0.45);
            setMorph("viseme_aa", energy * 0.55);
            setMorph("viseme_U", energy * 0.4);
            setMorph("mouthOpen", energy * 0.5);
            setMorph("jawOpen", energy * 0.3);
            setMorph("mouthSmile", 0.55);
          } else {
            setMorph("mouthOpen", 0);
            setMorph("jawOpen", 0);
            setMorph("viseme_aa", 0);
            setMorph("viseme_E", 0);
            setMorph("viseme_O", 0);
            setMorph("viseme_I", 0);
            setMorph("viseme_U", 0);
            setMorph("mouthSmile", 0.45);
          }
        } else {
          // Resting feminine smile when not speaking
          setMorph("mouthOpen", 0);
          setMorph("jawOpen", 0);
          setMorph("viseme_aa", 0);
          setMorph("viseme_E", 0);
          setMorph("viseme_O", 0);
          setMorph("viseme_I", 0);
          setMorph("viseme_U", 0);
          setMorph("mouthSmile", 0.45);
        }

        // Real-Time 3D Eye Morph Tracking
        if (mouse.x > 0) {
          setMorph("eyeLookOutRight", mouse.x * 0.38);
          setMorph("eyeLookInLeft", mouse.x * 0.38);
          setMorph("eyeLookOutLeft", 0);
          setMorph("eyeLookInRight", 0);
        } else {
          setMorph("eyeLookOutLeft", -mouse.x * 0.38);
          setMorph("eyeLookInRight", -mouse.x * 0.38);
          setMorph("eyeLookOutRight", 0);
          setMorph("eyeLookInLeft", 0);
        }

        if (mouse.y > 0) {
          setMorph("eyeLookUpLeft", mouse.y * 0.32);
          setMorph("eyeLookUpRight", mouse.y * 0.32);
          setMorph("eyeLookDownLeft", 0);
          setMorph("eyeLookDownRight", 0);
        } else {
          setMorph("eyeLookDownLeft", -mouse.y * 0.32);
          setMorph("eyeLookDownRight", -mouse.y * 0.32);
          setMorph("eyeLookUpLeft", 0);
          setMorph("eyeLookUpRight", 0);
        }

        // Natural Human Eye Blinking Cycle (Every ~3.5 seconds)
        blinkTimer += delta;
        if (blinkTimer > 3.4) {
          isBlinking = true;
          blinkTimer = 0;
          blinkProgress = 0;
        }
        if (isBlinking) {
          blinkProgress += delta * 7.5;
          if (blinkProgress >= Math.PI) {
            isBlinking = false;
            setMorph("eyeBlinkLeft", 0);
            setMorph("eyeBlinkRight", 0);
          } else {
            const bVal = Math.sin(blinkProgress);
            setMorph("eyeBlinkLeft", bVal);
            setMorph("eyeBlinkRight", bVal);
          }
        }

        // Animated Diamond Nail Glints on Fingertips
        nailGlints.forEach(({ mesh: glint, idx }) => {
          const speed = currentMode === "showcase" ? 4.2 : 3.0;
          const glintPhase = Math.sin(elapsed * speed + idx * 0.85);
          const scale = Math.max(0, glintPhase);
          glint.scale.setScalar(scale * 1.3);
          glint.rotation.z = elapsed * 2.2 + idx;
          (glint.material as THREE.MeshBasicMaterial).opacity = Math.min(
            1,
            scale * 1.4
          );
        });

        // 3D Floating Rose Petals
        petals.forEach((p) => {
          const windBoost = currentMode === "breeze" ? 1.8 : 1.0;
          p.mesh.position.y -= p.speed * windBoost;
          p.mesh.position.x +=
            Math.sin(elapsed * 1.2 + p.swing) * 0.003 * windBoost;
          p.mesh.rotation.x += p.rotSpeed * windBoost;
          p.mesh.rotation.y += p.rotSpeed * 0.7 * windBoost;

          if (p.mesh.position.y < 0.9) {
            p.mesh.position.y = 2.2;
            p.mesh.position.x = (Math.random() - 0.5) * 2.2;
            p.mesh.position.z = (Math.random() - 0.5) * 1.2;
          }
        });

        // Orbiting Luxury Polish Bottles
        if (bottle1) {
          bottle1.position.y = 1.25 + Math.sin(elapsed * 1.4) * 0.04;
          bottle1.position.x = 0.68 + mouse.x * 0.03;
          if (!isIntroPlayingRef.current) {
            bottle1.rotation.y = elapsed * 0.5;
          }
        }
        if (bottle2) {
          bottle2.position.y = 1.45 + Math.sin(elapsed * 1.2 + 1) * 0.05;
          bottle2.position.x = -0.68 + mouse.x * 0.03;
          bottle2.rotation.y = -elapsed * 0.4;
        }

        // Orbiting Freshwater Pearls
        pearls.forEach(({ mesh: pearl, basePos }, idx) => {
          pearl.position.y =
            basePos.y + Math.sin(elapsed * 1.3 + idx) * 0.05;
          pearl.position.x =
            basePos.x + Math.cos(elapsed * 0.8 + idx) * 0.03 + mouse.x * 0.03;
          pearl.rotation.y = elapsed * 0.35;
        });

        // Interactive Subtle Camera Movement when intro is complete
        if (!isIntroPlayingRef.current && cameraRef.current) {
          cameraRef.current.position.x = mouse.x * 0.12;
          cameraRef.current.position.y = 1.48 + mouse.y * 0.08;
          cameraRef.current.lookAt(0, 1.42, 0);

          roseLight.position.x = -1.8 + mouse.x * 0.6;
          roseLight.position.y = 2.0 + mouse.y * 0.4;
        }

        renderer.render(scene, camera);
      };

      animate();

      // CLEANUP
      return () => {
        cancelAnimationFrame(reqId);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);

        if (container && renderer.domElement) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        glintGeo.dispose();
        glintMat.dispose();
        pearlGeo.dispose();
        pearlMat.dispose();
        petalGeo.dispose();
        petalMat.dispose();
      };
    }, [onIntroComplete, playCinematicSequence, setMorph]);

    return (
      <div className={`relative ${className}`}>
        {/* Hidden Audio Element for Spoken Voice Greeting */}
        <audio
          ref={audioRef}
          src="/audio/greeting.mp3"
          preload="auto"
          playsInline
        />
        <div
          ref={containerRef}
          className="w-full h-full pointer-events-none select-none"
          aria-label="3D Animated Female Nail Artist"
        />
      </div>
    );
  }
);

Cinematic3DStudio.displayName = "Cinematic3DStudio";
