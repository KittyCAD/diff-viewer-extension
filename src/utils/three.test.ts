import { BoxGeometry } from 'three'
import { getCommonSphere, loadGeometry } from './three'

describe('Function loadGeometry', () => {
    it('loads a three geometry from a 10x10mm box', () => {
        const box_10 = Buffer.from(
            `
v 0.000000 0.000000 0.000000
v 10.000000 0.000000 0.000000
v 0.000000 0.000000 10.000000
v 10.000000 0.000000 10.000000
v 10.000000 10.000000 0.000000
v 10.000000 10.000000 10.000000
v 0.000000 10.000000 0.000000
v 0.000000 10.000000 10.000000
vn 0.000000 -1.000000 0.000000
vn 0.000000 -1.000000 0.000000
vn 1.000000 0.000000 0.000000
vn 1.000000 -0.000000 0.000000
vn 0.000000 1.000000 -0.000000
vn 0.000000 1.000000 0.000000
vn -1.000000 0.000000 0.000000
vn -1.000000 -0.000000 0.000000
vn 0.000000 0.000000 -1.000000
vn 0.000000 0.000000 -1.000000
vn 0.000000 0.000000 1.000000
vn 0.000000 0.000000 1.000000
f 1//1 2//1 3//1
f 3//2 2//2 4//2
f 2//3 5//3 4//3
f 4//4 5//4 6//4
f 5//5 7//5 6//5
f 6//6 7//6 8//6
f 7//7 1//7 8//7
f 8//8 1//8 3//8
f 1//9 5//9 2//9
f 7//10 5//10 1//10
f 6//11 3//11 4//11
f 6//12 8//12 3//12
`
        ).toString('base64')
        const geometry = loadGeometry(box_10)
        expect(geometry?.attributes.position.count).toEqual(6 * 2 * 3)
        expect(geometry?.attributes.normal.count).toEqual(6 * 2 * 3)
        expect(geometry?.attributes.uv).toBeDefined()
        expect(geometry?.boundingSphere?.center.x).toEqual(5)
        expect(geometry?.boundingSphere?.center.y).toEqual(5)
        expect(geometry?.boundingSphere?.center.z).toEqual(5)
        const diagonal = 10 * Math.sqrt(3)
        expect(geometry?.boundingSphere?.radius).toBeCloseTo(diagonal / 2)
    })

    it('fails with an empty or invalid input', () => {
        expect(loadGeometry('invalid')).toBeUndefined()
    })
})

describe('Function getCommonSphere', () => {
    // 1mm cube with "top-right" corner at origin
    const box_1_geom = new BoxGeometry(1, 1, 1)
    box_1_geom.translate(-1 / 2, -1 / 2, -1 / 2)
    // 2mm cube with "bottom left" corner at origin
    const box_2_geom = new BoxGeometry(2, 2, 2)
    box_2_geom.translate(2 / 2, 2 / 2, 2 / 2)

    it('gets the common bounding sphere between two geometries', () => {
        const sphere = getCommonSphere(box_1_geom, box_2_geom)
        expect(sphere.center.x).toEqual((2 - 1) / 2)
        expect(sphere.center.y).toEqual((2 - 1) / 2)
        expect(sphere.center.z).toEqual((2 - 1) / 2)
        const bothDiagonals = (1 + 2) * Math.sqrt(3)
        expect(sphere.radius).toBeCloseTo(bothDiagonals / 2)
    })

    it('gets the same bounding sphere from two identical geometries', () => {
        box_1_geom.computeBoundingSphere()
        const sphere_1 = getCommonSphere(box_1_geom, box_1_geom)
        expect(sphere_1.equals(box_1_geom.boundingSphere!)).toBeTruthy()

        box_2_geom.computeBoundingSphere()
        const sphere_2 = getCommonSphere(box_2_geom, box_2_geom)
        expect(sphere_2.equals(box_2_geom.boundingSphere!)).toBeTruthy()
    })
})
