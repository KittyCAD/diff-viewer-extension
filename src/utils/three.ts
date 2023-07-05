import {
    Box3,
    BufferAttribute,
    BufferGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    Sphere,
    Vector3,
} from 'three'
import { OBJLoader } from 'three-stdlib'
import { Buffer } from 'buffer'

export function loadGeometry(file: string): BufferGeometry | undefined {
    const loader = new OBJLoader()
    const buffer = Buffer.from(file, 'base64').toString()
    const group = loader.parse(buffer)
    console.log(`Model ${group.id} loaded`)
    const geometry = (group.children[0] as Mesh)?.geometry
    if (geometry) {
        if (!geometry.attributes.uv) {
            // UV is needed for @react-three/csg
            // see: github.com/KittyCAD/diff-viewer-extension/issues/73
            geometry.setAttribute(
                'uv',
                new BufferAttribute(new Float32Array([]), 1)
            )
        }
        geometry.computeBoundingSphere() // will be used for auto-centering
    }
    return geometry
}

export function getCommonSphere(
    beforeGeometry: BufferGeometry,
    afterGeometry: BufferGeometry
) {
    const group = new Group()
    const dummyMaterial = new MeshBasicMaterial()
    group.add(new Mesh(beforeGeometry, dummyMaterial))
    group.add(new Mesh(afterGeometry, dummyMaterial))
    const boundingBox = new Box3().setFromObject(group)
    const center = new Vector3()
    boundingBox.getCenter(center)
    return boundingBox.getBoundingSphere(new Sphere(center))
}
