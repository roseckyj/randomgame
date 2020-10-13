import React, { createRef } from 'react';

import babylonjs, { Vector3, UniversalCamera, StandardMaterial, MeshBuilder, DirectionalLight } from 'babylonjs';
import { Scene, Engine, SceneEventArgs } from 'react-babylonjs';

import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';
import { Player, serializedPlayer } from '../../shared/gameObjects/60_Player';
import { Chunk } from '../../shared/gameObjects/10_Chunk';
import { GameScene } from '../../shared/Scene';
import { CONTROLS_WASD } from '../keyBindings';
import { NetworkClient } from './network/Client';
import { minimap } from './gui/minimap';
import { debugInfo } from './gui/debugInfo';
import { CAMERA_ANGLE, CAMERA_DISTANCE } from '../../shared/constants';
import { shadeText } from './utils/shadeText';
import { AbstractGameEntity, Platform, serializedEntity } from '../../shared/gameObjects/20_AbstractGameEntity';

export const MAX_RENDER_DISTANCE = 3;
const REQUEST_DISTANCE = 3;
const DELETE_DISTANCE = 5;

interface IGameCoreProps {
    apiUrl: string;
}

interface IGameCoreState {
    loggedIn: boolean;
}

export class GameCore extends React.Component<IGameCoreProps, IGameCoreState> {
    gameScene: GameScene;
    me: Player | null = null;

    babylonScene: babylonjs.Scene | null;
    guiTexture: AdvancedDynamicTexture | null;
    networkClient: NetworkClient;
    state: IGameCoreState = {
        loggedIn: false,
    };

    timer: NodeJS.Timeout;

    zoom: number = 1;
    renderDistance: number = MAX_RENDER_DISTANCE;

    debug: boolean = false;

    loginRef = createRef<HTMLInputElement>();
    passwordRef = createRef<HTMLInputElement>();

    mouseEntity: AbstractGameEntity | null;

    constructor(props: IGameCoreProps) {
        super(props);

        this.gameScene = new GameScene();
        this.networkClient = new NetworkClient(this.props.apiUrl, this.gameScene, () => this.babylonScene!);
        this.networkClient.on('authenticated', (data: serializedEntity<serializedPlayer>) => this.initGame(data));
        this.networkClient.on('invalidPassword', () => {
            if (this.loginRef.current && this.passwordRef.current) {
                this.loginRef.current.classList.add('shake');
                this.passwordRef.current.classList.add('shake');
                setTimeout(() => {
                    if (this.loginRef.current && this.passwordRef.current) {
                        this.loginRef.current.classList.remove('shake');
                        this.passwordRef.current.classList.remove('shake');
                    }
                }, 600);
            }
        });

        document.addEventListener('keydown', (event) => {
            this.gameScene.entities.forEach((entity) => entity.controllerManager.invoke('keyDown', event.keyCode));
        });

        document.addEventListener('keyup', (event) => {
            this.gameScene.entities.forEach((entity) => entity.controllerManager.invoke('keyUp', event.keyCode));
        });

        document.addEventListener('wheel', (event) => {
            this.zoom += (event.deltaY / Math.abs(event.deltaY)) * 0.12;
            if (this.zoom < 0.5) this.zoom = 0.5;
            if (this.zoom > 3) this.zoom = 3;
        });

        window.addEventListener('resize', (event) => {
            this.resize();
        });
    }

    componentDidMount() {
        this.resize();
        this.networkClient.open();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.networkClient.close();
    }

    initGame(player: serializedEntity<serializedPlayer>) {
        this.setState({
            loggedIn: true,
        });
        this.me = new Player(this.gameScene, player.id);
        this.me.attachRenderer(this.babylonScene!);
        this.me.attachControllers(Platform.Client, true);
        this.me.controllerManager.invoke('bindKeys', CONTROLS_WASD);
        this.me.deserializeImmediatelly(player);
        this.gameScene.entities.add(player.id, this.me);

        (window as any).player = this.me;
        (window as any).scene = this.gameScene;
        (window as any).enableDebug = () => {
            this.babylonScene && this.babylonScene.debugLayer.show();
            this.debug = true;
        };

        this.timer = setInterval(async () => {
            if (this.me) this.networkClient.sendPlayerUpdate(this.me);
        }, 100);
    }

