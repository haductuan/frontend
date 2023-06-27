export declare enum ZoomExitAnimationStyle {
    None = 0,
    RippleOut = 1,
    FadeOutMin = 2
}
export declare enum ZoomCancelButtonLocation {
    Disabled = 0,
    TopLeft = 1,
    TopRight = 2,
    Custom = 3
}
export declare enum ZoomCameraPermissionsLaunchAction {
    Cancel = 0,
    LaunchURL = 1
}
export declare class ZoomRect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor();
    create(x: number, y: number, width: number, height: number): this;
}
export interface FeedbackCustomization {
    shadow: string;
    backgroundColor: string;
    cornerRadius: string;
    textFont: string;
    textSpacing: string;
    textSize: string;
    textColor: string;
    enablePulsatingText: boolean;
    relativeWidth: string;
}
export interface InitialLoadingAnimationCustomization {
    element: HTMLElement;
    backgroundColor: string;
    foregroundColor: string;
    messageTextColor: string;
    messageFont: string;
    messageTextSpacing: string;
    messageTextSize: string;
}
export interface FrameCustomization {
    shadow: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
    borderCornerRadius: string;
}
export interface CancelButtonCustomization {
    customImage: string;
    location: ZoomCancelButtonLocation;
    customLocation: ZoomRect;
    setCustomLocation: (x: number, y: number, width: number, height: number) => void;
}
export interface ExitAnimationCustomization {
    exitAnimationSuccess: number;
    exitAnimationUnsuccess: number;
}
export interface SessionTimerCustomization {
    maxTimeOverall: number;
    maxTimeToDetectFirstFace: number;
    maxTimeToDetectFirstFaceInPhaseTwo: number;
}
export interface GuidanceImageCustomization {
    idealZoomImage: string;
    cameraPermissionsScreenImage: string;
}
export interface GuidanceCustomization {
    buttonFont: string;
    buttonTextSpacing: string;
    buttonTextSize: string;
    buttonBorderWidth: string;
    buttonBorderColor: string;
    buttonCornerRadius: string;
    buttonTextNormalColor: string;
    buttonTextHighlightColor: string;
    buttonTextDisabledColor: string;
    buttonBackgroundNormalColor: string;
    buttonBackgroundHighlightColor: string;
    buttonBackgroundDisabledColor: string;
    buttonRelativeWidth: string;
    buttonRelativeWidthOnDesktop: string;
    imageCustomization: ZoomGuidanceImageCustomization;
    headerFont: string;
    headerTextSpacing: string;
    headerTextSize: string;
    subtextFont: string;
    subtextTextSpacing: string;
    subtextTextSize: string;
    readyScreenHeaderFont: string;
    readyScreenHeaderTextSpacing: string;
    readyScreenHeaderTextColor: string;
    readyScreenHeaderTextSize: string;
    readyScreenHeaderAttributedString: string;
    readyScreenSubtextFont: string;
    readyScreenSubtextTextSpacing: string;
    readyScreenSubtextTextColor: string;
    readyScreenSubtextTextSize: string;
    readyScreenSubtextAttributedString: string;
    retryScreenHeaderFont: string;
    retryScreenHeaderTextSpacing: string;
    retryScreenHeaderTextColor: string;
    retryScreenHeaderTextSize: string;
    retryScreenHeaderAttributedString: string;
    retryScreenSubtextFont: string;
    retryScreenSubtextTextSpacing: string;
    retryScreenSubtextTextColor: string;
    retryScreenSubtextTextSize: string;
    retryScreenSubtextAttributedString: string;
    backgroundColors: string;
    foregroundColor: string;
    readyScreenOvalFillColor: string;
    readyScreenTextBackgroundColor: string;
    readyScreenTextBackgroundCornerRadius: string;
    retryScreenIdealZoomImage: string;
    retryScreenSlideshowImages: string[];
    retryScreenSlideshowInterval: string;
    enableRetryScreenSlideshowShuffle: boolean;
    retryScreenImageBorderColor: string;
    retryScreenImageBorderWidth: string;
    retryScreenImageCornerRadius: string;
    retryScreenOvalStrokeColor: string;
    enableRetryScreenBulletedInstructions: boolean;
    cameraPermissionsScreenImage: string;
    cameraPermissionsScreenLaunchAction: ZoomCameraPermissionsLaunchAction;
}
export interface EnterFullScreenCustomization {
    buttonFont: string;
    buttonTextSpacing: string;
    buttonBorderWidth: string;
    buttonBorderColor: string;
    buttonCornerRadius: string;
    buttonTextNormalColor: string;
    buttonTextHighlightColor: string;
    buttonTextDisabledColor: string;
    buttonBackgroundNormalColor: string;
    buttonBackgroundHighlightColor: string;
    buttonBackgroundDisabledColor: string;
    buttonRelativeWidth: string;
    buttonRelativeWidthOnDesktop: string;
    headerFont: string;
    headerTextSpacing: string;
    subtextFont: string;
    subtextTextSpacing: string;
    backgroundColors: string;
    foregroundColor: string;
    enterFullScreenImage: string;
}
export interface OverlayCustomization {
    backgroundColor: string;
    foregroundColor: string;
    blurEffectStyle: string;
    showBrandingImage: boolean;
    brandingImage: string;
}
export interface ResultScreenCustomization {
    backgroundColors: string;
    foregroundColor: string;
    resultAnimationBackgroundColor: string;
    resultAnimationForegroundColor: string;
    resultAnimationSuccessBackgroundImage: string;
    resultAnimationUnsuccessBackgroundImage: string;
    messageFont: string;
    messageTextSpacing: string;
    messageTextSize: string;
    activityIndicatorColor: string;
    customActivityIndicatorImage: string;
    customActivityIndicatorRotationInterval: string;
    showUploadProgressBar: boolean;
    uploadProgressFillColor: string;
    uploadProgressTrackColor: string;
}
/**
 * Class used to customize the look and feel of the ZoOm Interface.
 * ZoOm ships with a default ZoOm theme but has a variety of variables that you can use to configure ZoOm to your application's needs.
 * To customize the ZoOm Interface, simply create an instance of ZoomCustomization and set some, or all, of the variables.
 */
