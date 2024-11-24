import {
  ContactShadows,
  Grid,
  MapControls,
  OrbitControls,
  useCursor,
} from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useAtom } from "jotai";
import { Suspense, useEffect, useRef, useState } from "react";
import { charactersAtom, mapAtom, socket, userAtom } from "./SocketManager";
import * as THREE from "three";
import { Item } from "./Item";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useGrid } from "../hooks/useGridHook";
import {
  buildModeAtom,
  draggedItemAtom,
  draggedItemRotationAtom,
  shopModeAtom,
} from "./UI";
import Shop from "./Shop";
export const Experience = () => {
  const [characters] = useAtom(charactersAtom);

  const [buildMode, setBuildMode] = useAtom(buildModeAtom);
  const [shopMode, setShopMode] = useAtom(shopModeAtom);

  const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
  const [draggedItemRotation, setDraggedItemRotation] = useAtom(
    draggedItemRotationAtom
  );
  const [dragPosition, setDraggedPosition] = useState(null);
  const [canDrop, setCanDrop] = useState(false);

  const [map] = useAtom(mapAtom);
  const [items, setItems] = useState(map?.items || []);

  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  const { vector3ToGrid, gridToVector3 } = useGrid();

  const scene = useThree((state) => state.scene);
  const [user] = useAtom(userAtom);

  const onPlaneClicked = (e) => {
    if (!buildMode) {
      const character = scene.getObjectByName(`character-${user}`);
      if (!character) return;
      let from = vector3ToGrid(character.position);
      let to = vector3ToGrid(e.point);
      socket.emit("move", { from, to });
    } else {
      if (draggedItem !== null) {
        if (canDrop) {
          setItems((prev) => {
            const newItems = [...prev];

            delete newItems[draggedItem]?.tmp;
            newItems[draggedItem].gridPosition = vector3ToGrid(e.point);
            newItems[draggedItem].rotation = draggedItemRotation;
            return newItems;
          });
        }
        setDraggedItem(null);
      }
    }
  };

  useEffect(() => {
    if (draggedItem === null) {
      setItems((prev) => prev?.filter((item) => !item?.tmp));
    }
  }, [draggedItem]);

  useEffect(() => {
    if (!draggedItem) return;

    const item = items[draggedItem];

    const width =
      draggedItemRotation === 1 || draggedItemRotation === 3
        ? item.size[1]
        : item.size[0];
    const height =
      draggedItemRotation === 1 || draggedItemRotation === 3
        ? item.size[0]
        : item.size[1];

    let droppable = true;

    // check if the item is in bounds
    if (
      dragPosition &&
      (dragPosition[0] < 0 ||
        dragPosition[0] + width > map?.size[0] * map?.gridDivision)
    ) {
      droppable = false;
    }
    if (
      dragPosition &&
      (dragPosition[1] < 0 ||
        dragPosition[1] + height > map?.size[1] * map?.gridDivision)
    ) {
      droppable = false;
    }

    // check the Items not Collide With The Other Item
    if (dragPosition && !item.walkable && !item.wall) {
      items.forEach((otherItem, idx) => {
        // ignore current Item
        if (idx === draggedItem) return;

        // ignore wall and the Floor
        if (otherItem.walkable || otherItem.wall) {
          return;
        }

        // check the Item Overlapping
        const otheItemWidth =
          otherItem.rotation === 1 || otherItem.rotation === 3
            ? otherItem.size[1]
            : otherItem.size[0];
        const otherItemHeight =
          otherItem.rotation === 1 || otherItem.rotation === 3
            ? otherItem.size[0]
            : otherItem.size[1];

        if (
          dragPosition[0] < otherItem.gridPosition[0] + otheItemWidth &&
          dragPosition[0] + width > otherItem.gridPosition[0] &&
          dragPosition[1] < otherItem.gridPosition[1] + otherItemHeight &&
          dragPosition[1] + height > otherItem.gridPosition[1]
        ) {
          droppable = false;
        }
      });
    }

    setCanDrop(droppable);
  }, [dragPosition, draggedItem, items, draggedItemRotation]);

  const controls = useRef();
  const state = useThree((state) => state);

  useEffect(() => {
    if (buildMode) {
      setItems(map?.items || []);
      state.camera.position.set(15, 15, 15);
      controls.current.target.set(map?.size[0] / 2, 0, map?.size[1] / 2);
    } else {
      socket.emit("itemsUpdate", items);
    }
  }, [buildMode]);

  useEffect(() => {
    if (shopMode) {
      state.camera.position.set(0, 5, 8);
      controls.current.target.set(0, 0, 0);
    } else {
      state.camera.position.set(15, 15, 15);
      controls.current.target.set(map?.size[0] / 2, 0, map?.size[1] / 2);
    }
  }, [shopMode]);

  const onItemSelected = (item) => {
    setShopMode(false);

    setItems((prev) => {
      return [
        ...prev,
        {
          ...item,
          gridPosition: [0, 0],
          tmp: true,
        },
      ];
    });
    setDraggedItem(items.length);
    setDraggedItemRotation(0);
  };

  return (
    <>
      <OrbitControls
        ref={controls}
        minDistance={5}
        maxDistance={30}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 4}
        screenSpacePanning={false}
        enableZoom={!shopMode}
      />
      {/* <ambientLight intensity={0.1} castShadow /> */}
      <directionalLight
        position={[-4, 4, -4]}
        castShadow
        intensity={0.53}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach={"shadow-camera"}
          args={[-map?.size[0], map?.size[1], 10, -10]}
        />
      </directionalLight>

      {shopMode && <Shop onItemSelected={onItemSelected} />}

      {!shopMode &&
        (buildMode ? items : map && map?.items && map?.items)?.map(
          (item, idx) => (
            <Item
              key={`${item.name}-${idx}`}
              item={item}
              onClick={() => {
                if (!buildMode) return;
                setDraggedItem((prev) => (prev === null ? idx : prev));
                setDraggedItemRotation(item.rotation || 0);
              }}
              isDragging={draggedItem === idx}
              dragPosition={dragPosition}
              draggedItemRotation={draggedItemRotation}
              canDrop={canDrop}
            />
          )
        )}

      {!shopMode && (
        <mesh
          rotation-x={-Math.PI / 2}
          position-y={-0.02}
          onClick={onPlaneClicked}
          onPointerEnter={() => setOnFloor(true)}
          onPointerLeave={() => setOnFloor(false)}
          position-x={map?.size[0] / 2}
          position-z={map?.size[1] / 2}
          onPointerMove={(e) => {
            if (!buildMode) return;

            const newPositon = vector3ToGrid(e.point);
            if (
              !dragPosition ||
              newPositon[0] !== dragPosition[0] ||
              newPositon[1] !== dragPosition[1]
            ) {
              setDraggedPosition(newPositon);
            }
          }}
          receiveShadow
        >
          <planeGeometry args={map?.size} />
          <meshStandardMaterial color={"#f0f0f0"} />
        </mesh>
      )}
      {buildMode && !shopMode && (
        <Grid
          infiniteGrid
          fadeDistance={50}
          position-y={0.002}
          fadeStrength={5}
        />
      )}
      {!buildMode &&
        characters.map((character) => {
          return (
            <Suspense key={character.id}>
              <Avatar
                id={character.id}
                position={
                  // new THREE.Vector3(
                  //   character.position[0] / map?.gridDivision +
                  //     1 / map?.gridDivision / 2,
                  //   0,
                  //   character.position[1] / map?.gridDivision +
                  //     1 / map?.gridDivision / 2
                  // )
                  gridToVector3(character.position)
                }
                path={character.path}
                topColor={character.topColor}
                hairColor={character.hairColor}
                feetColor={character.feetColor}
                bottomColor={character.bottomColor}
                avatarUrl={character?.avatarUrl}
              />
            </Suspense>
          );
        })}
    </>
  );
};
