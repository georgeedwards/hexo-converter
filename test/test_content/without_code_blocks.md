---
title: Location
description: How to work with geographical location data in NativeScript.
---

# Location

> **IMPORTANT:** Starting with NativeScript 1.5.0, the built-in Location module is deprecated. To implement geolocation in your apps, use the `nativescript-geolocation` plugin, available via npm. This plugin provides an API similar to the [WC3 Geolocation API](http://dev.w3.org/geo/api/spec-source.html). 

The most important difference between the deprecated module and the new plugin is that location monitoring via the plugin returns an `id` which you can use to stop location monitoring. The `nativescript-geolocation` plugin also uses an accuracy criteria approach to deliver geolocation. This means that getting a location is powered by the most accurate location provider that is available. For example, if GPS signal is available and the GPS provider is enabled, the plugin uses GPS; if GPS is not connected, the device falls back to other available providers such as Wi-Fi networks or cell towers).

This approach does not limit location monitoring only to a specific location provider; it can still work with all of them.

You might want to start with this [example](https://github.com/nsndeck/locationtest) which demonstrates how to use the `nativescript-geolocation` plugin.

To make the plugin available in your app, run the following command:

```Shell
tns plugin add nativescript-geolocation
```

To import the module in your code use:
{% nativescript %}
JavaScript
var geolocation = require("nativescript-geolocation");

{% endnativescript %}
```TypeScript
import geolocation = require("nativescript-geolocation");
```

## Getting Information About a Location Service

NativeScript has an universal way to check if location services are turned on - the `isEnabled` method. The method returns a boolean value (true if the location service is enabled).

> **NOTE:** For Android, `isEnabled` checks if the location service is enabled (any accuracy level). For iOS, the method checks if the location service is enabled for the application in foreground or background mode.

> **NOTE:** Keep in mind that location services do not work in emulators. You can test them only on a real devices.

## Requesting Permissions to Use Location Services

By default, the `nativescript-geolocation` plugin adds the required permissions in `AndroidManiest.xml` for Android and `Info.plist` for iOS. For iOS, the plugin adds two dummy string values which serve as message when the platform asks for permission to use location services. You can edit this message later. 

After you install the plugin, you can request to use location services in the app with the following code:
{% nativescript %}
XML
<Page> 
    <StackLayout>
        <Button text="enable Location" tap="enableLocationTap"/>
    </StackLayout>
</Page>

JavaScript
function enableLocationTap(args) {
    if (!geolocation.isEnabled()) {
        geolocation.enableLocationRequest();
    }
}
exports.enableLocationTap = enableLocationTap;

{% endnativescript %}
{% angular %}
XML
<StackLayout>
    <Button text="enable Location" (tap)="enableLocationTap()"></Button>
</StackLayout>

{% endangular %}
TypeScript
{% nativescript %}export function {% endnativescript %}public {% angular %}{% endangular %}enableLocationTap() { 
    if (!geolocation.isEnabled()) {
        geolocation.enableLocationRequest();
    }
}


## Getting Location

You can get location with `getCurrentLocation` or with `watchLocation`. Using `distance`, you can obtain the distance between two locations.

* [getCurrentLocation](#getcurrentlocation)
* [watchLocation](#watchlocation)
* [distance](#distance)

### `getCurrentLocation`

This method gets a single location. It accepts the `location options` parameter. 