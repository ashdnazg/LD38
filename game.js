
var Module;

if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'game.data';
    var REMOTE_PACKAGE_BASE = 'game.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                              Module['locateFile'](REMOTE_PACKAGE_BASE) :
                              ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onload = function(event) {
        var packageData = xhr.response;
        callback(packageData);
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', '3rdparty', true, true);
Module['FS_createPath']('/', 'assets', true, true);
Module['FS_createPath']('/assets', 'font', true, true);
Module['FS_createPath']('/assets', 'img', true, true);
Module['FS_createPath']('/assets/img', 'generic props', true, true);
Module['FS_createPath']('/assets/img', 'locations', true, true);
Module['FS_createPath']('/assets/img', 'person', true, true);
Module['FS_createPath']('/assets/img', 'personprop', true, true);
Module['FS_createPath']('/assets/img', 'street', true, true);
Module['FS_createPath']('/assets', 'sound', true, true);
Module['FS_createPath']('/', 'lib', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        Module['removeRunDependency']('fp ' + that.name);

        this.requests[this.name] = null;
      },
    };

        var files = metadata.files;
        for (i = 0; i < files.length; ++i) {
          new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio).open('GET', files[i].filename);
        }

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
        // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
        // (we may be allocating before malloc is ready, during startup).
        if (Module['SPLIT_MEMORY']) Module.printErr('warning: you should run the file packager with --no-heap-copy when SPLIT_MEMORY is used, otherwise copying into the heap may fail due to the splitting');
        var ptr = Module['getMemory'](byteArray.length);
        Module['HEAPU8'].set(byteArray, ptr);
        DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
  
          var files = metadata.files;
          for (i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }
              Module['removeRunDependency']('datafile_game.data');

    };
    Module['addRunDependency']('datafile_game.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

 }
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 11, "filename": "/.gitignore"}, {"audio": 0, "start": 11, "crunched": 0, "end": 169, "filename": "/conf.lua"}, {"audio": 0, "start": 169, "crunched": 0, "end": 1591, "filename": "/main.lua"}, {"audio": 0, "start": 1591, "crunched": 0, "end": 1639, "filename": "/README.md"}, {"audio": 0, "start": 1639, "crunched": 0, "end": 2687, "filename": "/3rdparty/LICENSE"}, {"audio": 0, "start": 2687, "crunched": 0, "end": 17778, "filename": "/3rdparty/lume.lua"}, {"audio": 0, "start": 17778, "crunched": 0, "end": 23455, "filename": "/3rdparty/middleclass.lua"}, {"audio": 0, "start": 23455, "crunched": 0, "end": 36034, "filename": "/3rdparty/tween.lua"}, {"audio": 0, "start": 36034, "crunched": 0, "end": 260626, "filename": "/assets/font/OpenSans-Bold.ttf"}, {"audio": 0, "start": 260626, "crunched": 0, "end": 477986, "filename": "/assets/font/OpenSans-Regular.ttf"}, {"audio": 0, "start": 477986, "crunched": 0, "end": 605202, "filename": "/assets/img/background.png"}, {"audio": 0, "start": 605202, "crunched": 0, "end": 610236, "filename": "/assets/img/clock.png"}, {"audio": 0, "start": 610236, "crunched": 0, "end": 631364, "filename": "/assets/img/defeat.png"}, {"audio": 0, "start": 631364, "crunched": 0, "end": 632108, "filename": "/assets/img/enter.png"}, {"audio": 0, "start": 632108, "crunched": 0, "end": 649907, "filename": "/assets/img/intro.png"}, {"audio": 0, "start": 649907, "crunched": 0, "end": 650400, "filename": "/assets/img/options_bar.png"}, {"audio": 0, "start": 650400, "crunched": 0, "end": 668606, "filename": "/assets/img/victory.png"}, {"audio": 0, "start": 668606, "crunched": 0, "end": 671055, "filename": "/assets/img/generic props/alien.png"}, {"audio": 0, "start": 671055, "crunched": 0, "end": 674809, "filename": "/assets/img/generic props/babysit.png"}, {"audio": 0, "start": 674809, "crunched": 0, "end": 677249, "filename": "/assets/img/generic props/bankrobber.png"}, {"audio": 0, "start": 677249, "crunched": 0, "end": 695726, "filename": "/assets/img/generic props/cthulhu.png"}, {"audio": 0, "start": 695726, "crunched": 0, "end": 697930, "filename": "/assets/img/generic props/fred.png"}, {"audio": 0, "start": 697930, "crunched": 0, "end": 727491, "filename": "/assets/img/generic props/hurricane.png"}, {"audio": 0, "start": 727491, "crunched": 0, "end": 744502, "filename": "/assets/img/generic props/planecrash.png"}, {"audio": 0, "start": 744502, "crunched": 0, "end": 748022, "filename": "/assets/img/generic props/queen.png"}, {"audio": 0, "start": 748022, "crunched": 0, "end": 772101, "filename": "/assets/img/generic props/shark.png"}, {"audio": 0, "start": 772101, "crunched": 0, "end": 774812, "filename": "/assets/img/generic props/somme.png"}, {"audio": 0, "start": 774812, "crunched": 0, "end": 775717, "filename": "/assets/img/locations/background.png"}, {"audio": 0, "start": 775717, "crunched": 0, "end": 785236, "filename": "/assets/img/locations/bathroom.png"}, {"audio": 0, "start": 785236, "crunched": 0, "end": 791380, "filename": "/assets/img/locations/desert_island.png"}, {"audio": 0, "start": 791380, "crunched": 0, "end": 800804, "filename": "/assets/img/locations/north_pole.png"}, {"audio": 0, "start": 800804, "crunched": 0, "end": 932789, "filename": "/assets/img/locations/prison.png"}, {"audio": 0, "start": 932789, "crunched": 0, "end": 953209, "filename": "/assets/img/locations/school.png"}, {"audio": 0, "start": 953209, "crunched": 0, "end": 979579, "filename": "/assets/img/locations/space.png"}, {"audio": 0, "start": 979579, "crunched": 0, "end": 984921, "filename": "/assets/img/locations/tajmahal.png"}, {"audio": 0, "start": 984921, "crunched": 0, "end": 992595, "filename": "/assets/img/locations/tennis_court.png"}, {"audio": 0, "start": 992595, "crunched": 0, "end": 1125175, "filename": "/assets/img/locations/volcano.png"}, {"audio": 0, "start": 1125175, "crunched": 0, "end": 1186617, "filename": "/assets/img/locations/western_front.png"}, {"audio": 0, "start": 1186617, "crunched": 0, "end": 1187927, "filename": "/assets/img/person/person.png"}, {"audio": 0, "start": 1187927, "crunched": 0, "end": 1190735, "filename": "/assets/img/person/person1.png"}, {"audio": 0, "start": 1190735, "crunched": 0, "end": 1192760, "filename": "/assets/img/person/person2.png"}, {"audio": 0, "start": 1192760, "crunched": 0, "end": 1194834, "filename": "/assets/img/person/person3.png"}, {"audio": 0, "start": 1194834, "crunched": 0, "end": 1197785, "filename": "/assets/img/person/person4.png"}, {"audio": 0, "start": 1197785, "crunched": 0, "end": 1200623, "filename": "/assets/img/person/person5.png"}, {"audio": 0, "start": 1200623, "crunched": 0, "end": 1202789, "filename": "/assets/img/person/person6.png"}, {"audio": 0, "start": 1202789, "crunched": 0, "end": 1204696, "filename": "/assets/img/person/person7.png"}, {"audio": 0, "start": 1204696, "crunched": 0, "end": 1207483, "filename": "/assets/img/person/person8.png"}, {"audio": 0, "start": 1207483, "crunched": 0, "end": 1210145, "filename": "/assets/img/person/person9.png"}, {"audio": 0, "start": 1210145, "crunched": 0, "end": 1211948, "filename": "/assets/img/personprop/anon.png"}, {"audio": 0, "start": 1211948, "crunched": 0, "end": 1214427, "filename": "/assets/img/personprop/movie.png"}, {"audio": 0, "start": 1214427, "crunched": 0, "end": 1216263, "filename": "/assets/img/personprop/personprop1.png"}, {"audio": 0, "start": 1216263, "crunched": 0, "end": 1218079, "filename": "/assets/img/personprop/personprop2.png"}, {"audio": 0, "start": 1218079, "crunched": 0, "end": 1220214, "filename": "/assets/img/personprop/personprop3.png"}, {"audio": 0, "start": 1220214, "crunched": 0, "end": 1222682, "filename": "/assets/img/personprop/personprop4.png"}, {"audio": 0, "start": 1222682, "crunched": 0, "end": 1225739, "filename": "/assets/img/personprop/personprop5.png"}, {"audio": 0, "start": 1225739, "crunched": 0, "end": 1228442, "filename": "/assets/img/personprop/personprop6.png"}, {"audio": 0, "start": 1228442, "crunched": 0, "end": 1249555, "filename": "/assets/img/personprop/personprop7.png"}, {"audio": 0, "start": 1249555, "crunched": 0, "end": 1251722, "filename": "/assets/img/personprop/yodel.png"}, {"audio": 0, "start": 1251722, "crunched": 0, "end": 1256301, "filename": "/assets/img/street/damn_alien.png"}, {"audio": 0, "start": 1256301, "crunched": 0, "end": 1260911, "filename": "/assets/img/street/damn_girl.png"}, {"audio": 0, "start": 1260911, "crunched": 0, "end": 1266057, "filename": "/assets/img/street/damn_marry.png"}, {"audio": 0, "start": 1266057, "crunched": 0, "end": 1270773, "filename": "/assets/img/street/damn_somo.png"}, {"audio": 0, "start": 1270773, "crunched": 0, "end": 1275850, "filename": "/assets/img/street/damn_super.png"}, {"audio": 0, "start": 1275850, "crunched": 0, "end": 1280085, "filename": "/assets/img/street/damn_tall_1.png"}, {"audio": 0, "start": 1280085, "crunched": 0, "end": 1284453, "filename": "/assets/img/street/damn_tall_2.png"}, {"audio": 0, "start": 1284453, "crunched": 0, "end": 1291076, "filename": "/assets/img/street/damn_with_parachute.png"}, {"audio": 0, "start": 1291076, "crunched": 0, "end": 1296750, "filename": "/assets/img/street/man_left.png"}, {"audio": 0, "start": 1296750, "crunched": 0, "end": 1303423, "filename": "/assets/img/street/man_left_tap.png"}, {"audio": 0, "start": 1303423, "crunched": 0, "end": 1310484, "filename": "/assets/img/street/man_mad.png"}, {"audio": 0, "start": 1310484, "crunched": 0, "end": 1318449, "filename": "/assets/img/street/man_mad_tap.png"}, {"audio": 0, "start": 1318449, "crunched": 0, "end": 1324237, "filename": "/assets/img/street/man_right.png"}, {"audio": 0, "start": 1324237, "crunched": 0, "end": 1330793, "filename": "/assets/img/street/man_right_tap.png"}, {"audio": 0, "start": 1330793, "crunched": 0, "end": 1338839, "filename": "/assets/img/street/man_stand.png"}, {"audio": 0, "start": 1338839, "crunched": 0, "end": 1347790, "filename": "/assets/img/street/man_stand_tap.png"}, {"audio": 1, "start": 1347790, "crunched": 0, "end": 1365956, "filename": "/assets/sound/ask1.ogg"}, {"audio": 1, "start": 1365956, "crunched": 0, "end": 1385372, "filename": "/assets/sound/ask2.ogg"}, {"audio": 1, "start": 1385372, "crunched": 0, "end": 1412305, "filename": "/assets/sound/ask3.ogg"}, {"audio": 1, "start": 1412305, "crunched": 0, "end": 1433871, "filename": "/assets/sound/ask4.ogg"}, {"audio": 1, "start": 1433871, "crunched": 0, "end": 1459471, "filename": "/assets/sound/ask5.ogg"}, {"audio": 1, "start": 1459471, "crunched": 0, "end": 1483051, "filename": "/assets/sound/ask6.ogg"}, {"audio": 1, "start": 1483051, "crunched": 0, "end": 1514347, "filename": "/assets/sound/ask7.ogg"}, {"audio": 1, "start": 1514347, "crunched": 0, "end": 1534035, "filename": "/assets/sound/ask8.ogg"}, {"audio": 1, "start": 1534035, "crunched": 0, "end": 1554106, "filename": "/assets/sound/ask9.ogg"}, {"audio": 1, "start": 1554106, "crunched": 0, "end": 1586510, "filename": "/assets/sound/hey1.ogg"}, {"audio": 1, "start": 1586510, "crunched": 0, "end": 1598649, "filename": "/assets/sound/hey2.ogg"}, {"audio": 1, "start": 1598649, "crunched": 0, "end": 1625736, "filename": "/assets/sound/hey3.ogg"}, {"audio": 1, "start": 1625736, "crunched": 0, "end": 1647466, "filename": "/assets/sound/hey4.ogg"}, {"audio": 1, "start": 1647466, "crunched": 0, "end": 1677996, "filename": "/assets/sound/hey5.ogg"}, {"audio": 1, "start": 1677996, "crunched": 0, "end": 1703445, "filename": "/assets/sound/hey6.ogg"}, {"audio": 1, "start": 1703445, "crunched": 0, "end": 1747107, "filename": "/assets/sound/hey7.ogg"}, {"audio": 1, "start": 1747107, "crunched": 0, "end": 1774731, "filename": "/assets/sound/hey8.ogg"}, {"audio": 1, "start": 1774731, "crunched": 0, "end": 1808485, "filename": "/assets/sound/hey9.ogg"}, {"audio": 1, "start": 1808485, "crunched": 0, "end": 2391682, "filename": "/assets/sound/music.ogg"}, {"audio": 1, "start": 2391682, "crunched": 0, "end": 2413348, "filename": "/assets/sound/no1.ogg"}, {"audio": 1, "start": 2413348, "crunched": 0, "end": 2426553, "filename": "/assets/sound/no2.ogg"}, {"audio": 1, "start": 2426553, "crunched": 0, "end": 2441956, "filename": "/assets/sound/no3.ogg"}, {"audio": 1, "start": 2441956, "crunched": 0, "end": 2462242, "filename": "/assets/sound/no4.ogg"}, {"audio": 1, "start": 2462242, "crunched": 0, "end": 2491018, "filename": "/assets/sound/no5.ogg"}, {"audio": 1, "start": 2491018, "crunched": 0, "end": 2523178, "filename": "/assets/sound/no6.ogg"}, {"audio": 1, "start": 2523178, "crunched": 0, "end": 2555830, "filename": "/assets/sound/no7.ogg"}, {"audio": 1, "start": 2555830, "crunched": 0, "end": 2574449, "filename": "/assets/sound/no8.ogg"}, {"audio": 1, "start": 2574449, "crunched": 0, "end": 2595008, "filename": "/assets/sound/no9.ogg"}, {"audio": 1, "start": 2595008, "crunched": 0, "end": 2607874, "filename": "/assets/sound/yes1.ogg"}, {"audio": 1, "start": 2607874, "crunched": 0, "end": 2626296, "filename": "/assets/sound/yes2.ogg"}, {"audio": 1, "start": 2626296, "crunched": 0, "end": 2649303, "filename": "/assets/sound/yes3.ogg"}, {"audio": 1, "start": 2649303, "crunched": 0, "end": 2680770, "filename": "/assets/sound/yes4.ogg"}, {"audio": 1, "start": 2680770, "crunched": 0, "end": 2709892, "filename": "/assets/sound/yes5.ogg"}, {"audio": 1, "start": 2709892, "crunched": 0, "end": 2738452, "filename": "/assets/sound/yes6.ogg"}, {"audio": 1, "start": 2738452, "crunched": 0, "end": 2768757, "filename": "/assets/sound/yes7.ogg"}, {"audio": 1, "start": 2768757, "crunched": 0, "end": 2791227, "filename": "/assets/sound/yes8.ogg"}, {"audio": 1, "start": 2791227, "crunched": 0, "end": 2822624, "filename": "/assets/sound/yes9.ogg"}, {"audio": 0, "start": 2822624, "crunched": 0, "end": 2823311, "filename": "/lib/defeat.lua"}, {"audio": 0, "start": 2823311, "crunched": 0, "end": 2825345, "filename": "/lib/game.lua"}, {"audio": 0, "start": 2825345, "crunched": 0, "end": 2833636, "filename": "/lib/options.lua"}, {"audio": 0, "start": 2833636, "crunched": 0, "end": 2834194, "filename": "/lib/pregame.lua"}, {"audio": 0, "start": 2834194, "crunched": 0, "end": 2846803, "filename": "/lib/scene.lua"}, {"audio": 0, "start": 2846803, "crunched": 0, "end": 2848527, "filename": "/lib/sounds.lua"}, {"audio": 0, "start": 2848527, "crunched": 0, "end": 2852876, "filename": "/lib/street.lua"}, {"audio": 0, "start": 2852876, "crunched": 0, "end": 2854025, "filename": "/lib/timer.lua"}, {"audio": 0, "start": 2854025, "crunched": 0, "end": 2854786, "filename": "/lib/victory.lua"}], "remote_package_size": 2854786, "package_uuid": "ad3563f7-f5f0-435b-8b8e-4e1e8a4691bd"});

})();