export declare class ZoomCustomization {
    /** Customize the ZoOm Oval and the ZoOm Progress Spinner animations. */
    ovalCustomization: ZoomOvalCustomization;
    /**  Customize the ZoOm Feedback Bar. */
    feedbackCustomization: ZoomFeedbackBarCustomization;
    /** Customize the ZoOm Frame. */
    frameCustomization: ZoomFrameCustomization;
    /** Customize the ZoOm Frame exit animation. */
    exitAnimationCustomization: ZoomExitAnimationCustomization;
    /** Customize the ZoOm Cancel Button. */
    cancelButtonCustomization: ZoomCancelButtonCustomization;
    /** Customize the time after which the ZoOm Session should timeout. */
    sessionTimerCustomization: ZoomSessionTimerCustomization;
    /** Customize the loading spinner and the text shown to the user while the camera loads. */
    initialLoadingAnimationCustomization: ZoomInitialLoadingAnimationCustomization;
    /** Customize the New User Guidance and Retry Screens. */
    guidanceCustomization: ZoomGuidanceCustomization;
    /** Customize the ZoOm Overlay, separating the ZoOm Interface from the presenting application context. */
    overlayCustomization: ZoomOverlayCustomization;
    /** Customize the Result Screen. */
    resultScreenCustomization: ZoomResultScreenCustomization;
    /** Customize the ZoOm Identity Check Screens. */
    idScanCustomization: ZoomIDScanCustomization;
    enterFullScreenCustomization: ZoomEnterFullScreenCustomization;
    /** Allow low-light mode, which changes the ZoOm Oval colors to a 'white-theme' when a low-light environment is detected. */
    /**
    * @removed in version 8.2
    */
    enableLowLightMode: boolean;
    /** Allow ZoOm to cancel due to context switch when unauthorized key strokes are detected while ZoOm is active. For accessibility, essential navigation hotkeys will not trigger cancellation. */
    enableHotKeyProtection: boolean;
    /** Show Side By Side Retry screen. */
    /**
    * @removed in version 8.2
    */
    showRetrySideBySide: boolean;
    /** Show Get Ready To Zoom Screen. */
    /**
    * @removed in version 8.2
    */
    showGetReadyToZoomOval: boolean;
    /** Show Camera Permissions Denied Screen. */
    enableCameraPermissionsHelpScreen: boolean;
    /** Force screen background color(s) to be drawn as opaque. */
    /**
    * @removed in version 8.2
    */
    shouldDrawBackgroundsOpaque: boolean;
    /** Force the oval stroke to be drawn as opaque. */
    shouldDrawOvalStrokeOpaque: boolean;
    /** Control whether to enable clickable Ready Screen subtext region, cancelling from the session and returning ZoomSessionStatus.UserCancelledViaClickableReadyScreenSubtext. */
    enableClickableReadyScreenSubtext: boolean;
    /**
     * This function allows special runtime control of the success message shown when the success animation occurs.
     * Please note that you can also customize this string via the standard customization/localization methods provided by ZoOm.
     * Special runtime access is enabled to this text because the developer may wish to change this text depending on ZoOm's mode of operation.
     * Default is in the customizable localization string "zoom_result_success_message"
     */
    static setOverrideResultScreenSuccessMessage: (message: string) => void;
    /**
     * Constructor for ZoomCustomization object.
     *
     * @param keyValuePairs - ZoOm Feature Flag key-value pairs for restricted customization access.
     */
    constructor(keyValuePairs?: {
        key: string;
    }[] | any[]);
    [key: string]: {
        key: string;
    }[] | boolean | ZoomEnterFullScreenCustomization | ZoomIDScanCustomization | ZoomOvalCustomization | ZoomFeedbackBarCustomization | ZoomFrameCustomization | ZoomExitAnimationCustomization | ZoomCancelButtonCustomization | ZoomSessionTimerCustomization | ZoomGuidanceImageCustomization | ZoomInitialLoadingAnimationCustomization | ZoomGuidanceCustomization | ZoomOverlayCustomization | ZoomResultScreenCustomization | string;
}
/**
 * Customize the time after which the ZoOm Session should timeout.
 */
export declare class ZoomSessionTimerCustomization implements SessionTimerCustomization {
    maxTimeOverall: number;
    maxTimeToDetectFirstFace: number;
    maxTimeToDetectFirstFaceInPhaseTwo: number;
    maxTimeBeforeCameraPermissionsError: number;
    /** Constructor for ZoomSessionTimerCustomization object. */
    constructor();
}
/**
 * Customize the ZoOm Frame exit animation.
 */
export declare class ZoomExitAnimationCustomization implements ExitAnimationCustomization {
    /** Customize the transition out animation for a successful ZoOm Session. */
    exitAnimationSuccess: ZoomExitAnimationStyle;
    /** Customize the transition out animation for an unsuccessful ZoOm Session. */
    exitAnimationUnsuccess: ZoomExitAnimationStyle;
    /** Constructor for ZoomExitAnimationCustomization object. */
    constructor();
}
/**
 * Customize the ZoOm Oval and the ZoOm Progress Spinner animations.
 */
export declare class ZoomOvalCustomization {
    /**
    * Color of the ZoOm Oval outline.
    * Default is white.
    */
    strokeColor: string;
    /**
     * Color of the animated ZoOm Progress Spinner strokes.
     * Default is custom ZoOm color.
     */
    progressColor1: string;
    progressColor2: string;
    /**
     * Thickness of the animated ZoOm Progress Spinner strokes.
     * Default is dynamically configured per device at runtime.
     */
    progressStrokeWidth: number;
    /**
     * Thickness of the ZoOm Oval outline.
     * Default is dynamically configured per device at runtime.
     */
    strokeWidth: number;
    /** Constructor for ZoomOvalCustomization object. */
    constructor();
}
/**
 * Customize the ZoOm Frame.
 * .blurEffectStyle will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .sizeRatio and .topMargin are not available in the SDK because they are frequently misconfigured by developers.
 */
export declare class ZoomFrameCustomization implements FrameCustomization {
    /**
     * Shadow displayed behind the ZoOm Frame.
     * This accepts box-shadow css attribute string values.
     * Default is none.
     */
    shadow: string;
    /**
     * Color of the ZoOm Frame's border.
     * Default is white.
     */
    borderColor: string;
    /**
     * Corner radius of the ZoOm Frame.
     * Default is dynamically configured per device at runtime.
     */
    borderCornerRadius: string;
    /**
     * Thickness of the ZoOm Frame's border.
     * Default is dynamically configured per device at runtime.
     */
    borderWidth: string;
    /**
     * Color of the background surrounding the oval outline during ZoOm.
     * Default is custom ZoOm color.
     */
    backgroundColor: string;
    /**
     * Applies a blur effect over the background surrounding the oval outline during ZoOm.
     * Default is off.
     */
    blurEffectStyle: string;
    /** Constructor for ZoomFrameCustomization object. */
    constructor();
}
/**
 * Customize the ZoOm Cancel Button.
 * Shown during ZoOm, New User Guidance, Retry, and Identity Check Screens.
 */
export declare class ZoomCancelButtonCustomization implements CancelButtonCustomization {
    /**
     * Location, or use, of the ZoOm Cancel Button.
     * Default is ZoomCancelButtonLocation.TopLeft.
     */
    location: ZoomCancelButtonLocation;
    /**
     * The size and location of the cancel button within the current screen's bounds.
     * Configure using the convenience method .setCustomLocation(x:number, y:number, width:number, height:number).
     * Note: In order to use a custom-located cancel button, you MUST set .location to the enum value ZoomCancelButtonLocation.Custom.
     * Default is set at origin 0,0 with a size of 0 by 0.
     */
    customLocation: ZoomRect;
    /**
     * Image displayed on the ZoOm Cancel Button.
     * Default is configured to use image named 'zoom_cancel' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    customImage: string;
    /** Constructor for ZoomCancelButtonCustomization object. */
    constructor();
    /**
     * Set the size and location of the cancel button within the current screen's bounds.
     * Note: In order to use a custom-located cancel button, you MUST set .location to the enum value ZoomCancelButtonLocation.Custom.
     */
    setCustomLocation(x: number, y: number, width: number, height: number): void;
}
/**
 * Customize the ZoOm Feedback Bar.
 * .topMargin is not available in the SDK because they are frequently misconfigured by developers.
 */
