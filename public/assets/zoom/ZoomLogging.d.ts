/**
 * Enum to allow developers to control ZoOm Logging behaviour through the API ZoomSDK.ZoomLoggingMode
*/
export declare enum ZoomLoggingMode {
    /**
    *   Log all important messages to the console.
    */
    Default = 0,
    /**
    *   Remove all logging except for when developing on Localhost
    */
    LocalhostOnly = 1
}
/**
 * This internal class will be deprecated and removed in a future release
*/
/**
  *   Wrapper  for all Console Logging in ZoomModule
  *   Purpose: disable logging in production environments
  *   Usage:   replace "console.log" with "ZoomLogging.ZoomConsole.log"
*/
declare class ZoomConsoleLogger {
    ZoomLoggingState: ZoomLoggingMode;
    log: Function;
    warn: Function;
    error: Function;
    trace: Function;
    constructor();
    setZoomLoggingState(enumVal: ZoomLoggingMode): void;
}
export declare var ZoomLogging: {
    setZoomLoggingMode: (enumValue: ZoomLoggingMode) => void;
    ZoomConsole: ZoomConsoleLogger;
};
export {};
