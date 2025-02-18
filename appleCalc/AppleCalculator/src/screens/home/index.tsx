//import { start } from 'node:repl';
import {useRef, useState, useEffect} from 'react';
//useRef: A ref is like a container that holds a value (current) and persists across renders.
//Unlike useState, changes to useRef do not trigger a component re-render.
import { SWATCHES } from 'C:/Users/HP/Desktop/MathCam/appleCalc/AppleCalculator/constants.ts';
import { ColorSwatch, Group } from '@mantine/core';
import { Button } from '@/components/ui/button';
import axios from 'axios';

//to keep typescript happy, we make an interface :)
interface Response {
    expr: string;
    results: string;
    assign: boolean;
}

//another interface with which we will process the screen response
interface GeneratedResult {
    expression: string;
    answer: string;
}


export default function Home() {

    const canvasRef = useRef<HTMLCanvasElement>(null); 
    //useRef<HTMLCanvasElement>: Specifies the type of element this ref will point to, which is a <canvas> element in this case.
    //null: The initial value of the ref. It starts as null because the <canvas> element doesn't exist in the DOM yet when this
    //  line runs. After rendering, canvasRef.current will hold a reference to the <canvas> DOM element.
    const [isDrawing, sestIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255,255,255)');

    //for Clearing the entire screen
    const [reset, setReset] = useState(false);

    //for string generated result, we will have to make another state for generating the result variable,
    //It will use generatedresult state TYPE
    const [result, setResult] = useState<GeneratedResult>();

    //made another use state to store variable, like x=y, y=8 etc, it will be stored in the form of an object
    const [dictOfVars, setDictOfVars] = useState({});

    //made another usestate to store latex mathjax rendering
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);

    //setting usestate for the position where we can render the POSITION of latex
    const [latexPosition, setLatexPosition] = useState({x:10 , y:200});
    // We assign initial values for x and y inside useState for latexPosition to set the starting position of where the LaTeX content will be rendered on the screen. These values serve as the default coordinates when the component is first rendered.
    // Here’s why:
    // Default Positioning: By initializing x: 10 and y: 200, you're defining where the LaTeX element should appear by default on the screen.

    //for dragging
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<HTMLDivElement | null>(null);


    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const newX = e.clientX;
        const newY = e.clientY;

        setLatexPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    //runs everytime reset Changes
    useEffect(() => {
        if(reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        if (latexExpression.length>0 && window.MathJax){
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub])
            }, 0);
        }

        if(latexExpression.length>0){
            setTimeout(() => {

            },0)
        }
    },[latexExpression])

    useEffect(() => {
        if (result) { //we run an expression that will render our Latext To Canvas
            renderLatexToCanvas(result.expression, result.answer)
        }
    }, [result]);

    const renderLatexToCanvas = (expression: string, answer: string) => {
        //takes our latex and converts it into a large expression
        const latex = `{${expression} = ${answer}}`;


        //we'll use our spread operator here to process any assigned operator like x=17 , y = 8, etc. and save it in our setLatexExpression to the new value we just created/
        setLatexExpression([...latexExpression, latex]);

        const canvas = canvasRef.current;
        if(canvas) {
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.clearRect(0,0, canvas.width, canvas.height);
            }
        }



    };

    //friend data function to link canvas to the backend
    const sendData = async () => {
        const canvas = canvasRef.current;
    
        if (canvas) {
            try {
                // Convert the canvas to a Base64 image URL
                //const imageData = canvas.toDataURL('image/png');
    
                // Send a POST request using axios
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/calculate`, // Backend URL stored in VITE_API_URL
                    {
                        image: canvas.toDataURL('image/png'),
                        dict_of_vars: dictOfVars, // Replace `dictOfVars` with your actual variable
                    }
                );
    
                // Access response data
                const resp = await response.data;
                resp.data.forEach((data: Response) => {
                    setDictOfVars({
                        ...dictOfVars,
                        [data.expr]: data.results
                        
                    })
                })
                console.log('Response:', resp);

                const ctx = canvas.getContext('2d');
                const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
                let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    
                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        const i = (y * canvas.width + x) * 4;
                        if (imageData.data[i + 3] > 0) {  // If pixel is not transparent
                            minX = Math.min(minX, x);
                            minY = Math.min(minY, y);
                            maxX = Math.max(maxX, x);
                            maxY = Math.max(maxY, y);
                        }
                    }
                }
    
                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;
    
                setLatexPosition({ x: centerX, y: centerY });
                resp.data.forEach((data: Response) => {
                    setTimeout(() => {
                        setResult({
                            expression: data.expr,
                            answer: resp.data[0].result
                        });
                    }, 0);
                });
    
            } catch (error) {
                console.error('Error sending data:', error);
            }
        } else {
            console.warn('Canvas element is not available.');
        }
    };
    

    //function for functionality of CLEAR function
    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if(canvas) {
            const ctx = canvas.getContext('2d')
            if(ctx) {
                ctx.clearRect(0,0, canvas.width, canvas.height);

            }
        }
    };

    useEffect (() => { //useEffect hook when out website starts to initiziatlize the canvas elements

        const canvas = canvasRef.current;

        if(canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round' //for brush type
                ctx.lineWidth = 3; //forbruhs size
            }

        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] }
            });
        };
        

        return () => {
            document.head.removeChild(script);
        }

    }, []) // empty dependancy array so it doesn't run when some state changes, but just runs when program starts

    //to know when user exactly wants to draw we can make a mouseClickEvent, which takes mousclick as an EVENT on the canvas element
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            
            if  (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                sestIsDrawing (true);

            }
        }
        
    }

    const stopDrawing = () => {
        sestIsDrawing(false);
    }


    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if(!isDrawing) {
            return;
        }
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.strokeStyle = color;
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                ctx.stroke();
            }
        }
    }; 
    
    return (
        <>
            <div className="grid grid-cols-3 gap-2">
                <Button
                    onClick={() => setReset(true)}
                    className="z-20 bg-black text-white"
                    variant="default"
                    color="black"
                >
                    Reset
                </Button>
                <Group className="z-20">
                    {SWATCHES.map((swatchColor: string) => (
                        <ColorSwatch
                            key={swatchColor}
                            color={swatchColor}
                            onClick={() => setColor(swatchColor)}
                        ></ColorSwatch>
                    ))}
                </Group>
                <Button
                    onClick={sendData}
                    className="z-20 bg-black text-white"
                    variant="default"
                    color="black"
                >
                    Calculate
                </Button>
            </div>
            <canvas
                ref={canvasRef}
                id="canvas"
                className="absolute top-0 left-0 w-full h-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseOut={stopDrawing}
                onMouseUp={stopDrawing}
            />
            {latexExpression &&
                latexExpression.map((latex, index) => (
                    <div
                        key={index}
                        ref={dragRef}
                        className="absolute p-2 text-white rounded shadow-md"
                        style={{
                            left: `${latexPosition.x}px`,
                            top: `${latexPosition.y}px`,
                            cursor: 'move',
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    >
                        <div className="latex-content">{latex}</div>
                    </div>
                ))}
        </>

    );

}