export declare class ZoomFeedbackBarCustomization implements FeedbackCustomization {
    /**
     * Color of the ZoOm Feedback Bar's background. Recommend making this have some transparency.
     * Default is custom ZoOm color.
     */
    backgroundColor: string;
    /**
     * Color of the text displayed within the ZoOm Feedback Bar.
     * Default is white.
     */
    textColor: string;
    /**
     * Font of the text displayed within the ZoOm Feedback Bar.
     * Accepts any value assignable to the fontFamily CSS attribute.
     */
    textFont: string;
    /**
     * Spacing between the characters of the text displayed within the ZoOm Feedback Bar.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    textSpacing: string;
    /**
     * Size of the text displayed within the ZoOm Feedback Bar.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Default is dynamically configured per device at runtime.
     */
    textSize: string;
    /**
     * Corner radius of the ZoOm Feedback Bar.
     * Default is dynamically configured per device at runtime.
     */
    cornerRadius: string;
    /**
     * Shadow displayed behind the ZoOm Feedback Bar.
     * This accepts box-shadow css attribute string values.
     * Default is a custom sized black shadow.
     */
    shadow: string;
    /**
     * Control whether to enable the pulsating-text animation within the ZoOm Feedback Bar.
     * Default is true (enabled).
     */
    enablePulsatingText: boolean;
    /**
     * Control the percent of the available ZoOm Frame width to use for the ZoOm Feedback Bar's width on desktop browsers.
     * Relative width percent is represented in decimal notation, ranging from 0.0 to 1.0.
     * If the value configured is equal to or greater than 1.0, the ZoOm Feedback Bar will be drawn to at max width within the ZoOm Frame.
     * If the value configured results in a width that is less than the minimum width, which is 2x the ZoOm Feedback Bar's height, then the ZoOm Feedback Bar's width will be set at the minimum.
     * Default is dynamically configured per device at runtime.
     */
    relativeWidthOnDesktop: string;
    /**
     * Control the percent of the available ZoOm Frame width to use for the ZoOm Feedback Bar's width on mobile browsers.
     * Relative width percent is represented in decimal notation, ranging from 0.0 to 1.0.
     * If the value configured is equal to or greater than 1.0, the ZoOm Feedback Bar will be drawn to at max width within the ZoOm Frame.
     * If the value configured results in a width that is less than the minimum width, which is 2x the ZoOm Feedback Bar's height, then the ZoOm Feedback Bar's width will be set at the minimum.
     * Default is dynamically configured per device at runtime.
     */
    relativeWidth: string;
    /**
     * Vertical spacing of the Feedback Bar from the top boundary of the ZoOm Frame, which is relative to the current .sizeRatio of the ZoOm Frame.
     * Default is dynamically configured per device at runtime.
     */
    /**
    * @removed in version 8.2
    */
    topMargin: string;
    /** Constructor for ZoomFeedbackBarCustomization object. */
    constructor();
}
/**
 * Customize the loading spinner and the text shown to the user while the camera loads.
 */
export declare class ZoomInitialLoadingAnimationCustomization implements InitialLoadingAnimationCustomization {
    /**
     * HTMLElement displayed while camera is loading.
     * Default is a custom animated loading spinner.
     */
    element: HTMLElement;
    /**
     * Color of the loading spinner background track shown to the user while the camera loads.
     * Default is off-white.
     */
    backgroundColor: string;
    /**
     * Color of the loading spinner foreground fill and message text shown to the user while the camera loads.
     * Note: This will override the loading spinner foreground fill and message text color configured with ZoomOverlayCustomization.foregroundColor.
     * If this value is an empty string, ZoomOverlayCustomization.foregroundColor will be used for the color of the loading spinner foreground fill and message text.
     * Default is an empty string.
     */
    foregroundColor: string;
    /**
     * Color of the message text shown to the user while the camera loads.
     * Note: This will override the text color configured with ZoomOverlayCustomization.foregroundColor or ZoomInitialLoadingAnimationCustomization.foregroundColor.
     * If this value is an empty string, ZoomInitialLoadingAnimationCustomization.foregroundColor will be used for the color of the message text. If the value of ZoomInitialLoadingAnimationCustomization.foregroundColor is an empty string, ZoomOverlayCustomization.foregroundColor will be used for the color of the message text.
     * Default is an empty string.
     */
    messageTextColor: string;
    /**
     * Font of the message text shown to the user while the camera loads.
     * Accepts any value assignable to the fontFamily CSS attribute.
     */
    messageFont: string;
    /**
     * Spacing between the characters of the message text shown to the user while the camera loads.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    messageTextSpacing: string;
    /**
     * Size of the message text shown to the user while the camera loads.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Default is dynamically configured per device at runtime.
     */
    messageTextSize: string;
    /** Constructor for ZoomInitialLoadingAnimationCustomization object. */
    constructor();
}
/**
 * @deprecated Note: This customization class is deprecated and will be removed in an upcoming version of the ZoOm SDK. ZoomGuidanceImagesCustomization.idealZoomImage has been renamed and moved to ZoomGuidanceCustomization.retryScreenIdealZoomImage. ZoomGuidanceImagesCustomization.cameraPermissionsScreenImage has been moved to ZoomGuidanceCustomization.cameraPermissionsScreenImage.
 * Customize the images used for the New User Guidance and Retry Screens.
 */
export declare class ZoomGuidanceImageCustomization implements GuidanceImageCustomization {
    /**
     * @deprecated Note: This customization property has been renamed and moved to ZoomGuidanceCustomization.retryScreenIdealZoomImage. This customization property location and class, ZoomGuidanceImagesCustomization, are deprecated and will be removed in an upcoming version of the ZoOm SDK.
     * Image displayed as Ideal ZoOm example (right image) during the first Retry Screen.
     */
    idealZoomImage: string;
    /**
     * @deprecated Note: This customization property has been moved to ZoomGuidanceCustomization.cameraPermissionsScreenImage. This customization property location and class, ZoomGuidanceImagesCustomization, are deprecated and will be removed in an upcoming version of the ZoOm SDK.
     * Image displayed on the Camera Permissions Screen.
     */
    cameraPermissionsScreenImage: string;
    /**
     * @deprecated
     * Constructor for ZoomGuidanceImageCustomization object
     *
     * @param directoryForImageFiles - specify a custom directory to search for default image path names
     */
    constructor(_directoryForImageFiles?: string);
}
/**
 * Customize the New User Guidance and Retry Screens.
 * New User Guidance Screens are shown before the ZoOm Session and Retry Screens are shown after an unsuccessful ZoOm Session.
 */
