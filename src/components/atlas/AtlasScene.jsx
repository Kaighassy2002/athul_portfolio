import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import {
  lerp,
  latLonToVec,
  sampleShots,
  nodeEmphasis,
  NODES,
  PATH_EDGES,
  smootherstep,
} from "./story";
import {
  ensureAtlasEnvironment,
  ensureGlobeMaps,
  peekAtlasEnvironment,
  preloadAtlasAssets,
} from "./atlasAssets";

const atmoVertex = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPosition = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const atmoFragment = `
uniform vec3 uColor;
uniform float uPower;
uniform float uStrength;
varying vec3 vNormal;
varying vec3 vWorldPosition;
void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(uPower - abs(dot(vNormal, viewDir)), 2.4);
  gl_FragColor = vec4(uColor, 1.0) * fresnel * uStrength;
}
`;

function GlobeBody({ maps, mobile }) {
  return (
    <mesh>
      <sphereGeometry args={[1.52, mobile ? 48 : 96, mobile ? 32 : 64]} />
      <meshPhysicalMaterial
        map={maps.albedo}
        roughnessMap={maps.roughness}
        bumpMap={maps.bump}
        bumpScale={0.045}
        roughness={1}
        metalness={0.06}
        envMapIntensity={0.42}
        clearcoat={0.18}
        clearcoatRoughness={0.55}
        sheen={0.22}
        sheenColor="#c9b48a"
        sheenRoughness={0.7}
      />
    </mesh>
  );
}

function CloudLayer({ maps, mobile, scroll }) {
  const ref = useRef(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const hold = scroll.current?.hold ?? 0;
    const speed = lerp(0.007, 0.001, hold);
    ref.current.rotation.y += delta * speed;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.545, mobile ? 32 : 64, mobile ? 24 : 48]} />
      <meshLambertMaterial
        map={maps.clouds}
        transparent
        depthWrite={false}
        opacity={0.72}
        color="#f4f1e8"
      />
    </mesh>
  );
}

