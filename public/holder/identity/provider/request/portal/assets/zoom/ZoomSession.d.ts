import { ZoomSessionResult, ZoomFaceMapProcessor, ZoomIDScanProcessor, ZoomIDScanResult } from "./ZoomPublicApi";
/**
 * Zoom IDScan callback function
 */
export interface ZoomIDScanCompleteFunction {
    (zoomIDScanResult?: ZoomIDScanResult): void;
}
/**
 * Zoom Session Complete Function
 */
export interface ZoomSessionCompleteFunction {
    (zoomSessionResult?: ZoomSessionResult): void;
}
/**
 * ZoomSession class
 */
export declare class ZoomSession {
    onZoomSessionCaptureComplete: ZoomSessionCompleteFunction;
    start: () => void;
    constructor(onZoomSessionCompleteFunction: ZoomSessionCompleteFunction, zoomFaceMapProcessorFunction: ZoomFaceMapProcessor, zoomIDScanProcessorFunction: ZoomIDScanProcessor, sessionToken: string);
    constructor(onZoomSessionCompleteFunction: ZoomSessionCompleteFunction, zoomFaceMapProcessorFunction: ZoomFaceMapProcessor, zoomIDScanProcessorFunction: ZoomIDScanProcessor);
    constructor(onZoomSessionCompleteFunction: ZoomSessionCompleteFunction, zoomFaceMapProcessorFunction: ZoomFaceMapProcessor, sessionToken: string);
    constructor(onZoomSessionCompleteFunction: ZoomSessionCompleteFunction, zoomFaceMapProcessorFunction: ZoomFaceMapProcessor);
}
export declare class ZoomSessionFromIFrame extends ZoomSession {
    constructor(onZoomSessionCompleteFunction: ZoomSessionCompleteFunction, zoomFaceMapProcessorFunction: ZoomFaceMapProcessor, zoomIDScanProcessorFunction: ZoomIDScanProcessor, sessionToken: string);
    constructor(onZoomSessionCompleteFunction: ZoomSessionCompleteFunction, zoomFaceMapProcessorFunction: ZoomFaceMapProcessor, zoomIDScanProcessorFunction: ZoomIDScanProcessor);
    constructor(onZoomSessionCompleteFunction: ZoomSessionCompleteFunction, zoomFaceMapProcessorFunction: ZoomFaceMapProcessor, sessionToken: string);
    constructor(onZoomSessionCompleteFunction: ZoomSessionCompleteFunction, zoomFaceMapProcessorFunction: ZoomFaceMapProcessor);
}
