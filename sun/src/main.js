import * as THREE from 'three'
import * as dat from 'dat.gui'
import fragment from './shader/fragment.glsl'
import fragmentSun from './shaderSun/fragment.glsl'
import fragmentAround from './shaderAround/fragment.glsl'
import vertex from './shader/vertex.glsl'
import vertexSun from './shaderSun/vertex.glsl'
import vertexAround from './shaderAround/vertex.glsl'
import { TimelineMax } from "gsap"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


export default class Scene {
    constructor(el) {
        this.canvas = el
        this.width = this.canvas.offsetWidth
        this.height = this.canvas.offsetHeight
        this.time = 0
        this.paused = false
        this.start = Date.now()
        this.setScene()
        this.setRender()
        this.setCamera()
            // this.setControls()

        this.addLight()

        this.addAround()
        this.addCubeTexture()
        this.addObjects()

        // this.setAxesHelper()
        this.resize()

        this.render()
        this.setupResize()
    }

    setScene() {
        this.scene = new THREE.Scene()
            // this.scene.background = new THREE.Color(0xffffff)
    }
    setRender() {
        this.renderer = new THREE.WebGLRenderer({
            // canvas: this.canvas,
            antialias: true
        })

        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(0x000000, 1)
        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.canvas.appendChild(this.renderer.domElement)
    }

    setCamera() {
        const aspectRatio = window.innerWidth / window.innerHeight
        const fieldOfView = 70
        const nearPlane = 0.1
        const farPlane = 10000
        this.camera = new THREE.PerspectiveCamera(
            fieldOfView,
            aspectRatio,
            nearPlane,
            farPlane
        )
        this.camera.position.set(0, 0, 2)

        this.scene.add(this.camera)
    }

    setControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            // this.controls.autoRotate = true
            // this.controls.autoRotateSpeed = .2
        this.controls.enableDamping = true
    }

    setAxesHelper() {
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }
    addLight() {
        this.light = new THREE.DirectionalLight(0xffffff, 5)
        this.scene.add(this.light)
    }

    settings() {
        this.settings = {
            time: 0,
            progress: 0
        }
        this.gui = new dat.GUI()
        this.gui.add(this.settings, 'time', 0, 100, 0.01)
        this.gui.add(this.settings, 'progress', 0, 1, 0.01)
    }

    resize() {
        this.width = this.canvas.offsetWidth
        this.height = this.canvas.offsetHeight

        // 更新渲染器 
        this.renderer.setSize(this.width, this.height)

        // 更新渲染器 像素比
        this.renderer.setPixelRatio(window.devicePixelRatio)

        // 更新摄像机 宽高比
        this.camera.aspect = this.width / this.height

        // 更新摄像机 投影矩阵
        this.camera.updateProjectionMatrix()
    }
    setupResize() {
        window.addEventListener('resize', this.resize.bind(this))
    }

    addCubeTexture() {
        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
            format: THREE.RGBAFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipMapLinearFilter,
            encoding: THREE.sRGBEncoding
        });

        this.cubeCamera = new THREE.CubeCamera(0.1, 10, this.cubeRenderTarget);

        //
        this.materialPerlin = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                resolution: { value: new THREE.Vector4() },
                time: { type: 'f', value: this.time },
            }
        })
        this.geometry2 = new THREE.SphereGeometry(1, 32, 32)

        this.perlin = new THREE.Mesh(this.geometry2, this.materialPerlin)

        this.scene.add(this.perlin)
    }
    addAround() {
        this.materialAround = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            vertexShader: vertexAround,
            fragmentShader: fragmentAround,
            uniforms: {
                resolution: { value: new THREE.Vector4() },
                time: { type: 'f', value: this.time },
                uPerlin: { value: null },
            }
        })
        this.geometry1 = new THREE.SphereGeometry(1.15, 32, 32)

        this.sunaround = new THREE.Mesh(this.geometry1, this.materialAround)

        this.scene.add(this.sunaround)
    }

    addObjects() {
        // ShaderMaterial
        this.materialSun = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            vertexShader: vertexSun,
            fragmentShader: fragmentSun,
            uniforms: {
                resolution: { value: new THREE.Vector4() },
                time: { type: 'f', value: this.time },
                uPerlin: { value: null },
            }
        })
        this.geometry = new THREE.SphereGeometry(1, 32, 32)

        this.plane = new THREE.Mesh(this.geometry, this.materialSun)

        this.scene.add(this.plane)
    }

    stop() {
        this.paused = true
    }

    play() {
        this.paused = false
        this.render()
    }

    render() {
        if (this.paused) return
        this.time += 0.05
        this.materialPerlin.uniforms['time'].value = this.time
        this.materialSun.uniforms['time'].value = this.time
        this.materialSun.uniforms.uPerlin.value = this.cubeRenderTarget.texture

        this.cubeCamera.update(this.renderer, this.scene);
        // this.controls.update();
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
}

new Scene(document.getElementById('container'))