export declare class ZoomGuidanceCustomization implements GuidanceCustomization {
    private defaultLocationForImages;
    /**
     * Thickness of the action button's border during the New User Guidance and Retry Screens.
     * Default is dynamically configured per device at runtime.
     */
    buttonBorderWidth: string;
    /**
     * Color of the action button's border during the New User Guidance and Retry Screens.
     * Default is transparent.
     */
    buttonBorderColor: string;
    /**
     * Corner radius of the action button's border during the New User Guidance and Retry Screens.
     * Default is dynamically configured per device at runtime.
     */
    buttonCornerRadius: string;
    /**
     * Color of the action button's text during the New User Guidance and Retry Screens.
     * Default is white.
     */
    buttonTextNormalColor: string;
    /**
     * Color of the action button's text when the button is pressed during the New User Guidance and Retry Screens.
     * Default is white.
     */
    buttonTextHighlightColor: string;
    /**
     * Color of the action button's text when the button is disabled during the New User Guidance and Retry Screens.
     * Default is white.
     */
    buttonTextDisabledColor: string;
    /**
     * Color of the action button's background during the New User Guidance and Retry Screens.
     * Default is custom ZoOm color.
     */
    buttonBackgroundNormalColor: string;
    /**
     * Color of the action button's background when the button is pressed during the New User Guidance and Retry Screens.
     * Default is custom ZoOm color.
     */
    buttonBackgroundHighlightColor: string;
    /**
     * Color of the action button's background when the button is disabled during the New User Guidance and Retry Screens.
     * Default is custom ZoOm color.
     */
    buttonBackgroundDisabledColor: string;
    /**
     * Font of the title's text during the New User Guidance and Retry Screens.
     * Note: This customization can be overridden for specific text using ZoomGuidanceCustomization.readyScreenHeaderFont and/or .retryScreenHeaderFont.
     * Accepts any value assignable to the fontFamily CSS attribute.
     */
    headerFont: string;
    /**
     * Spacing between the characters of the title's text during the New User Guidance and Retry Screens.
     * Note: This customization can be overridden for specific text using ZoomGuidanceCustomization.readyScreenHeaderTextSpacing and/or .retryScreenHeaderTextSpacing.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    headerTextSpacing: string;
    /**
     * Size of the title's text during the New User Guidance and Retry Screens.
     * Note: This customization can be overridden for specific text using ZoomGuidanceCustomization.readyScreenHeaderTextSize and/or .retryScreenHeaderTextSize.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Default is dynamically configured per device at runtime.
     */
    headerTextSize: string;
    /**
     * Font of the title's subtext and messages during the New User Guidance and Retry Screens.
     * Note: This customization can be overridden for specific text using ZoomGuidanceCustomization.readyScreenSubtextFont and/or .retryScreenSubtextFont.
     * Accepts any value assignable to the fontFamily CSS attribute.
     */
    subtextFont: string;
    /**
     * Spacing between the characters of the title's subtext and messages during the New User Guidance and Retry Screens.
     * Note: This customization can be overridden for specific text using ZoomGuidanceCustomization.readyScreenSubtextTextSpacing and/or .retryScreenSubtextTextSpacing.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    subtextTextSpacing: string;
    /**
     * Size of the title's subtext and messages during the New User Guidance and Retry Screens.
     * Note: This customization can be overridden for specific text using ZoomGuidanceCustomization.readyScreenSubtextTextSize and/or .retryScreenSubtextTextSize.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Default is dynamically configured per device at runtime.
     */
    subtextTextSize: string;
    /**
     * Font of the title's text displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * Note: This will override the header font configured with ZoomGuidanceCustomization.headerFont for the Get Ready To ZoOm Screen.
     * Accepts any value assignable to the fontFamily CSS attribute.
     * If this value is an empty string, ZoomGuidanceCustomization.headerFont will be used for the font of the title's text displayed on the Get Ready To ZoOm Screen.
     * Default value is an empty string.
     */
    readyScreenHeaderFont: string;
    /**
     * Spacing between the characters of the title's text displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Note: This will override the header text spacing configured with ZoomGuidanceCustomization.headerTextSpacing for the Get Ready To ZoOm Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.headerTextSpacing will be used for the character spacing of the title's text displayed on the Get Ready To ZoOm Screen.
     * Default value is an empty string.
     */
    readyScreenHeaderTextSpacing: string;
    /**
     * Color of the header text displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * Note: This will override the header text color configured with ZoomGuidanceCustomization.foregroundColor for the Get Ready To ZoOm Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.foregroundColor will be used for the color of the title's text displayed on the Get Ready To ZoOm Screen.
     * Default value is an empty string.
     */
    readyScreenHeaderTextColor: string;
    /**
     * Size the title's text displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Note: This will override the header text size configured with ZoomGuidanceCustomization.headerTextSize for the Get Ready To ZoOm Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.headerTextSize will be used for the size of the title's text displayed on the Get Ready To ZoOm Screen.
     * Default value is an empty string.
     */
    readyScreenHeaderTextSize: string;
    /**
     * Specify an html-attributed string to use instead of the localized string for the text of the title displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * If this value is an empty string, the localized string, zoom_instructions_header_ready, will be used for the text of the title displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * Default is an empty string.
     */
    readyScreenHeaderAttributedString: string;
    /**
     * Font of the title's subtext displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * Note: This will override the title's subtext font configured with ZoomGuidanceCustomization.subtextFont for the Get Ready To ZoOm Screen.
     * Accepts any value assignable to the fontFamily CSS attribute.
     * If this value is an empty string, ZoomGuidanceCustomization.subtextFont will be used for the font of the title's subtext displayed on the Get Ready To ZoOm Screen.
     * Default value is an empty string.
     */
    readyScreenSubtextFont: string;
    /**
     * Spacing between the characters of the title's subtext displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Note: This will override the subtext text spacing configured with ZoomGuidanceCustomization.subtextTextSpacing for the Get Ready To ZoOm Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.subtextTextSpacing will be used for the character spacing of the title's subtext displayed on the Get Ready To ZoOm Screen.
     * Default value is an empty string.
     */
    readyScreenSubtextTextSpacing: string;
    /**
     * Color of the title's subtext displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * Note: This will override the title's subtext color configured with ZoomGuidanceCustomization.foregroundColor for the Get Ready To ZoOm Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.foregroundColor will be used for the color of the title's subtext displayed on the Get Ready To ZoOm Screen.
     * Default value is an empty string.
     */
    readyScreenSubtextTextColor: string;
    /**
     * Size of the title's subtext displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Note: This will override the subtext text size configured with ZoomGuidanceCustomization.subtextTextSize for the Get Ready To ZoOm Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.subtextTextSize will be used for the size of the title's subtext displayed on the Get Ready To ZoOm Screen.
     * Default value is an empty string.
     */
    readyScreenSubtextTextSize: string;
    /**
     * Specify an html-attributed string to use instead of the localized string for the text of the title's subtext displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * If this value is an empty string, the localized string, zoom_instructions_message_ready, will be used for the text of the title's subtext displayed on the Get Ready To ZoOm Screen during the New User Guidance and Retry Screens.
     * Default is an empty string.
     */
    readyScreenSubtextAttributedString: string;
    /**
     * Font of the title's text displayed on the first Retry Screen.
     * Note: This will override the header font configured with ZoomGuidanceCustomization.headerFont for the first Retry Screen.
     * Accepts any value assignable to the fontFamily CSS attribute.
     * If this value is an empty string, ZoomGuidanceCustomization.headerFont will be used for the font of the title's text displayed on the first Retry Screen.
     * Default value is an empty string.
     */
    retryScreenHeaderFont: string;
    /**
     * Spacing between the characters of the title's text displayed on the first Retry Screen.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Note: This will override the header text spacing configured with ZoomGuidanceCustomization.headerTextSpacing for the first Retry Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.headerTextSpacing will be used for the character spacing of the title's text displayed on the first Retry Screen.
     * Default value is an empty string.
     */
    retryScreenHeaderTextSpacing: string;
    /**
     * Color of the header text displayed on the first Retry Screen.
     * Note: This will override the header text color configured with ZoomGuidanceCustomization.foregroundColor for the first Retry Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.foregroundColor will be used for the color of the title's text displayed on the first Retry Screen.
     * Default value is an empty string.
     */
    retryScreenHeaderTextColor: string;
    /**
     * Size of the title's text displayed on the first Retry Screen.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Note: This will override the header text size configured with ZoomGuidanceCustomization.headerTextSize for the first Retry Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.headerTextSize will be used for the size of the title's text displayed on the first Retry Screen.
     * Default value is an empty string.
     */
    retryScreenHeaderTextSize: string;
    /**
     * Specify an html-attributed string to use instead of the localized string for the text of the title displayed on the first Retry Screen.
     * If this value is an empty string, the localized string, zoom_retry_header, will be used for the text of the title displayed on the first Retry Screen.
     * Default is an empty string.
     */
    retryScreenHeaderAttributedString: string;
    /**
     * Font of the title's subtext and messages displayed on the first Retry Screen.
     * Note: This will override the font of the title's subtext and messages configured with ZoomGuidanceCustomization.subtextFont for the first Retry Screen.
     * Accepts any value assignable to the fontFamily CSS attribute.
     * If this value is an empty string, ZoomGuidanceCustomization.subtextFont will be used for the font of the title's subtext and messages displayed on the first Retry Screen.
     * Default value is an empty string.
     */
    retryScreenSubtextFont: string;
    /**
     * Spacing between the characters of the title's subtext and messages displayed on the first Retry Screen.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Note: This will override the subtext and message text spacing configured with ZoomGuidanceCustomization.subtextTextSpacing for the first Retry Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.subtextTextSpacing will be used for the character spacing of the title's subtext and messages displayed on the first Retry Screen.
     * Default value is an empty string.
     */
    retryScreenSubtextTextSpacing: string;
    /**
     * Color of the title's subtext and messages displayed on the first Retry Screen.
     * Note: This will override the title's subtext and message color configured with ZoomGuidanceCustomization.foregroundColor for the first Retry Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.foregroundColor will be used for the color of the title's subtext displayed on the first Retry Screen.
     * Default value is an empty string.
     */
    retryScreenSubtextTextColor: string;
    /**
     * Size of the title's subtext and messages displayed on the first Retry Screen.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Note: This will override the subtext and message text size configured with ZoomGuidanceCustomization.subtextTextSize for the first Retry Screen.
     * If this value is an empty string, ZoomGuidanceCustomization.subtextTextSpacing will be used for the size of the title's subtext and messages displayed on the first Retry Screen.
     * Default value is an empty string.
     */
    retryScreenSubtextTextSize: string;
    /**
     * Specify an html-attributed string to use instead of the localized string for the text of the title's subtext displayed on the first Retry Screen.
     * If this value is an empty string, the localized strings, zoom_retry_subheader_message, will be used for the text of the title's subtext displayed on the first Retry Screen.
     * Default is an empty string.
     */
    retryScreenSubtextAttributedString: string;
    /**
     * Font of the action button's text during the New User Guidance and Retry Screens.
     * Accepts any value assignable to the fontFamily CSS attribute.
     * Default is a bold system font.
     */
    buttonFont: string;
    /**
     * Spacing between the characters of the action button's text during the New User Guidance and Retry Screens.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    buttonTextSpacing: string;
    /**
     * Size of the action button's text during the New User Guidance and Retry Screens.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Default is dynamically configured per device at runtime.
     */
    buttonTextSize: string;
    /**
     * Control the percent of the available ZoOm Frame width to use for the action button during the New User Guidance and Retry Screens for mobile browsers.
     * Relative width percent is represented in decimal notation, ranging from 0.0 to 1.0.
     * If the value configured is equal to or greater than 1.0, the action button will be drawn to at max width within the ZoOm Frame.
     * If the value configured results in a width that is less than the action button's height, the action button's width will equal its height.
     * Default is dynamically configured per device at runtime.
     */
    buttonRelativeWidth: string;
    /**
     * Control the percent of the available ZoOm Frame width to use for the action button during the New User Guidance and Retry Screens for desktop browsers.
     * Relative width percent is represented in decimal notation, ranging from 0.0 to 1.0.
     * If the value configured is equal to or greater than 1.0, the action button will be drawn to at max width within the ZoOm Frame.
     * If the value configured results in a width that is less than the action button's height, the action button's width will equal its height.
     * Default is dynamically configured per device at runtime.
     */
    buttonRelativeWidthOnDesktop: string;
    /**
     * Color of the background for the New User Guidance and Retry Screens.
     * Default is white.
     */
    backgroundColors: string;
    /**
     * Color of the text displayed on the New User Guidance and Retry Screens (not including the action button text).
     * Note: This customization can be overridden for specific text using ZoomGuidanceCustomization.readyScreenHeaderTextColor, .readyScreenSubtextTextColor, .retryScreenHeaderTextColor, and/or .retryScreenSubtextTextColor.
     * Default is custom ZoOm color.
     */
    foregroundColor: string;
    /**
     * Color of the Get Ready To ZoOm Screen's oval fill.
     * Default is transparent.
     */
    readyScreenOvalFillColor: string;
    /**
     * Background color of the Get Ready To ZoOm Screen text views during the New User Guidance and Retry Screens.
     * This will only be visible when text is detected as overlapping or too close with the Ready screen oval.
     * Default is a semi-opaque shade of black.
     */
    readyScreenTextBackgroundColor: string;
    /**
     * Background corner radius of the Get Ready To ZoOm Screen text views during the New User Guidance and Retry Screens.
     * This will only be visible when text is detected as overlapping or too close with the Get Ready To ZoOm Screen's oval.
     * Default is dynamically configured per device at runtime.
     */
    readyScreenTextBackgroundCornerRadius: string;
    /**
     * Image displayed as Ideal ZoOm example (right image) during the first Retry Screen.
     * Default is configured to use image named 'zoom_ideal' located in '/zoom-images/' directory (or custom configured defaul directory for ZoOm images).
     */
    retryScreenIdealZoomImage: string;
    /**
     * Images displayed as Ideal ZoOm examples (right image) during the first Retry Screen.
     * When configured to a non-empty array, these images will override the single image configured for imageCustomization.idealZoomImage.
     * Default is an empty array.
     */
    retryScreenSlideshowImages: string[];
    /**
     * Control the time that each image is shown for before transitioning to the next image.
     * Default is 1500ms.
     */
    retryScreenSlideshowInterval: string;
    /**
     * Control whether to allow the slideshow images to appear in a randomized order during each Retry Screen.
     * Default is true (enabled).
     */
    enableRetryScreenSlideshowShuffle: boolean;
    /**
     * Color of the image borders during the first Retry Screen.
     * Default is custom ZoOm color.
     */
    retryScreenImageBorderColor: string;
    /**
     * Thickness of the image borders during the first Retry Screen.
     * Default is dynamically configured per device at runtime.
     */
    retryScreenImageBorderWidth: string;
    /**
     * Corner radius of the image borders during the first Retry Screen.
     * Default is dynamically configured per device at runtime.
     */
    retryScreenImageCornerRadius: string;
    /**
     * Color of the oval's stroke that overlay's the Ideal image example during the first Retry Screen.
     * Default is white.
     */
    retryScreenOvalStrokeColor: string;
    /**
     * Control whether to layout the Retry Screen's instruction messages using bullet-points.
     * Applicable localized instruction message strings include: zoom_retry_instruction_message_1, zoom_retry_instruction_message_2, zoom_retry_instruction_message_3.
     * If enabled, each instruction message will be placed on a new line, proceeded with a bullet-point, and will not extend to multiple lines.
     * If disabled, all instruction messages will be concatenated into a multi-line string.
     * Default is true (enabled).
     */
    enableRetryScreenBulletedInstructions: boolean;
    /**
     * Image displayed on the Camera Permissions Screen.
     * Default is configured to use image named 'zoom_camera' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    cameraPermissionsScreenImage: string;
    /**
     * Control the behavior of the action button on the Camera Permissions Screen.
     * If set to enum value ZoomCameraPermissionsLaunchAction.LaunchURL, clicking the Camera Permissions Screen's action button will launch a new browser tab and load the URL specified in the localized stings file as zoom_browser_camera_help_action_link.
     * If set to enum value ZoomCameraPermissionsLaunchAction.Cancel, clicking the Camera Permissions Screen's action button will cancel the current session.
     * Default is ZoomCameraPermissionsLaunchAction.Cancel.
     */
    cameraPermissionsScreenLaunchAction: ZoomCameraPermissionsLaunchAction;
    /**
     * @deprecated Note: This customization property and class are deprecated and will be removed in an upcoming version of the ZoOm SDK. ZoomGuidanceImagesCustomization.idealZoomImage has been renamed and moved to ZoomGuidanceCustomization.retryScreenIdealZoomImage. ZoomGuidanceImagesCustomization.cameraPermissionsScreenImage has been moved to ZoomGuidanceCustomization.cameraPermissionsScreenImage.
     * Customize the images used for the New User Guidance and Retry Screens.
     */
    imageCustomization: ZoomGuidanceImageCustomization;
    /**
     * Constructor for ZoomGuidanceCustomization object
     *
     * @param directoryForImageFiles - (optional) specify a custom directory to search for default image path names
     */
    constructor(directoryForImageFiles?: string);
}
/**
 * Customize the New User Guidance and Retry Screens.
 * New User Guidance Screens are shown before the ZoOm Session and Retry Screens are shown after an unsuccessful ZoOm Session.
 */
