---
title: Location
description: How to work with geographical location data in NativeScript.
---

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
you can request to use location services in the app with the following code:
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

 