    tick(deltaTime: number) {
        this.gameScene.entities.forEach((entity) => entity.tick(deltaTime));

        this.unloadUnusedComponents();
        this.requestChunks();

        if (this.guiTexture) {
            if (this.me) {
                const gui = this.guiTexture.getContext();
                const width = this.guiTexture.getSize().width;
                const height = this.guiTexture.getSize().height;
                gui.clearRect(0, 0, width, height);

                minimap(this.guiTexture, this.gameScene, this.me);
                if (this.debug) {
                    debugInfo(this.guiTexture, this.gameScene, deltaTime);
                }

                this.guiTexture.update();
            } else {
                const gui = this.guiTexture.getContext();
                const width = this.guiTexture.getSize().width;
                const height = this.guiTexture.getSize().height;
                gui.fillStyle = '#33334C';
                gui.fillRect(0, 0, width, height);

                gui.fillStyle = '#FFFFFF';
                gui.font = '20px pixel';
                gui.textBaseline = 'middle';
                gui.textAlign = 'center';

                shadeText(gui, 'Připojování k serveru...', width / 2, height / 2);

                this.guiTexture.update();
            }
        }
    }

    resize() {
        const canvas = document.getElementById('game') as HTMLCanvasElement;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    onSceneMount(event: SceneEventArgs) {
        const { scene } = event;

        this.babylonScene = (scene as any) as babylonjs.Scene;

        const camera = new UniversalCamera('Camera', new Vector3(0, 0, CAMERA_DISTANCE), this.babylonScene);
        camera.rotation = new Vector3(-CAMERA_ANGLE, 0, 0);
        //camera.attachControl(event.canvas, true);

        const skybox = MeshBuilder.CreateCylinder(
            'skyBox',
            {
                height: CAMERA_DISTANCE * 100,
                diameterTop: MAX_RENDER_DISTANCE * 16 * 100 * 3,
                diameterBottom: MAX_RENDER_DISTANCE * 16 * 100 * 1,
                tessellation: 24,
            },
            this.babylonScene,
        );

        const nightLight = new DirectionalLight('nightLight', new Vector3(0, 1, 2), this.babylonScene);
        nightLight.diffuse = new BABYLON.Color3(0.5, 0.5, 1);
        const nightLightIntensity = 0.5;

        const dayLight = new DirectionalLight('dayLight', new Vector3(0, 1, 2), this.babylonScene);
        dayLight.diffuse = new BABYLON.Color3(1, 1, 0.8);
        const dayLightIntensity = 1.5;

        //const shadowGenerator = new ShadowGenerator(1024, light);
        //shadowGenerator.useExponentialShadowMap = true;

        const skyboxMaterial = new StandardMaterial('skyBox', this.babylonScene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.rotation = new Vector3(Math.PI / 2, 0, 0);

        this.guiTexture = AdvancedDynamicTexture.CreateFullscreenUI('GUI', true, scene);

        scene.onPointerDown = (event, pickResult) => {
            if (pickResult.hit && pickResult.pickedMesh && !pickResult.pickedMesh.name.startsWith('chunk')) {
                this.mouseEntity = this.gameScene.entities.get(pickResult.pickedMesh.name.split(' ')[1]);
                if (this.mouseEntity) {
                    this.mouseEntity.controllerManager.invoke('mouseDown', event.button);
                }
            } else {
                this.mouseEntity = null;
            }
        };
        scene.onPointerUp = (event) => {
            if (this.mouseEntity) {
                this.mouseEntity.controllerManager.invoke('mouseUp', event.button);
            }
        };

        /*
        var pipeline = new BABYLON.LensRenderingPipeline(
            'lens',
            {
                edge_blur: 0.2,
                chromatic_aberration: 0.2,
                distortion: 0.1,
                grain_amount: 0.1,

                dof_focus_distance: (CAMERA_DISTANCE * this.zoom) / Math.cos(CAMERA_ANGLE),
                dof_aperture: 100, // set this very high for tilt-shift effect
                dof_pentagon: true,
                dof_gain: 1.0,
                dof_threshold: 1.0,
                dof_darken: 0.25,
            },
            scene as any,
            1.0,
            camera as any,
        );
        */

        scene.getEngine().runRenderLoop(() => {
            this.tick(scene.getEngine().getDeltaTime());
            //this.gameScene.time += scene.getEngine().getDeltaTime();

            (async () => {
                /*
                this.gameScene.entities.forEach((entity) => {
                    entity.renderer && shadowGenerator.addShadowCaster(entity.renderer.mesh);
                });
                */
                if (this.me) {
                    camera.position = new Vector3(
                        this.me.position.x * 100,
                        -this.me.position.y * 100 - CAMERA_DISTANCE * this.zoom * Math.tan(CAMERA_ANGLE),
                        -CAMERA_DISTANCE * this.zoom,
                    );

                    const time = this.gameScene.getTime();
                    if (time.hour > 9 && time.hour < 18) {
                        dayLight.intensity = dayLightIntensity;
                        nightLight.intensity = 0;
                    }
                    if (time.hour > 21 || time.hour < 6) {
                        dayLight.intensity = 0;
                        nightLight.intensity = nightLightIntensity;
                    }
                    if (time.hour > 6 && time.hour < 9) {
                        const change = (time.hour - 6) / 3;
                        dayLight.intensity = change * dayLightIntensity;
                        nightLight.intensity = (1 - change) * nightLightIntensity;
                    }
                    if (time.hour > 18 && time.hour < 21) {
                        const change = (time.hour - 18) / 3;
                        dayLight.intensity = (1 - change) * dayLightIntensity;
                        nightLight.intensity = change * nightLightIntensity;
                    }
                    console.log(dayLight.intensity, nightLight.intensity);

                    //pipeline.setFocusDistance((CAMERA_DISTANCE * this.zoom) / Math.cos(CAMERA_ANGLE));

                    skybox.position.x = this.me.position.x * 100;
                    skybox.position.y = -this.me.position.y * 100;
                }

                this.renderDistance = Math.min(Math.ceil(this.zoom * 2), MAX_RENDER_DISTANCE);
            })();

            if (scene) {
                scene.render();
            }
        });
    }

    unloadUnusedComponents() {
        if (this.me) {
            this.gameScene.chunks.forEach((chunk) => {
                const distX = Math.abs(Math.round(this.me!.position.x / 16) - chunk.position.x);
                const distY = Math.abs(Math.round(this.me!.position.y / 16) - chunk.position.y);
                if (distX > this.renderDistance || distY > this.renderDistance) {
                    chunk.setVisibility(false);
                    if (distX > DELETE_DISTANCE || distY > DELETE_DISTANCE) {
                        this.gameScene.chunks.remove(chunk.id);
                    }
                } else {
                    chunk.setVisibility(true);
                }
            });

            this.gameScene.entities.forEach((entity) => {
                const distX = Math.abs(Math.round(this.me!.position.x) - entity.position.x) / 16;
                const distY = Math.abs(Math.round(this.me!.position.y) - entity.position.y) / 16;

                if (distX > this.renderDistance || distY > this.renderDistance) {
                    entity.setVisibility(false);
                    if (distX > DELETE_DISTANCE || distY > DELETE_DISTANCE) {
                        this.gameScene.entities.remove(entity.id);
                    }
                } else {
                    entity.setVisibilityAttachRenderer(true, this.babylonScene!);
                }
            });
        }
    }

    requestChunks() {
        if (this.me) {
            for (let x = -REQUEST_DISTANCE; x <= REQUEST_DISTANCE; x++) {
                for (let y = -REQUEST_DISTANCE; y <= REQUEST_DISTANCE; y++) {
                    const chunkX = Math.round(this.me.position.x / 16) + x;
                    const chunkY = Math.round(this.me.position.y / 16) + y;
                    const chunkId = Chunk.getId(chunkX, chunkY);

                    if (!this.gameScene.chunks.includes(chunkId)) {
                        this.networkClient.requestChunk(chunkX, chunkY);

                        const chunk = new Chunk(this.gameScene, chunkX, chunkY);
                        chunk.attachRenderer(this.babylonScene!);

                        this.gameScene.chunks.add(chunkId, chunk);
                    }
                }
            }
        }
    }

    render() {
        return (
            <>
                {!this.state.loggedIn && (
                    <div className="center">
                        <p>Přihlaste se, nebo si vytvořte účet:</p>
                        <p>
                            <input type="text" placeholder="Jméno" ref={this.loginRef} />
                        </p>
                        <p>
                            <input type="password" placeholder="Heslo" ref={this.passwordRef} />
                        </p>
                        <p>
                            <button
                                onClick={() =>
                                    this.networkClient.auth(
                                        this.loginRef!.current!.value,
                                        this.passwordRef!.current!.value,
                                    )
                                }
                            >
                                Přihlásit se!
                            </button>
                        </p>
                    </div>
                )}
                <Engine antialias={true} canvasId="game">
                    <Scene onSceneMount={(event: SceneEventArgs) => this.onSceneMount(event)}>
                        <></>
                    </Scene>
                </Engine>
            </>
        );
    }
}
