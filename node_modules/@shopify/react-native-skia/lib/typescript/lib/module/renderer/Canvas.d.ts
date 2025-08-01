export function useCanvasRef(): React.RefObject<null>;
export function Canvas({ debug, opaque, children, onSize, onLayout: _onLayout, ref, ...viewProps }: {
    [x: string]: any;
    debug: any;
    opaque: any;
    children: any;
    onSize: any;
    onLayout: any;
    ref: any;
}): React.CElement<object, React.Component<object, {}, any> & import("react-native").NativeMethods>;
import React from "react";