export declare class ZoomEnterFullScreenCustomization implements EnterFullScreenCustomization {
    private defaultLocationForImages;
    /**
     * Thickness of the action button's border during the Enter Full Screen Page.
     * Default is dynamically configured per device at runtime.
     */
    buttonBorderWidth: string;
    /**
     * Color of the action button's border during the Enter Full Screen Page.
     * Default is transparent.
     */
    buttonBorderColor: string;
    /**
     * Corner radius of the action button's border during the Enter Full Screen Page.
     * Default is dynamically configured per device at runtime.
     */
    buttonCornerRadius: string;
    /**
     * Color of the action button's text during the Enter Full Screen Page.
     * Default is white.
     */
    buttonTextNormalColor: string;
    /**
     * Color of the action button's text when the button is pressed during the Enter Full Screen Page.
     * Default is white.
     */
    buttonTextHighlightColor: string;
    /**
     * Color of the action button's text when the button is disabled during the Enter Full Screen Page.
     * Default is white.
     */
    buttonTextDisabledColor: string;
    /**
     * Color of the action button's background during the Enter Full Screen Page.
     * Default is custom ZoOm color.
     */
    buttonBackgroundNormalColor: string;
    /**
     * Color of the action button's background when the button is pressed during the Enter Full Screen Page.
     * Default is custom ZoOm color.
     */
    buttonBackgroundHighlightColor: string;
    /**
     * Color of the action button's background when the button is disabled during the Enter Full Screen Page.
     * Default is custom ZoOm color.
     */
    buttonBackgroundDisabledColor: string;
    /**
     * Font of the title's text during the Enter Full Screen Page.
     */
    headerFont: string;
    /**
     * Spacing between the characters of the title's text during the Enter Full Screen Page.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    headerTextSpacing: string;
    /**
     * Font of the title's subtext and messages during the Enter Full Screen Page.
     */
    subtextFont: string;
    /**
     * Spacing between the characters of the title's subtext and messages during the Enter Full Screen Page.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    subtextTextSpacing: string;
    /**
   * Font of the title's subtext during the Enter Full Screen Page.
   * Default is a bold system font.
   */
    buttonFont: string;
    /**
     * Spacing between the characters of the action button's text during the Enter Full Screen Page.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    buttonTextSpacing: string;
    /**
     * Control the percent of the available ZoOm Frame width to use for the action button during the Enter Full Screen Page for mobile browsers.
     * Relative width percent is represented in decimal notation, ranging from 0.0 to 1.0.
     * If the value configured is equal to or greater than 1.0, the action button will be drawn to at max width within the ZoOm Frame.
     * If the value configured results in a width that is less than the action button's height, the action button's width will equal its height.
     * Default is dynamically configured per device at runtime.
     */
    buttonRelativeWidth: string;
    /**
     * Control the percent of the available ZoOm Frame width to use for the action button during the Enter Full Screen Page for desktop browsers.
     * Relative width percent is represented in decimal notation, ranging from 0.0 to 1.0.
     * If the value configured is equal to or greater than 1.0, the action button will be drawn to at max width within the ZoOm Frame.
     * If the value configured results in a width that is less than the action button's height, the action button's width will equal its height.
     * Default is dynamically configured per device at runtime.
     */
    buttonRelativeWidthOnDesktop: string;
    /**
     * Color of the background for the Enter Full Screen Page.
     * Default is white.
     */
    backgroundColors: string;
    /**
     * Color of the text displayed on the Enter Full Screen Page (not including the action button text).
     * Default is custom ZoOm color.
     */
    foregroundColor: string;
    /**
     * Image displayed on the Enter Full Screen Page.
     * Default is configured to use image named 'zoom_enter_fullscreen' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    enterFullScreenImage: string;
    /**
     * Shadow displayed behind the Enter Full Screen Page.
     * This accepts box-shadow css attribute string values.
     * Default is none.
     */
    shadow: string;
    /**
     * Color of the Enter Full Screen Page border.
     * Default is white.
     */
    borderColor: string;
    /**
     * Corner radius of the Enter Full Screen Page.
     * Default is dynamically configured per device at runtime.
     */
    borderCornerRadius: string;
    /**
     * Thickness of the Enter Full Screen Page.
     * Default is dynamically configured per device at runtime.
     */
    borderWidth: string;
    /**
     * Constructor for ZoomEnterFullScreenCustomization object
     *
     * @param directoryForImageFiles - (optional) specify a custom directory to search for default image path names
     */
    constructor(directoryForImageFiles?: string);
}
/**
 * Customize the ZoOm Overlay.
 * The ZoOm Overlay separates the ZoOm Interface from the presenting application, covering the device's full screen.
 * .blurEffectStyle will be implemented in an upcoming release of the ZoOm Browser SDK.
 */
