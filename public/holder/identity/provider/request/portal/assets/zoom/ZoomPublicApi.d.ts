/** Represents the options available for retrying part or all of the ID Scan process */
export declare enum ZoomIDScanRetryMode {
    Front = 0,
    Back = 1,
    FrontAndBack = 2
}
/**
 * Describes the next step to go into during the Photo ID Match process.
 * By default, when ZoomFaceMapResultCallback.succeed() is called, the User is taken to the ID Document Type Selection Screen.
 * Passing different values of ZoomIDScanNextStep as a parameter for ZoomFaceMapResultCallback.succeed() allows you to control whether you want to skip directly to either the ID Card (with Front and Back) capture process, or the Passport capture process, or to skip the ID Scan process altogether.
 * You may want to skip directly to a specific type of ID Scan if you know that your Users are only using one particular type of ID.
 * You may want to skip the ID Scan process altogether if you have custom server-side logic that in some cases deems the Photo ID Match flow as not necessary.
 */
export declare enum ZoomIDScanNextStep {
    /**
     * Start ID Scan process with showing the Selection Screen, allowing the user to select their ID document type.
     * This is default behavior.
     */
    SelectionScreen = 0,
    /**
     * Start ID Scan process with the Capture Screen, pre-configured for an ID card document-type, skipping the Selection Screen.
     */
    SelectIDCard = 1,
    /**
     * Start ID Scan process with the Capture Screen, pre-configured for a passport document-type, skipping the Selection Screen.
     */
    SelectPassport = 2,
    /**
     * Skip the entire ID Scan process, exiting from the ZoOm SDK interface after a successful ZoOm Session.
     */
    Skip = 3
}
/** Callback functions for ZoomIDScanProcessor */
export declare class ZoomIDScanResultCallback {
    succeed: () => void;
    retry: (zoomIDScanRetryMode: ZoomIDScanRetryMode, unsuccessMessage?: string) => void;
    cancel: () => void;
    uploadProgress: (uploadedPercent: number) => void;
}
/** Abstract class for developer to override for processing ZoOm ID Scans. */
export declare abstract class ZoomIDScanProcessor {
    abstract processZoomIDScanResultWhileZoomWaits: (zoomIDScanResult: ZoomIDScanResult, zoomIDCheckResultCallback: ZoomIDScanResultCallback) => void;
}
/** Callback functions for ZoomFaceMapProcessor */
export declare class ZoomFaceMapResultCallback {
    succeed: (idScanNextStep?: ZoomIDScanNextStep) => void;
    retry: () => void;
    cancel: () => void;
    uploadProgress: (uploadedPercent: number) => void;
}
/** Abstract class for developer to override for processing ZoOm sessions. */
export declare abstract class ZoomFaceMapProcessor {
    abstract processZoomSessionResultWhileZoomWaits: (zoomSessionResult: ZoomSessionResult, zoomFaceMapResultCallback: ZoomFaceMapResultCallback) => void;
}
/** ZoomFaceBiometrics returned as part of ZoomSessionResult */
export declare class ZoomFaceBiometrics {
    /**
     * @deprecated This functionality is being deprecated and will not exist in a future major release of ZoOm.
     * Developers should instead use the getAuditTrailCompressedBase64 function. There are multiple advantages of using this new function.
     * getAuditTrailCompressedBase64 provides a consistent API across all supported ZoOm platforms to  get a compressed set of images
     * that will not overly load user bandwidth and also provides images that are usable in the Audit Trail Verification API.
     * Returns the Audit Trail Images.
     */
    auditTrail: string[];
    /**
     * @deprecated This API will be removed in an upcoming version of the ZoOm SDK. Please use getAuditTrailCompressedBase64 instead.
     * Returns the Audit Trail Images as an array of base64 encoded JPG images.
     * This should be considered the new default method of getting the Audit Trail Images.
     * There are multiple advantages of using this new function.
     * getAuditTrailBase64JPG provides a consistent API across all supported ZoOm platforms to  get a compressed set of images
     * that will not overly load user bandwidth and also provides images that are usable in the Audit Trail Verification API.
     */
    getAuditTrailBase64JPG: () => string[];
    /**
     * Returns the Audit Trail Images as an array of base64 encoded JPG images.
     * This should be considered the new default method of getting the Audit Trail Images.
     * There are multiple advantages of using this new function.
     * getAuditTrailBase64JPG provides a consistent API across all supported ZoOm platforms to  get a compressed set of images
     * that will not overly load user bandwidth and also provides images that are usable in the Audit Trail Verification API.
     */
    getAuditTrailCompressedBase64: () => string[];
    /**
     * @deprecated This API will be removed in an upcoming version of the ZoOm SDK. Please use getLowQualityAuditTrailCompressedBase64 instead.
     * The Low Quality Audit Trail is a collection of images from the session that are likely partly responsible for the session not succeeding.
     * The Low Quality Audit Trail finds images that can be displayed to the user that will be intuitively indicative of the reason for the session
     * not completing successfully.
     */
    lowQualityAuditTrailCompressedBase64: () => string[];
    /**
   * The Low Quality Audit Trail is a collection of images from the session that are likely partly responsible for the session not succeeding.
   * The Low Quality Audit Trail finds images that can be displayed to the user that will be intuitively indicative of the reason for the session
   * not completing successfully.
   */
    getLowQualityAuditTrailCompressedBase64: () => string[];
    /**
     * @deprecated The ZoomFaceMapProcessor gives developers access to Audit Trail Images for each session and thus this function is not needed anymore and will be removed in an upcoming version of the ZoOm SDK.
     */
    timeBasedSessionImages: (string | null)[];
    faceMap: Blob | null;
    getFaceMapBase64: (callback: (faceMapBase64: string | null) => void) => void;
    constructor();
}
/** Result returned in callback function passed to ZoomSession */
export interface ZoomSessionResult {
    faceMetrics: ZoomFaceBiometrics;
    sessionId: string | null;
    status: ZoomSessionStatus;
    countOfZoomSessionsPerformed: number;
    [key: string]: string | ZoomSessionStatus | ZoomFaceBiometrics | null | {};
}
/** ZoOm ID Scan result status enum */
export declare enum ZoomIDScanStatus {
    /**
    The ID Scan was successful.
   */
    ZoomIDScanStatusSuccess = 0,
    /**
     The ID Scan was not successful
    */
    ZoomIDScanStatusUnsuccess = 1,
    /**
     User cancelled ID Scan
    */
    ZoomIDScanStatusUserCancelled = 2,
    /**
     Timeout during ID Scan
    */
    ZoomIDScanStatusTimedOut = 3,
    /**
     Context Switch during ID Scan
    */
    ZoomIDScanStatusContextSwitch = 4,
    /**
     Error setting up the ID Scan Camera
    */
    CameraError = 5,
    /**
     Camera Permissions were not enabled
    */
    CameraNotEnabled = 6,
    /**
     ID Scan was skipped.
    */
    Skipped = 7
}
/** Type of ID Scan selected by user */
export declare enum ZoomIDType {
    /**
     ID card type
    */
    ZoomIDTypeIDCard = 0,
    /**
     Passport type
    */
    ZoomIDTypePassport = 1,
    /**
     ID type was not selected
    */
    ZoomIDTypeNotSelected = 2
}
/** IDScan metrics return as part of ZoomIDScanResult */
export declare class IdScanMetrics {
    /**
     * @deprecated This API will be removed in an upcoming version of the ZoOm SDK. Please use getFrontImagesCompressedBase64 instead.
     * High resolution samples of the front images of the Photo ID that can be used for Auditing and Identity Verification
    */
    frontImages: string[];
    /**
      High resolution samples of the front images of the Photo ID that can be used for Auditing and Identity Verification
    */
    getFrontImagesCompressedBase64: () => string[];
    /**
     * @deprecated This API will be removed in an upcoming version of the ZoOm SDK. Please use getBackImagesCompressedBase64 instead.
     * High resolution samples of the back images of the Photo ID that can be used for Auditing and Identity Verification
    */
    backImages: string[];
    /**
      High resolution samples of the back images of the Photo ID that can be used for Auditing and Identity Verification
    */
    getBackImagesCompressedBase64: () => string[];
    idScan: any;
    getIDScanBase64: (callback: (iDScanBase64: string | null) => void) => void;
    constructor();
}
/** ID Scan Result object */
export declare class ZoomIDScanResult {
    status: ZoomIDScanStatus;
    idType: ZoomIDType;
    idScanMetrics: IdScanMetrics;
    sessionId: string | null;
    constructor(idTYpe: ZoomIDType);
}
/** Represents the various end states of a ZoOm Session */
export declare enum ZoomSessionStatus {
    /**
     * The ZoOm Session was performed successfully and a FaceMap was generated.  Pass the FaceMap to ZoOm Server for further processing.
     */
    SessionCompletedSuccessfully = 0,
    /**
     * The ZoOm Session was cancelled because not all guidance images were configured.
     */
    MissingGuidanceImages = 1,
    /**
     * The ZoOm Session was cancelled because your App is not in production and requires a network connection.
     */
    NonProductionModeNetworkRequired = 2,
    /**
     * The ZoOm Session was cancelled because the user was unable to complete a ZoOm Session in the default allotted time or the timeout set by the developer.
     */
    Timeout = 3,
    /**
     * The ZoOm Session was cancelled due to the app being terminated, put to sleep, an OS notification, or the app was placed in the background.
     */
    ContextSwitch = 4,
    /**
     * The ZoOm Session was cancelled because the user was unable to place their face in the UnZoOmed, far away oval in the default allotted time or the timeout set by the developer.
     */
    TooMuchTimeToDetectFirstFace = 5,
    /**
     * The ZoOm Session was cancelled because the user was unable to place their face in the ZoOmed, close oval in the default allotted time or the timeout set by the developer.
     */
    TooMuchTimeToDetectFirstFaceInPhaseTwo = 6,
    /**
     * The developer programmatically called the ZoOm Session cancel API.
     */
    ProgrammaticallyCancelled = 7,
    /**
     * The ZoOm Session was cancelled due to a device orientation change during the ZoOm Session.
     */
    OrientationChangeDuringSession = 8,
    /**
     * The ZoOm Session was cancelled because device is in landscape mode.
     * The user experience of devices in these orientations is poor and thus portrait is required.
     */
    LandscapeModeNotAllowed = 9,
    /**
     * The user pressed the cancel button and did not complete the ZoOm Session.
     */
    UserCancelled = 10,
    /**
     * The user pressed the cancel button during New User Guidance.
     */
    UserCancelledFromNewUserGuidance = 11,
    /**
     * The user pressed the cancel button during Retry Guidance.
     */
    UserCancelledFromRetryGuidance = 12,
    /**
     * The user cancelled out of the ZoOm experience while attempting to get camera permissions.
     */
    UserCancelledWhenAttemptingToGetCameraPermissions = 13,
    /**
     * The ZoOm Session was cancelled because the user was in a locked out state.
     */
    LockedOut = 14,
    /**
     * The ZoOm Session was cancelled because there was no camera available.
     */
    CameraDoesNotExist = 15,
    /**
     * The ZoOm Session was cancelled because camera was not enabled.
     */
    CameraNotEnabled = 16,
    /**
     * This status will never be returned in a properly configured or production app.
     * This status is returned if your license is invalid or network connectivity issues occur during a session when the application is not in production.
     */
    NonProductionModeLicenseInvalid = 17,
    /**
     * The ZoOm Session was cancelled because preload was not completed or an issue was encountered preloading ZoOm.
     */
    PreloadNotCompleted = 18,
    /**
     * The ZoOm Session was cancelled because video initialization encountered an issue.
     * This status is only returned for Unmanaged Sessions.
     */
    UnmanagedSessionVideoInitializationNotCompleted = 19,
    /**
     * The ZoOm Session was cancelled because one of the elements passed to ZoOm does not exist on the DOM.
     * This status is only returned for Unmanaged Sessions.
     */
    ZoomVideoOrInterfaceDOMElementDoesNotExist = 20,
    /**
     * The ZoOm Session was cancelled because ZoOm cannot be rendered when the document is not ready.
     */
    DocumentNotReady = 21,
    /**
     * The ZoOm Session was cancelled because the video height/width was 0. The camera or video may not be initialized.
     * This status is only returned for Unmanaged Sessions.
     */
    VideoHeightOrWidthZeroOrUninitialized = 22,
    /**
     * The ZoOm Session was cancelled because there was another ZoOm Session in progress.
     */
    ZoomSessionInProgress = 23,
    /**
     * The ZoOm Session was cancelled because the video element is not active.
     * This status is only returned for Unmanaged Sessions.
     */
    VideoCaptureStreamNotActive = 24,
    /**
     * The ZoOm Session was cancelled because the selected camera is not active.
     * This status is only returned for Unmanaged Sessions.
     */
    CameraNotRunning = 25,
    /**
     * The ZoOm Session was cancelled because ZoOm initialization has not been completed yet.
     */
    InitializationNotCompleted = 26,
    /**
     * The ZoOm Session was cancelled because of an unknown and unexpected error.  ZoOm leverages a variety of platform APIs including camera, storage, security, networking, and more.
     * This return value is a catch-all for errors experienced during normal usage of these APIs.
     */
    UnknownInternalError = 27,
    /**
     * The ZoOm Session cancelled because user pressed the Get Ready screen subtext message.
     * Note: This functionality is not available by default, and must be requested from FaceTec in order to enable.
     */
    UserCancelledViaClickableReadyScreenSubtext = 28,
    /**
    * The ZoOm Session was cancelled, ZoOm was opened in an Iframe without an Iframe constructor.
    */
    NotAllowedUseIframeConstructor = 29,
    /**
    * The ZoOm Session was cancelled, ZoOm was not opened in an Iframe with an Iframe constructor.
    */
    NotAllowedUseNonIframeConstructor = 30,
    /**
    * The ZoOm Session was cancelled, ZoOm was not opened in an Iframe without permission.
    */
    IFrameNotAllowedWithoutPermission = 31
}
/** Represents the status of the SDK */
export declare enum ZoomSDKStatus {
    /**
     * Initialize was never attempted.
     */
    NeverInitialized = 0,
    /**
     * The License provided was verified.
     */
    Initialized = 1,
    /**
     * The Device License Key Identifier could not be verified due to connectivity issues on the user's device.
     */
    NetworkIssues = 2,
    /**
     * The Device License Key Identifier provided was invalid.
     */
    InvalidDeviceLicenseKeyIdentifier = 3,
    /**
     * This version of ZoOm SDK is deprecated.
     */
    VersionDeprecated = 4,
    /**
     *  This device/platform/browser/version combination is not supported by ZoOm.
     */
    DeviceNotSupported = 5,
    /**
     *  Device is in landscape display orientation. ZoOm can only be used in portrait display orientation.
     */
    DeviceInLandscapeMode = 6,
    /**
     *  Device is in reverse portrait mode. ZoOm can only be used in portrait display orientation.
     */
    DeviceLockedOut = 7,
    /**
      * License was expired, contained invalid text, or you are attempting to initialize on a domain that is not specified in your license.
      */
    LicenseExpiredOrInvalid = 8,
    /**
    * The ZoOm Session was cancelled, ZoOm was not opened in an IFrame without permission.
    */
    IFrameNotAllowedWithoutPermission = 9
}
/** Represents the results of preloading ZoOm resources. */
export declare enum ZoomPreloadResult {
    /**
     * ZoOm preloaded successfully.
     */
    Success = 0,
    /**
     * ZoOm encountered an error preloading resources.
     */
    Error = 1
}
