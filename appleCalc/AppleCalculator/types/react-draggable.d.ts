declare module 'react-draggable' {
    import * as React from 'react';

    interface DraggableProps {
        defaultPosition?: { x: number; y: number };
        onStop?: (e: MouseEvent, data: { x: number; y: number }) => void;
        // Add other props you use here...
    }

    const Draggable: React.FC<DraggableProps>;
    export default Draggable;
}