export declare class ZoomOverlayCustomization implements OverlayCustomization {
    private defaultLocationForImages;
    /**
     * Color of the ZoOm Overlay background.
     * Default is white.
     */
    backgroundColor: string;
    /**
     * @deprecated Note: This customization is deprecated and will be removed in an upcoming version of the ZoOm SDK. Use ZoomInitialLoadingAnimationCustomization.messageTextColor to configure the color of the initial loading text shown when loading the camera. Use ZoomInitialLoadingAnimationCustomization.foregroundColor for configuring the foreground color of the loading spinner animation shown when loading the camera.
     * Color of the text and animation foreground shown on ZoOm Overlay. This includes the initial loading animation and text shown to the user when loading the camera.
     * Default is custom ZoOm color.
     */
    foregroundColor: string;
    /**
     * Applies a blur effect over the background of the ZoOm Overlay.
     * Default is off.
     */
    blurEffectStyle: string;
    /**
     * Control whether to show the branding image the ZoOm Frame on top of the ZoOm Overlay.<br>
     * Default is true (shown).
     */
    showBrandingImage: boolean;
    /**
     * Image displayed below the ZoOm Frame on top of the ZoOm Overlay.
     * Default is configured to use image named 'zoom_your_app_logo' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    brandingImage: string;
    /** Constructor for ZoomOverlayCustomization object. */
    constructor();
}
/**
 * Customize the Result Screen.
 * Shown for server-side work and response handling.
 * .foregroundColor will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .activityIndicatorColor will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .uploadProgressTrackColor will be implemented in an upcoming release of the ZoOm Browser SDK.
 *
 */
