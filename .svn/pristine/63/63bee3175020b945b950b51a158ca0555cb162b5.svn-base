
(async ()=> {
  try {
    var fs = require('fs');
    var os = require('os');
    if (os.platform() === 'darwin') {
      var content = null;
      var { exec } = require('child_process')

      try {
        content = fs.readFileSync('./node_modules/react-native-device-info/RNDeviceInfo/RNDeviceInfo.m', 'utf8');
        if (content && content.includes("UIWebView* webView = [[UIWebView alloc] initWithFrame:CGRectZero];") === true) {
          content = content.replace(
            "UIWebView* webView = [[UIWebView alloc] initWithFrame:CGRectZero];", 
            ""
          );
          content = content.replace(
            "return [webView stringByEvaluatingJavaScriptFromString:@\"navigator.userAgent\"];", 
            "return @\"not available\";"
          );
      
          fs.writeFileSync('./node_modules/react-native-device-info/RNDeviceInfo/RNDeviceInfo.m', content, { encoding: 'utf8' });
        }
      } catch (err) {
        console.log("Failed to patch file RNDeviceInfo.m")
      }

      try {
        content = fs.readFileSync('./node_modules/react-native-camera/ios/RNCamera.xcodeproj/project.pbxproj', 'utf8');
        if (content) {
          while (content.includes("\"$(SRCROOT)/../../../ios/**\",")) {
            content = content.replace(
              "\"$(SRCROOT)/../../../ios/**\",", 
              "\"$(SRCROOT)/../../../ios/Pods/Headers/Public/**\","
            );
          }
  
          fs.writeFileSync('./node_modules/react-native-camera/ios/RNCamera.xcodeproj/project.pbxproj', content, { encoding: 'utf8' });
        }
      } catch (err) {
        console.log("Failed to patch file project.pbxproj")
      }

      try {
        content = fs.readFileSync('./node_modules/react-native/React/Base/RCTModuleMethod.mm', 'utf8');
        if (content && content.includes("RCTReadString(input, \"__attribute__((__unused__))\")") === false) {
          content = content.replace(
            "RCTReadString(input, \"__attribute__((unused))\")", 
            "RCTReadString(input, \"__attribute__((unused))\") || RCTReadString(input, \"__attribute__((__unused__))\")"
          );
      
          fs.writeFileSync('./node_modules/react-native/React/Base/RCTModuleMethod.mm', content, {encoding: 'utf8'});
        }
      } catch (err) {
        console.log("Failed to patch file RCTModuleMethod.mm")
      }

      try {
        content = fs.readFileSync('./node_modules/realm/src/jsc/jsc_value.hpp', 'utf8');
        if (content && content.includes("default: return \"undefined\"") === false) {
          content = content.replace(
            "case kJSTypeUndefined: return \"undefined\";", 
            "case kJSTypeUndefined: return \"undefined\"; default: return \"undefined\";"
          );
      
          fs.writeFileSync('./node_modules/realm/src/jsc/jsc_value.hpp', content, {encoding: 'utf8'});
        }
      } catch (err) {
        console.log("Failed to patch file jsc_value.hpp")
      }

      await exec('cd ./node_modules/react-native/ && ./scripts/ios-install-third-party.sh && cd ./third-party/glog-0.3.4/ && ./configure && make && make install ', async (error, stdout, stderr) => {
        if (!error) {
          console.log('Installed third party dependecies...')

          try {
            content = fs.readFileSync('./node_modules/react-native/third-party/glog-0.3.4/src/signalhandler.cc', 'utf8');
            if (content && content.includes("return (void*)context->PC_FROM_UCONTEXT;") === true) {
              content = content.replace(
                "return (void*)context->PC_FROM_UCONTEXT;", 
                "return NULL;"
              );
          
              fs.writeFileSync('./node_modules/react-native/third-party/glog-0.3.4/src/signalhandler.cc', content, {encoding: 'utf8'});
            }
          } catch (err) {
            console.log("Failed to patch file signalhandler.cc")
          }

          await exec('cd ios && pod install')
          console.log('Post install configuration OK');
        } else {
          console.log(`error: ${error} , stdout: ${stdout}, stderr: ${stderr}`)
        }
      })
    }
    
  } catch(e) {
    console.log('Post install configuration KO');
    console.log(e.message);
  }
  
  return true;
})();
