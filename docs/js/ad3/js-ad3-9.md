# 9. 用户代理检测



主要是为了检测用户浏览器版本、系统信息等。主要依赖navigator.userAgent来做判断
```html
<!DOCTYPE html>
<html>
<head>
    <title>User-agent Detection Example</title>
    <script type="text/javascript" src="client.js"></script>
</head>
<body>  
    <h2>Rendering Engines</h2>
    <ul>
        <li>client.engine.ie = <script>document.write(client.engine.ie);</script></li>
        <li>client.engine.webkit = <script>document.write(client.engine.webkit);</script></li>
        <li>client.engine.gecko = <script>document.write(client.engine.gecko);</script></li>
        <li>client.engine.khtml = <script>document.write(client.engine.khtml);</script></li>
        <li>client.engine.opera = <script>document.write(client.engine.opera);</script></li>
        <li>client.engine.ver = <script>document.write(client.engine.ver);</script></li>

    </ul>
    <h2>Browsers</h2>
    <ul>
        <li>client.browser.ie = <script>document.write(client.browser.ie);</script></li>
        <li>client.browser.safari = <script>document.write(client.browser.safari);</script></li>
        <li>client.browser.firefox = <script>document.write(client.browser.firefox);</script></li>
        <li>client.browser.konq = <script>document.write(client.browser.konq);</script></li>
        <li>client.browser.opera = <script>document.write(client.browser.opera);</script></li>
        <li>client.browser.chrome = <script>document.write(client.browser.chrome);</script></li>
        <li>client.browser.ver = <script>document.write(client.browser.ver);</script></li>
    </ul>
    
    <h2>System</h2>
    <ul>
        <li>client.system.win = <script>document.write(client.system.win);</script></li>
        <li>client.system.mac = <script>document.write(client.system.mac);</script></li>
        <li>client.system.x11 = <script>document.write(client.system.x11);</script></li>
        <li>client.system.iphone = <script>document.write(client.system.iphone);</script></li>
        <li>client.system.ipod = <script>document.write(client.system.ipod);</script></li>
        <li>client.system.ipad = <script>document.write(client.system.ipad);</script></li>
        <li>client.system.ios = <script>document.write(client.system.ios);</script></li>
        <li>client.system.android = <script>document.write(client.system.android);</script></li>
        <li>client.system.nokiaN = <script>document.write(client.system.nokiaN);</script></li>
        <li>client.system.winMobile = <script>document.write(client.system.winMobile);</script></li>
        <li>client.system.wii = <script>document.write(client.system.wii);</script></li>
        <li>client.system.ps = <script>document.write(client.system.ps);</script></li>    
    </ul>    
</body>
</html>
```
client.js源码：
```js
// client.js
var client = function(){

    //rendering engines
    var engine = {            
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,

        //complete version
        ver: null  
    };
    
    //browsers
    var browser = {
        
        //browsers
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,

        //specific version
        ver: null
    };

    
    //platform/device/OS
    var system = {
        win: false,
        mac: false,
        x11: false,
        
        //mobile devices
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,
        
        //game systems
        wii: false,
        ps: false 
    };    

    //detect rendering engines/browsers
    var ua = navigator.userAgent;    
    if (window.opera){
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);
        
        //figure out if it's Chrome or Safari
        if (/Chrome\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        } else {
            //approximate version
            var safariVersion = 1;
            if (engine.webkit < 100){
                safariVersion = 1;
            } else if (engine.webkit < 312){
                safariVersion = 1.2;
            } else if (engine.webkit < 412){
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }   
            
            browser.safari = browser.ver = safariVersion;        
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){    
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);
        
        //determine if it's Firefox
        if (/Firefox\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)){    
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }
    
    //detect browsers
    browser.ie = engine.ie;
    browser.opera = engine.opera;
    

    //detect platform
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

    //detect windows operating systems
    if (system.win){
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if (RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    default:
                        system.win = "NT";
                        break;                
                }                            
            } else if (RegExp["$1"] == "9x"){
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
    }
    
    //mobile devices
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;
    
    //windows mobile
    if (system.win == "CE"){
        system.winMobile = system.win;
    } else if (system.win == "Ph"){
        if(/Windows Phone OS (\d+.\d+)/.test(ua)){;
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }
    
    
    //determine iOS version
    if (system.mac && ua.indexOf("Mobile") > -1){
        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
            system.ios = parseFloat(RegExp.$1.replace("_", "."));
        } else {
            system.ios = 2;  //can't really detect - so guess
        }
    }
    
    //determine Android version
    if (/Android (\d+\.\d+)/.test(ua)){
        system.android = parseFloat(RegExp.$1);
    }
    
    //gaming systems
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);
    
    //return it
    return {
        engine:     engine,
        browser:    browser,
        system:     system        
    };

}();

```