export declare class ZoomResultScreenCustomization implements ResultScreenCustomization {
    /**
     * Color of the Result Screen's background.
     * Default is white.
     */
    backgroundColors: string;
    /**
     * Color of the text displayed on the Result Screen.
     * Default is custom ZoOm color.
     */
    foregroundColor: string;
    /**
     * Color of the result animation's background.
     * Default is custom ZoOm color.
     */
    resultAnimationBackgroundColor: string;
    /**
     * Color of the result animation's accent color.
     * Default is white.
     */
    resultAnimationForegroundColor: string;
    /**
     * Image displayed behind the result foreground animation for success scenarios.
     * If image is configured, default result background animation will be hidden.
     * Default is set to an empty string and will fallback to using the default result background animation, which respects the color assigned to .resultAnimationBackgroundColor.
     */
    resultAnimationSuccessBackgroundImage: string;
    /**
     * Image displayed behind the result foreground animation for unsuccess scenarios.
     * If image is configured, default result background animation will be hidden.
     * Default is set to an empty string and will fallback to using the default result background animation, which respects the color assigned to .resultAnimationBackgroundColor.
     */
    resultAnimationUnsuccessBackgroundImage: string;
    /**
     * Font of the message text displayed on the Result Screen.
     * Accepts any value assignable to the fontFamily CSS attribute.
     */
    messageFont: string;
    /**
     * Spacing between the characters of the message text displayed on the Result Screen.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    messageTextSpacing: string;
    /**
     * Size of the message text displayed on the Result Screen.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Default is dynamically configured per device at runtime.
     */
    messageTextSize: string;
    /**
     * Color of the activity indicator animation shown during server-side work.
     * Default is custom ZoOm color.
     */
    activityIndicatorColor: string;
    /**
     * Image displayed and rotated during server-side work.
     * If image is configured, default activity indicator will be hidden.
     * Default is set to an empty string and will fallback to using default activity indicator animation.
     */
    customActivityIndicatorImage: string;
    /**
     * Control the speed of the rotation for your custom activity indicator image.
     * Only applicable when image is configured for .customActivityIndicatorImage.
     * This value indicates the duration of each full rotation.
     * Default is 1s.
     */
    customActivityIndicatorRotationInterval: string;
    /**
     * Control whether to show or hide the upload progress bar during server-side work.
     * Default is true (shown).
     */
    showUploadProgressBar: boolean;
    /**
     * Color of the upload progress bar's fill.
     * Default is custom ZoOm color.
     */
    uploadProgressFillColor: string;
    /**
     * Color of upload progress bar's track.
     * Default is a semi-opaque shade of black.
     */
    uploadProgressTrackColor: string;
    /** Constructor for ZoomResultScreenCustomization object. */
    constructor();
}
/**
 * Customize the ZoOm Identity Check Screens.
 * .selectionScreenBackgroundColors will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .selectionScreenBlurEffectStyle will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .reviewScreenForegroundColor will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .reviewScreenTextBackgroundColor will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .reviewScreenTextBackgroundBorderColor will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .reviewScreenTextBackgroundBorderWidth will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .reviewScreenTextBackgroundBorderCornerRadius will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .reviewScreenBackgroundColors will be implemented in an upcoming release of the ZoOm Browser SDK.
 * .reviewScreenBlurEffectStyle will be implemented in an upcoming release of the ZoOm Browser SDK.
 *
 */