function Atmosphere({ color, scale, power, strength, side }) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uStrength: { value: strength },
    }),
    [color, power, strength]
  );

  return (
    <mesh scale={scale}>
      <sphereGeometry args={[1.52, 64, 48]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={atmoVertex}
        fragmentShader={atmoFragment}
        blending={THREE.AdditiveBlending}
        side={side}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function Cartography({ mobile }) {
  const radius = 1.568;
  const meridians = mobile ? 4 : 6;

  return (
    <group>
      {Array.from({ length: meridians }, (_, i) => (
        <mesh key={`m-${i}`} rotation={[0, (i / meridians) * Math.PI, 0]}>
          <torusGeometry args={[radius, 0.0026, 6, mobile ? 48 : 96]} />
          <meshStandardMaterial
            color="#3d5346"
            metalness={0.2}
            roughness={0.55}
            transparent
            opacity={0.22}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.0055, 6, mobile ? 48 : 96]} />
        <meshStandardMaterial
          color="#8a7350"
          metalness={0.62}
          roughness={0.28}
          transparent
          opacity={0.58}
        />
      </mesh>
    </group>
  );
}

function AtlasNodes({ scroll }) {
  const group = useRef(null);
  const points = useMemo(
    () => NODES.map((node) => ({ ...node, position: latLonToVec(node.lat, node.lon, 1.555) })),
    []
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const follow = 1 - Math.exp(-dt * 7);
    const chapter = scroll.current.chapter;
    const forest = scroll.current.forest || 0;

    group.current.children.forEach((mesh, index) => {
      const node = points[index];
      if (!node || !mesh.material) return;
      const emphasis = nodeEmphasis(node, chapter);
      const scale = lerp(0.55, 1.32, emphasis);
      mesh.scale.setScalar(lerp(mesh.scale.x, scale, follow));
      mesh.material.opacity = lerp(mesh.material.opacity, 0.18 + emphasis * 0.82, follow);
      mesh.material.emissiveIntensity = lerp(
        mesh.material.emissiveIntensity,
        0.12 + emphasis * (0.7 + forest * 0.35),
        follow
      );
    });
  });

  return (
    <group ref={group}>
      {points.map((node) => (
        <mesh key={node.id} position={node.position}>
          <sphereGeometry args={[node.kind === "place" ? 0.034 : 0.026, 12, 12]} />
          <meshStandardMaterial
            color="#f4f0e6"
            emissive={node.kind === "field" ? "#1f6b4a" : "#8a7350"}
            emissiveIntensity={0.25}
            metalness={0.35}
            roughness={0.32}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

function PathRoute({ scroll }) {
  const material = useRef(null);
  const positions = useMemo(() => {
    const byId = Object.fromEntries(
      NODES.map((node) => [node.id, latLonToVec(node.lat, node.lon, 1.58)])
    );
    const data = [];
    PATH_EDGES.forEach(([from, to]) => {
      data.push(...byId[from], ...byId[to]);
    });
    return new Float32Array(data);
  }, []);

  useFrame((_, delta) => {
    if (!material.current) return;
    const chapter = scroll.current.chapter;
    const target =
      chapter === "unfold" ? 0.42 : chapter === "person" ? 0.22 : chapter === "inspect" ? 0.12 : 0.06;
    const dt = Math.min(delta, 0.05);
    material.current.opacity = lerp(material.current.opacity, target, 1 - Math.exp(-dt * 6));
  });

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={material}
        color="#8a7350"
        transparent
        opacity={0.08}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function OrbitRing({ scroll, mobile }) {
  const ring = useRef(null);

  useFrame((_, delta) => {
    if (!ring.current || scroll.current.reduced) return;
    const intro = scroll.current.progress < 0.08;
    if (!intro) return;
    const fade = 1 - Math.min(1, scroll.current.progress / 0.08);
    ring.current.rotation.z += delta * 0.04 * fade;
  });

  return (
    <mesh ref={ring} rotation={[Math.PI / 2.2, 0.32, 0.12]}>
      <torusGeometry args={[1.94, 0.01, 8, mobile ? 64 : 96]} />
      <meshStandardMaterial
        color="#8a7350"
        metalness={0.78}
        roughness={0.3}
        transparent
        opacity={0.48}
      />
    </mesh>
  );
}

function AtlasInstrument({ scroll, mobile, maps }) {
  return (
    <group>
      <GlobeBody maps={maps} mobile={mobile} />
      <CloudLayer maps={maps} mobile={mobile} scroll={scroll} />
      <Atmosphere
        color="#8fbfa4"
        scale={1.086}
        power={0.62}
        strength={1.15}
        side={THREE.BackSide}
      />
      <Atmosphere
        color="#d7c49a"
        scale={1.018}
        power={0.78}
        strength={0.28}
        side={THREE.FrontSide}
      />
      <Cartography mobile={mobile} />
      <OrbitRing scroll={scroll} mobile={mobile} />
      <PathRoute scroll={scroll} />
      <AtlasNodes scroll={scroll} />
      <ContactShadows
        position={[0, -2.02, 0]}
        opacity={0.38}
        scale={8.5}
        blur={2.6}
        far={4}
        color="#1e3a2f"
      />
    </group>
  );
}

function Rig({ scroll, mobile, maps }) {
  const model = useRef(null);
  const look = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);
  const fogTarget = useMemo(() => new THREE.Color("#eef2e6"), []);

  useFrame((state, delta) => {
    const s = scroll.current;
    const shot = sampleShots(s.reduced ? 0 : s.smoothed, mobile);
    const dt = Math.min(delta, 0.05);
    const hold = s.reduced ? 1 : s.hold;
    const rest = s.reduced ? 0 : s.rest || 0;
    const followRate = lerp(11.8, 4.1, hold);
    const follow = 1 - Math.exp(-dt * followRate);
    const pointerGain = (1 - hold) * 0.16;
    const approach = smootherstep(0, 1, s.entry ?? 1);
    const introFade = s.reduced ? 0 : 1 - Math.min(1, s.progress / 0.08);
    const idle = introFade > 0 ? Math.sin(state.clock.elapsedTime * 0.28) * 0.018 * introFade : 0;

    s.pointerSX = lerp(s.pointerSX, s.pointerX * pointerGain, 1 - Math.exp(-dt * 3.4));
    s.pointerSY = lerp(s.pointerSY, s.pointerY * pointerGain, 1 - Math.exp(-dt * 3.4));

    if (model.current) {
      model.current.position.x = lerp(model.current.position.x, shot.modelPos[0], follow);
      model.current.position.y = lerp(model.current.position.y, shot.modelPos[1], follow);
      model.current.position.z = lerp(
        model.current.position.z,
        shot.modelPos[2] - rest * 0.38,
        follow
      );
      model.current.rotation.x = lerp(
        model.current.rotation.x,
        shot.modelRot[0] + s.pointerSY * 0.05,
        follow
      );
      model.current.rotation.y = lerp(
        model.current.rotation.y,
        shot.modelRot[1] + idle + s.pointerSX * 0.06,
        follow
      );
      model.current.rotation.z = lerp(
        model.current.rotation.z,
        shot.modelRot[2] - s.pointerSX * 0.025,
        follow
      );
      let scale = shot.modelScale * (mobile ? 0.74 : 1) * (1 - rest * 0.045);
      if (mobile && shot.modelScale > 1.08) scale = 1.0 * 0.74;
      scale *= lerp(0.78, 1, approach);
      model.current.scale.setScalar(lerp(model.current.scale.x, scale, follow));
    }

    const camZ =
      shot.camPos[2] + (mobile ? 0.85 : 0) + rest * 0.22 + lerp(1.55, 0, approach);
    state.camera.position.x = lerp(
      state.camera.position.x,
      shot.camPos[0] + s.pointerSX * 0.1,
      follow
    );
    state.camera.position.y = lerp(
      state.camera.position.y,
      shot.camPos[1] - s.pointerSY * 0.06,
      follow
    );
    state.camera.position.z = lerp(state.camera.position.z, camZ, follow);
    state.camera.fov = lerp(state.camera.fov, mobile ? shot.camFov + 4 : shot.camFov, follow);
    state.camera.updateProjectionMatrix();

    targetLook.set(shot.camLook[0], shot.camLook[1], shot.camLook[2]);
    look.lerp(targetLook, follow);
    state.camera.lookAt(look);

    if (state.scene.fog) {
      fogTarget.set(s.fog || "#eef2e6");
      state.scene.fog.color.lerp(fogTarget, follow);
      state.scene.fog.near = lerp(state.scene.fog.near, lerp(9.2, 7.5, rest), follow);
      state.scene.fog.far = lerp(state.scene.fog.far, lerp(20, 15.2, rest), follow);
    }

    state.gl.toneMappingExposure = lerp(
      state.gl.toneMappingExposure,
      lerp(1.08, 0.92, rest),
      follow
    );
  });

  return (
    <group ref={model} position={[0, 0.32, 0]}>
      <AtlasInstrument scroll={scroll} mobile={mobile} maps={maps} />
    </group>
  );
}

function Lights({ scroll }) {
  const key = useRef(null);
  const fill = useRef(null);
  const rim = useRef(null);

  useFrame((_, delta) => {
    const rest = scroll.current?.rest || 0;
    const follow = 1 - Math.exp(-Math.min(delta, 0.05) * 4.2);
    const dark =
      typeof document !== "undefined" &&
      document.documentElement.dataset.theme === "dark";
    if (key.current) {
      key.current.intensity = lerp(
        key.current.intensity,
        lerp(dark ? 1.85 : 2.15, dark ? 1.12 : 1.28, rest),
        follow
      );
    }
    if (fill.current) {
      fill.current.intensity = lerp(
        fill.current.intensity,
        lerp(dark ? 0.32 : 0.55, dark ? 0.16 : 0.28, rest),
        follow
      );
    }
    if (rim.current) {
      rim.current.intensity = lerp(
        rim.current.intensity,
        lerp(dark ? 0.42 : 0.28, dark ? 0.2 : 0.14, rest),
        follow
      );
    }
  });

  return (
    <>
      <hemisphereLight args={["#fff4e0", "#1a2e24", 0.42]} />
      <ambientLight intensity={0.16} color="#e8efe4" />
      <directionalLight
        ref={key}
        position={[6.4, 4.8, 3.2]}
        intensity={2.15}
        color="#fff1d0"
      />
      <directionalLight
        ref={fill}
        position={[-4.6, 1.1, -3.8]}
        intensity={0.55}
        color="#6f9a82"
      />
      <directionalLight
        ref={rim}
        position={[-1.2, 2.4, 5.2]}
        intensity={0.28}
        color="#f3e6c4"
      />
    </>
  );
}

function AtlasScene({ scroll, compact }) {
  const mobile = Boolean(compact ?? scroll.current?.compact);
  const reduced = Boolean(scroll.current?.reduced);
  const maps = use(ensureGlobeMaps(mobile));
  const [envMap, setEnvMap] = useState(() => peekAtlasEnvironment());

  useEffect(() => {
    let cancelled = false;
    ensureAtlasEnvironment()
      .then((texture) => {
        if (!cancelled) setEnvMap(texture);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.18, 7.5], fov: 36, near: 0.1, far: 48 }}
      dpr={mobile ? [1, 1.2] : [1, 1.6]}
      gl={{
        antialias: !mobile,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      frameloop={reduced ? "demand" : "always"}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMappingExposure = 1.08;
        invalidate();
      }}
      style={{ pointerEvents: "none" }}
      aria-label="A three-dimensional atlas globe that turns as the page scrolls"
    >
      <fog attach="fog" args={["#eef2e6", 9.2, 20]} />
      <Lights scroll={scroll} />
      <Rig scroll={scroll} mobile={mobile} maps={maps} />
      {envMap ? (
        <Environment
          map={envMap}
          background={false}
          environmentIntensity={0.32}
        />
      ) : null}
    </Canvas>
  );
}

export { preloadAtlasAssets };
export default AtlasScene;
