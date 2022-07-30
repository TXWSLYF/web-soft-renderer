import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { vec3 } from "gl-matrix";
import Rasterizer, { BufferType, Primitive } from "./core/Rasterizer";
import { getModelMatrix, getProjectionMatrix, getViewMatrix } from "./core/Utils";
import styles from './App.module.scss';

const eyePos: vec3 = [0, 0, 5]
const pos: vec3[] = [
    [2, 0, -2],
    [0, 2, -2],
    [-2, 0, -2],
    [3.5, -1, -5],
    [2.5, 1.5, -5],
    [-1, 0.5, -5]
]
const ind: vec3[] = [
    [0, 1, 2],
    [3, 4, 5]
]
const cols: vec3[] = [
    [217.0, 238.0, 185.0],
    [217.0, 238.0, 185.0],
    [217.0, 238.0, 185.0],
    [185.0, 217.0, 238.0],
    [185.0, 217.0, 238.0],
    [185.0, 217.0, 238.0]
]

const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rst] = useState(new Rasterizer());
    const [isInited, setIsInited] = useState(false);
    const [posId, setPosId] = useState(0);
    const [indId, setIndId] = useState(0);
    const [colId, setColId] = useState(0);
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [objFileContent, setObjFileContent] = useState('')

    // rotate angle
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        if (!isInited) {
            return
        }

        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');

            rst.clear(BufferType.Color | BufferType.Depth);
            rst.setModel(getModelMatrix(angle));
            // rst.setModel(Matrix.getRotationMatrix([-1, 1, 1], angle))

            if (objFileContent) {
                rst.drawObj(objFileContent);
            } else {
                rst.draw(posId, indId, colId, Primitive.Triangle)
            }

            const imageData = context?.createImageData(width, height);
            if (imageData) {
                rst.frameBuffer.forEach((color, index) => {

                    if (imageData.data) {
                        imageData.data[index * 4] = color[0]
                        imageData.data[index * 4 + 1] = color[1]
                        imageData.data[index * 4 + 2] = color[2]
                        imageData.data[index * 4 + 3] = 255
                    }
                })

                context?.putImageData(imageData, 0, 0)
            }
        }
    }, [isInited, posId, indId, colId, objFileContent, width, height, angle, rst])

    useEffect(() => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const { width, height } = rect;

            canvasRef.current.width = width;
            canvasRef.current.height = height;

            rst.init(width, height)
            const posId = rst.loadPositions(pos);
            const indId = rst.loadIndices(ind);
            const colId = rst.loadColors(cols);
            const view = getViewMatrix(eyePos);
            const projection = getProjectionMatrix(45, 1, 0.1, 50);

            rst.setView(view);
            rst.setProjection(projection);
            setWidth(width)
            setHeight(height)
            setPosId(posId)
            setIndId(indId)
            setColId(colId)
            setIsInited(true)
        }
    }, [rst]);

    useEffect(() => {
        const handleOnKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'ArrowUp') {
                setAngle(val => val + 1)
            }

            if (e.code === 'ArrowDown') {
                setAngle(val => val - 1)
            }
        }

        window.addEventListener("keydown", handleOnKeyDown)

        return () => {
            window.removeEventListener('keydown', handleOnKeyDown)
        }
    }, [])

    const handleFileChange = useCallback((e: any) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e: any) => {
            const text = e.target.result
            setObjFileContent(text)
        };
        reader.readAsText(e.target.files[0])
    }, [])

    return useMemo(() => {
        return <div className={styles.app}>
            <input type="file" onChange={handleFileChange} />
            <canvas ref={canvasRef} className={styles.appCanvas}></canvas>
        </div>
    }, [handleFileChange])
}

export default App;