export declare class ZoomIDScanCustomization {
    private defaultLocationForImages;
    /**
    * Image displayed on the ID Scan Select ID Document page
    * Default is configured to use image named 'zoom_branding_logo_id_check' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
    */
    showSelectionScreenBrandingImage: boolean;
    /**
     * Color of the text displayed on the Identity Document Type Selection Screen (not including the action button text).
     * Default is off-black.
     */
    selectionScreenForegroundColor: string;
    /**
     * Font of the title during the Identity Document Type Selection Screen.
     * Accepts any value assignable to the fontFamily CSS attribute.
     */
    headerFont: string;
    /**
     * Spacing between the characters of the title's text during the Identity Document Type Selection Screen.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    headerTextSpacing: string;
    /**
     * Size of the title text during the Identity Document Type Selection Screen.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Default is dynamically configured per device at runtime.
     */
    headerTextSize: string;
    /**
     * Font of the message text during the Identity Document Capture and Review Screens.
     * Accepts any value assignable to the fontFamily CSS attribute.
     */
    subtextFont: string;
    /**
     * Spacing between the characters of the title's subtext and messages during the Identity Document Capture and Review Screens.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    subtextTextSpacing: string;
    /**
     * Size of the message text during the Identity Document Capture and Review Screens.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Default is dynamically configured per device at runtime.
     */
    subtextTextSize: string;
    /**
     * Font of the action button's text during the Identity Check Screens.
     * Accepts any value assignable to the fontFamily CSS attribute.
     */
    buttonFont: string;
    /**
     * Spacing between the characters of the action button's text during the Identity Check Screens.
     * Accepts any value assignable to the letterSpacing CSS attribute.
     * Default is 'normal'.
     */
    buttonTextSpacing: string;
    /**
     * Size of the action button's text during the Identity Check Screens.
     * Accepts any value assignable to the fontSize CSS attribute.
     * Default is dynamically configured per device at runtime.
     */
    buttonTextSize: string;
    /**
     * Thickness of the action button's border during the Identity Check Screens.
     * Default is dynamically configured per device at runtime.
     */
    buttonBorderWidth: string;
    /**
     * Color of the action button's border during the Identity Check Screens.
     * Default is transparent.
     */
    buttonBorderColor: string;
    /**
     * Corner radius of the action button's border during the Identity Check Screens.
     * Default is dynamically configured per device at runtime.
     */
    buttonCornerRadius: string;
    /**
     * Color of the action button's text during the Identity Check Screens.
     * Default is white.
     */
    buttonTextNormalColor: string;
    /**
     * Color of the action button's text when the button is pressed during the Identity Check Screens.
     * Default is white.
     */
    buttonTextHighlightColor: string;
    /**
   * Color of the action button's text when the button is disabled during the Identity Check Screens.
   * Default is white.
   */
    buttonTextDisabledColor: string;
    /**
     * Color of the action button's background during the Identity Check Screens.
     * Default is custom ZoOm color.
     */
    buttonBackgroundNormalColor: string;
    /**
     * Color of the action button's background when the button is pressed during the Identity Check Screens.
     * Default is custom ZoOm color.
     */
    buttonBackgroundHighlightColor: string;
    /**
     * Color of the action button's background when the button is disabled during the Identity Check Screens.
     * Default is custom ZoOm color.
     */
    buttonBackgroundDisabledColor: string;
    /**
     * Control the percent of the available ZoOm Frame width to use for the action button during the Identity Check Screens for mobile browsers.
     * Relative width percent is represented in decimal notation, ranging from 0.0 to 1.0.
     * If the value configured is equal to or greater than 1.0, the action button will be drawn to at max width within the ZoOm Frame.
     * If the value configured results in a width that is less than the action button's height, the action button's width will equal its height.
     * Note: The Identity Document Review Screen action buttons will be drawn at half the configured width.
     * Default is dynamically configured per device at runtime.
     */
    buttonRelativeWidth: string;
    /**
     * Control the percent of the available ZoOm Frame width to use for the action button during the Identity Check Screens for desktop browsers.
     * Relative width percent is represented in decimal notation, ranging from 0.0 to 1.0.
     * If the value configured is equal to or greater than 1.0, the action button will be drawn to at max width within the ZoOm Frame.
     * If the value configured results in a width that is less than the action button's height, the action button's width will equal its height.
     * Note: The Identity Document Review Screen action buttons will be drawn at half the configured width.
     * Default is dynamically configured per device at runtime.
     */
    buttonRelativeWidthOnDesktop: string;
    /**
     * Color of the Identity Document Type Selection Screen background.
     * Default is white.
     */
    selectionScreenBackgroundColors: string;
    /**
     * Applies a blur effect over the background of the Identity Document Type Selection Screen.
     * Default is off.
     */
    selectionScreenBlurEffectStyle: string;
    /**
     * Image displayed on the Identity Document Type Selection Screen.
     * Default is configured to use image named 'zoom_branding_logo_id_check' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    selectionScreenBrandingImage: string;
    /**
     * Color of the text displayed on the Identity Document Capture Screen (not including the action button text).
     * Default is white.
     */
    captureScreenForegroundColor: string;
    /**
     * Color of the text view background during the Identity Document Capture Screen.
     * Default is custom ZoOm color.
     */
    captureScreenTextBackgroundColor: string;
    /**
     * Color of the text view background border during the Identity Document Capture Screen.
     * Default is transparent.
     */
    captureScreenTextBackgroundBorderColor: string;
    /**
     * Thickness of the text view background border during the Identity Document Capture Screen.
     * Default is 0.
     */
    captureScreenTextBackgroundBorderWidth: string;
    /**
     * Corner radius of the text view background and border during the Identity Document Capture Screen.
     * Default is dynamically configured per device at runtime.
     */
    captureScreenTextBackgroundCornerRadius: string;
    /**
     * Color of the Identity Document Capture Screen's background.
     * Default is white.
     */
    captureScreenBackgroundColor: string;
    /**
     * Color of the Identity Document Capture Frame's stroke.
     * Default is custom ZoOm color.
     */
    captureFrameStrokeColor: string;
    /**
     * Thickness of the Identity Document Capture Frame's stroke.
     * Default is dynamically configured per device at runtme.
     */
    captureFrameStrokeWidth: string;
    /**
     * Corner radius of the Identity Document Capture Frame.
     * Default is dynamically configured per device at runtime.
     */
    captureFrameCornerRadius: string;
    /**
     * Color of the text displayed on the Identity Document Review Screen (not including the action button text).
     * Default is white.
     */
    reviewScreenForegroundColor: string;
    /**
     * Color of the text view background during the Identity Document Review Screen.
     * Default is custom ZoOm color.
     */
    reviewScreenTextBackgroundColor: string;
    /**
     * Color of the text view background border during the Identity Document Review Screen.
     * Default is transparent.
     */
    reviewScreenTextBackgroundBorderColor: string;
    /**
     * Thickness of the text view background border during the Identity Document Review Screen.
     * Default is 0.
     */
    reviewScreenTextBackgroundBorderWidth: string;
    /**
     * Corner radius of the text view background and border during the Identity Document Review Screen.
     * Default is dynamically configured per device at runtime.
     */
    reviewScreenTextBackgroundBorderCornerRadius: string;
    /**
     * Corner radius of the ID Document Preview image displayed on the Identity Document Review Screen.
     * Default is dynamically configured per device at runtime.
     */
    reviewScreenDocumentPreviewCornerRadius: string;
    /**
     * Color of the Identity Document Review Screen background.
     * Default is white.
     */
    reviewScreenBackgroundColors: string;
    /**
     * Applies a blur effect over the background of the Identity Document Review Screen.
     * Default is off.
     */
    reviewScreenBlurEffectStyle: string;
    /**
     * Image displayed below the ZoOm Frame during Identity Check when the Identity Document Type selected is an ID Card.
     * This image acts as a placeholder to show a status of incomplete for capturing the ID Card's front side.
     * This only applies to desktop browsers.
     * Default is configured to use image named 'zoom_id_card_placeholder_front' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    captureScreenIDFrontPlaceHolderImage: string;
    /**
     * Image displayed below the ZoOm Frame during Identity Check when the Identity Document Type selected is an ID Card.
     * This image acts as a placeholder to show a status of incomplete for capturing the ID Card's back side.
     * This only applies to desktop browsers.
     * Default is configured to use image named 'zoom_id_card_placeholder_back' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    captureScreenIDBackPlaceHolderImage: string;
    /**
     * Image displayed below the ZoOm Frame during Identity Check when the Identity Document Type selected is a Passport.
     * This image acts as a placeholder to show a status of incomplete for capturing the Passport.
     * This only applies to desktop browsers.
     * Default is configured to use image named 'zoom_passport_placeholder' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    captureScreenPassportPlaceholderImage: string;
    /**
     * Image displayed below the ZoOm Frame during Identity Check when the Identity Document Type selected is an ID Card.
     * This image acts as a placeholder to show a status of complete for capturing the ID Card's front side.
     * This only applies to desktop browsers.
     * Default is configured to use image named 'zoom_id_front_checkmark' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    captureScreenIDFrontCheckmarkImage: string;
    /**
     * Image displayed below the ZoOm Frame during Identity Check when the Identity Document Type selected is an ID Card.
     * This image acts as a placeholder to show a status of complete for capturing the ID Card's back side.
     * This only applies to desktop browsers.
     * Default is configured to use image named 'zoom_id_back_checkmark' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    captureScreenIDBackCheckmarkImage: string;
    /**
     * Image displayed below the ZoOm Frame during Identity Check when the Identity Document Type selected is a Passport.
     * This image acts as a placeholder to show a status of complete for capturing the Passport.
     * This only applies to desktop browsers.
     * Default is configured to use image named 'zoom_passport_checkmark' located in '/zoom-images/' directory (or custom configured default directory for ZoOm images).
     */
    captureScreenPassportCheckmarkImage: string;
    /** Constructor for ZoomIDScanCustomization object. */
    constructor();
    [key: string]: string | boolean;
}
export declare var ZoomCustomizations: {
    overrideResultScreenSuccessMessageObject: {
        message: string;
    };
    getSuccessResultMessageOrOverrideResultScreenSuccessMessage: () => string;
    setCustomization: (updatedCustomization: ZoomCustomization) => void;
    setLowLightCustomization: (llCustomization: ZoomCustomization | null) => void;
    ZoomCustomization: typeof ZoomCustomization;
    currentCustomization: ZoomCustomization;
    currentLowLightCustomization: () => ZoomCustomization | null;
    isLowLightModeActive: () => boolean;
    setIsLowLightModeActive: (isActive: boolean) => void;
    shouldUseLowLightCustomization: () => boolean;
    setImagesDirectory: (directory: string) => void;
    verifyColorCustomizations: (latestCustomization: ZoomCustomization) => void;
    ZoomOvalCustomization: typeof ZoomOvalCustomization;
    ZoomCancelButtonCustomization: typeof ZoomCancelButtonCustomization;
    ZoomExitAnimationCustomization: typeof ZoomExitAnimationCustomization;
    ZoomFeedbackBarCustomization: typeof ZoomFeedbackBarCustomization;
    ZoomFrameCustomization: typeof ZoomFrameCustomization;
    ZoomSessionTimerCustomization: typeof ZoomSessionTimerCustomization;
    ZoomInitialLoadingAnimationCustomization: typeof ZoomInitialLoadingAnimationCustomization;
    ZoomGuidanceCustomization: typeof ZoomGuidanceCustomization;
    ZoomOverlayCustomization: typeof ZoomOverlayCustomization;
    ZoomExitAnimationStyle: typeof ZoomExitAnimationStyle;
    ZoomCancelButtonLocation: typeof ZoomCancelButtonLocation;
    ZoomCameraPermissionsLaunchAction: typeof ZoomCameraPermissionsLaunchAction;
};
