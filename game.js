
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
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 11, "filename": "/.gitignore"}, {"audio": 0, "start": 11, "crunched": 0, "end": 169, "filename": "/conf.lua"}, {"audio": 0, "start": 169, "crunched": 0, "end": 1518, "filename": "/main.lua"}, {"audio": 0, "start": 1518, "crunched": 0, "end": 1566, "filename": "/README.md"}, {"audio": 0, "start": 1566, "crunched": 0, "end": 2614, "filename": "/3rdparty/LICENSE"}, {"audio": 0, "start": 2614, "crunched": 0, "end": 17705, "filename": "/3rdparty/lume.lua"}, {"audio": 0, "start": 17705, "crunched": 0, "end": 23382, "filename": "/3rdparty/middleclass.lua"}, {"audio": 0, "start": 23382, "crunched": 0, "end": 35961, "filename": "/3rdparty/tween.lua"}, {"audio": 0, "start": 35961, "crunched": 0, "end": 260553, "filename": "/assets/font/OpenSans-Bold.ttf"}, {"audio": 0, "start": 260553, "crunched": 0, "end": 477913, "filename": "/assets/font/OpenSans-Regular.ttf"}, {"audio": 0, "start": 477913, "crunched": 0, "end": 605129, "filename": "/assets/img/background.png"}, {"audio": 0, "start": 605129, "crunched": 0, "end": 610163, "filename": "/assets/img/clock.png"}, {"audio": 0, "start": 610163, "crunched": 0, "end": 631291, "filename": "/assets/img/defeat.png"}, {"audio": 0, "start": 631291, "crunched": 0, "end": 632035, "filename": "/assets/img/enter.png"}, {"audio": 0, "start": 632035, "crunched": 0, "end": 649834, "filename": "/assets/img/intro.png"}, {"audio": 0, "start": 649834, "crunched": 0, "end": 650327, "filename": "/assets/img/options_bar.png"}, {"audio": 0, "start": 650327, "crunched": 0, "end": 668533, "filename": "/assets/img/victory.png"}, {"audio": 0, "start": 668533, "crunched": 0, "end": 670982, "filename": "/assets/img/generic props/alien.png"}, {"audio": 0, "start": 670982, "crunched": 0, "end": 674736, "filename": "/assets/img/generic props/babysit.png"}, {"audio": 0, "start": 674736, "crunched": 0, "end": 677176, "filename": "/assets/img/generic props/bankrobber.png"}, {"audio": 0, "start": 677176, "crunched": 0, "end": 695653, "filename": "/assets/img/generic props/cthulhu.png"}, {"audio": 0, "start": 695653, "crunched": 0, "end": 697857, "filename": "/assets/img/generic props/fred.png"}, {"audio": 0, "start": 697857, "crunched": 0, "end": 727418, "filename": "/assets/img/generic props/hurricane.png"}, {"audio": 0, "start": 727418, "crunched": 0, "end": 744429, "filename": "/assets/img/generic props/planecrash.png"}, {"audio": 0, "start": 744429, "crunched": 0, "end": 747949, "filename": "/assets/img/generic props/queen.png"}, {"audio": 0, "start": 747949, "crunched": 0, "end": 772028, "filename": "/assets/img/generic props/shark.png"}, {"audio": 0, "start": 772028, "crunched": 0, "end": 774739, "filename": "/assets/img/generic props/somme.png"}, {"audio": 0, "start": 774739, "crunched": 0, "end": 775644, "filename": "/assets/img/locations/background.png"}, {"audio": 0, "start": 775644, "crunched": 0, "end": 785163, "filename": "/assets/img/locations/bathroom.png"}, {"audio": 0, "start": 785163, "crunched": 0, "end": 791307, "filename": "/assets/img/locations/desert_island.png"}, {"audio": 0, "start": 791307, "crunched": 0, "end": 800731, "filename": "/assets/img/locations/north_pole.png"}, {"audio": 0, "start": 800731, "crunched": 0, "end": 932716, "filename": "/assets/img/locations/prison.png"}, {"audio": 0, "start": 932716, "crunched": 0, "end": 953136, "filename": "/assets/img/locations/school.png"}, {"audio": 0, "start": 953136, "crunched": 0, "end": 979506, "filename": "/assets/img/locations/space.png"}, {"audio": 0, "start": 979506, "crunched": 0, "end": 984848, "filename": "/assets/img/locations/tajmahal.png"}, {"audio": 0, "start": 984848, "crunched": 0, "end": 992522, "filename": "/assets/img/locations/tennis_court.png"}, {"audio": 0, "start": 992522, "crunched": 0, "end": 1125102, "filename": "/assets/img/locations/volcano.png"}, {"audio": 0, "start": 1125102, "crunched": 0, "end": 1186544, "filename": "/assets/img/locations/western_front.png"}, {"audio": 0, "start": 1186544, "crunched": 0, "end": 1187854, "filename": "/assets/img/person/person.png"}, {"audio": 0, "start": 1187854, "crunched": 0, "end": 1190662, "filename": "/assets/img/person/person1.png"}, {"audio": 0, "start": 1190662, "crunched": 0, "end": 1192687, "filename": "/assets/img/person/person2.png"}, {"audio": 0, "start": 1192687, "crunched": 0, "end": 1194761, "filename": "/assets/img/person/person3.png"}, {"audio": 0, "start": 1194761, "crunched": 0, "end": 1197712, "filename": "/assets/img/person/person4.png"}, {"audio": 0, "start": 1197712, "crunched": 0, "end": 1200550, "filename": "/assets/img/person/person5.png"}, {"audio": 0, "start": 1200550, "crunched": 0, "end": 1202716, "filename": "/assets/img/person/person6.png"}, {"audio": 0, "start": 1202716, "crunched": 0, "end": 1204623, "filename": "/assets/img/person/person7.png"}, {"audio": 0, "start": 1204623, "crunched": 0, "end": 1207410, "filename": "/assets/img/person/person8.png"}, {"audio": 0, "start": 1207410, "crunched": 0, "end": 1210072, "filename": "/assets/img/person/person9.png"}, {"audio": 0, "start": 1210072, "crunched": 0, "end": 1211875, "filename": "/assets/img/personprop/anon.png"}, {"audio": 0, "start": 1211875, "crunched": 0, "end": 1214354, "filename": "/assets/img/personprop/movie.png"}, {"audio": 0, "start": 1214354, "crunched": 0, "end": 1216190, "filename": "/assets/img/personprop/personprop1.png"}, {"audio": 0, "start": 1216190, "crunched": 0, "end": 1218006, "filename": "/assets/img/personprop/personprop2.png"}, {"audio": 0, "start": 1218006, "crunched": 0, "end": 1220141, "filename": "/assets/img/personprop/personprop3.png"}, {"audio": 0, "start": 1220141, "crunched": 0, "end": 1222609, "filename": "/assets/img/personprop/personprop4.png"}, {"audio": 0, "start": 1222609, "crunched": 0, "end": 1225666, "filename": "/assets/img/personprop/personprop5.png"}, {"audio": 0, "start": 1225666, "crunched": 0, "end": 1228369, "filename": "/assets/img/personprop/personprop6.png"}, {"audio": 0, "start": 1228369, "crunched": 0, "end": 1249482, "filename": "/assets/img/personprop/personprop7.png"}, {"audio": 0, "start": 1249482, "crunched": 0, "end": 1251649, "filename": "/assets/img/personprop/yodel.png"}, {"audio": 0, "start": 1251649, "crunched": 0, "end": 1256228, "filename": "/assets/img/street/damn_alien.png"}, {"audio": 0, "start": 1256228, "crunched": 0, "end": 1260838, "filename": "/assets/img/street/damn_girl.png"}, {"audio": 0, "start": 1260838, "crunched": 0, "end": 1265984, "filename": "/assets/img/street/damn_marry.png"}, {"audio": 0, "start": 1265984, "crunched": 0, "end": 1270700, "filename": "/assets/img/street/damn_somo.png"}, {"audio": 0, "start": 1270700, "crunched": 0, "end": 1275777, "filename": "/assets/img/street/damn_super.png"}, {"audio": 0, "start": 1275777, "crunched": 0, "end": 1280012, "filename": "/assets/img/street/damn_tall_1.png"}, {"audio": 0, "start": 1280012, "crunched": 0, "end": 1284380, "filename": "/assets/img/street/damn_tall_2.png"}, {"audio": 0, "start": 1284380, "crunched": 0, "end": 1291003, "filename": "/assets/img/street/damn_with_parachute.png"}, {"audio": 0, "start": 1291003, "crunched": 0, "end": 1296677, "filename": "/assets/img/street/man_left.png"}, {"audio": 0, "start": 1296677, "crunched": 0, "end": 1303350, "filename": "/assets/img/street/man_left_tap.png"}, {"audio": 0, "start": 1303350, "crunched": 0, "end": 1310411, "filename": "/assets/img/street/man_mad.png"}, {"audio": 0, "start": 1310411, "crunched": 0, "end": 1318376, "filename": "/assets/img/street/man_mad_tap.png"}, {"audio": 0, "start": 1318376, "crunched": 0, "end": 1324164, "filename": "/assets/img/street/man_right.png"}, {"audio": 0, "start": 1324164, "crunched": 0, "end": 1330720, "filename": "/assets/img/street/man_right_tap.png"}, {"audio": 0, "start": 1330720, "crunched": 0, "end": 1338766, "filename": "/assets/img/street/man_stand.png"}, {"audio": 0, "start": 1338766, "crunched": 0, "end": 1347717, "filename": "/assets/img/street/man_stand_tap.png"}, {"audio": 1, "start": 1347717, "crunched": 0, "end": 1365883, "filename": "/assets/sound/ask1.ogg"}, {"audio": 1, "start": 1365883, "crunched": 0, "end": 1385299, "filename": "/assets/sound/ask2.ogg"}, {"audio": 1, "start": 1385299, "crunched": 0, "end": 1412232, "filename": "/assets/sound/ask3.ogg"}, {"audio": 1, "start": 1412232, "crunched": 0, "end": 1433798, "filename": "/assets/sound/ask4.ogg"}, {"audio": 1, "start": 1433798, "crunched": 0, "end": 1459398, "filename": "/assets/sound/ask5.ogg"}, {"audio": 1, "start": 1459398, "crunched": 0, "end": 1482978, "filename": "/assets/sound/ask6.ogg"}, {"audio": 1, "start": 1482978, "crunched": 0, "end": 1514274, "filename": "/assets/sound/ask7.ogg"}, {"audio": 1, "start": 1514274, "crunched": 0, "end": 1533962, "filename": "/assets/sound/ask8.ogg"}, {"audio": 1, "start": 1533962, "crunched": 0, "end": 1554033, "filename": "/assets/sound/ask9.ogg"}, {"audio": 1, "start": 1554033, "crunched": 0, "end": 1586437, "filename": "/assets/sound/hey1.ogg"}, {"audio": 1, "start": 1586437, "crunched": 0, "end": 1598576, "filename": "/assets/sound/hey2.ogg"}, {"audio": 1, "start": 1598576, "crunched": 0, "end": 1625663, "filename": "/assets/sound/hey3.ogg"}, {"audio": 1, "start": 1625663, "crunched": 0, "end": 1647393, "filename": "/assets/sound/hey4.ogg"}, {"audio": 1, "start": 1647393, "crunched": 0, "end": 1677923, "filename": "/assets/sound/hey5.ogg"}, {"audio": 1, "start": 1677923, "crunched": 0, "end": 1703372, "filename": "/assets/sound/hey6.ogg"}, {"audio": 1, "start": 1703372, "crunched": 0, "end": 1747034, "filename": "/assets/sound/hey7.ogg"}, {"audio": 1, "start": 1747034, "crunched": 0, "end": 1774658, "filename": "/assets/sound/hey8.ogg"}, {"audio": 1, "start": 1774658, "crunched": 0, "end": 1808412, "filename": "/assets/sound/hey9.ogg"}, {"audio": 1, "start": 1808412, "crunched": 0, "end": 2391609, "filename": "/assets/sound/music.ogg"}, {"audio": 1, "start": 2391609, "crunched": 0, "end": 2413275, "filename": "/assets/sound/no1.ogg"}, {"audio": 1, "start": 2413275, "crunched": 0, "end": 2426480, "filename": "/assets/sound/no2.ogg"}, {"audio": 1, "start": 2426480, "crunched": 0, "end": 2441883, "filename": "/assets/sound/no3.ogg"}, {"audio": 1, "start": 2441883, "crunched": 0, "end": 2462169, "filename": "/assets/sound/no4.ogg"}, {"audio": 1, "start": 2462169, "crunched": 0, "end": 2490945, "filename": "/assets/sound/no5.ogg"}, {"audio": 1, "start": 2490945, "crunched": 0, "end": 2523105, "filename": "/assets/sound/no6.ogg"}, {"audio": 1, "start": 2523105, "crunched": 0, "end": 2555757, "filename": "/assets/sound/no7.ogg"}, {"audio": 1, "start": 2555757, "crunched": 0, "end": 2574376, "filename": "/assets/sound/no8.ogg"}, {"audio": 1, "start": 2574376, "crunched": 0, "end": 2594935, "filename": "/assets/sound/no9.ogg"}, {"audio": 1, "start": 2594935, "crunched": 0, "end": 2607801, "filename": "/assets/sound/yes1.ogg"}, {"audio": 1, "start": 2607801, "crunched": 0, "end": 2626223, "filename": "/assets/sound/yes2.ogg"}, {"audio": 1, "start": 2626223, "crunched": 0, "end": 2649230, "filename": "/assets/sound/yes3.ogg"}, {"audio": 1, "start": 2649230, "crunched": 0, "end": 2680697, "filename": "/assets/sound/yes4.ogg"}, {"audio": 1, "start": 2680697, "crunched": 0, "end": 2709819, "filename": "/assets/sound/yes5.ogg"}, {"audio": 1, "start": 2709819, "crunched": 0, "end": 2738379, "filename": "/assets/sound/yes6.ogg"}, {"audio": 1, "start": 2738379, "crunched": 0, "end": 2768684, "filename": "/assets/sound/yes7.ogg"}, {"audio": 1, "start": 2768684, "crunched": 0, "end": 2791154, "filename": "/assets/sound/yes8.ogg"}, {"audio": 1, "start": 2791154, "crunched": 0, "end": 2822551, "filename": "/assets/sound/yes9.ogg"}, {"audio": 0, "start": 2822551, "crunched": 0, "end": 2823238, "filename": "/lib/defeat.lua"}, {"audio": 0, "start": 2823238, "crunched": 0, "end": 2825272, "filename": "/lib/game.lua"}, {"audio": 0, "start": 2825272, "crunched": 0, "end": 2833563, "filename": "/lib/options.lua"}, {"audio": 0, "start": 2833563, "crunched": 0, "end": 2834121, "filename": "/lib/pregame.lua"}, {"audio": 0, "start": 2834121, "crunched": 0, "end": 2846730, "filename": "/lib/scene.lua"}, {"audio": 0, "start": 2846730, "crunched": 0, "end": 2848454, "filename": "/lib/sounds.lua"}, {"audio": 0, "start": 2848454, "crunched": 0, "end": 2852803, "filename": "/lib/street.lua"}, {"audio": 0, "start": 2852803, "crunched": 0, "end": 2853952, "filename": "/lib/timer.lua"}, {"audio": 0, "start": 2853952, "crunched": 0, "end": 2854713, "filename": "/lib/victory.lua"}], "remote_package_size": 2854713, "package_uuid": "b365a382-af34-475e-8b94-3aa46ccfef91"});

})();
