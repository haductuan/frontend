import { KnownIncompatibleBrowsers } from "./ZoomIncompatibleBrowsers";
interface ZoomInfo {
    DetectRTC: {
        isGetUserMediaSupported: boolean;
        isWebWasmSupported: boolean;
        isWebWorkerSupported: boolean;
    };
    displayResolution: string;
    displayAspectRatio: string;
    isMobileDevice: boolean;
    isMobileDeviceUA: boolean;
    isIosAndNotSafari: boolean;
    isIpad: boolean;
    supported: boolean;
    status: string;
    browser: {
        name: string;
        osName: string;
        version: string;
        isChrome: boolean;
        isFirefox: boolean;
        isSafari: boolean;
        isEdge: boolean;
        isOpera: boolean;
        isIE: boolean;
    };
    deficientSystem: boolean;
    knownIncompatibleBrowser: KnownIncompatibleBrowsers;
}
/**
 * ZoOm Browser SDK detected incompatibility status
*/
export declare enum ZoomCompatibilityStatus {
    NoDeficienciesFound = 0,
    WasmNotSupported = 1,
    WorkersNotSupported = 2,
    BrowserNotSupported = 3,
    GetUserMediaNotSupported = 4,
    InvalidBrowserOniOS = 5,
    GetUserMediaRemoteHTTPNotSupported = 6
}
/**
 * ZoOm Browser SDK detected browser information.
*/
export declare var ZoomInfo: {
    /**
      * Browser support data such as Browser name, Browser version, OS Name
    */
    browserSupport: ZoomInfo;
    getSystemData: (callback: (dta: any) => void) => void;
    /**
      * Detected support for webWorkers, wasm, and getUserMedia
    */
    DetectRTC: {
        isGetUserMediaSupported: boolean;
        isWebWasmSupported: boolean;
        isWebWorkerSupported: boolean;
    };
    /**
      * Detected status of browser support for DetectRTC properties
    */
    zoomCompatibilityStatus: ZoomCompatibilityStatus;
    /**
      *  ZoOm Browser SDK Browser incompatibility enum
    */
    ZoomCompatibilityStatus: typeof ZoomCompatibilityStatus;
    /**
      *  Boolean indicating browser support for ZoOm
    */
    deficientSystem: boolean;
};
export {};
