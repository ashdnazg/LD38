
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
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 12, "filename": "/.gitignore"}, {"audio": 0, "start": 12, "crunched": 0, "end": 177, "filename": "/conf.lua"}, {"audio": 0, "start": 177, "crunched": 0, "end": 1579, "filename": "/main.lua"}, {"audio": 0, "start": 1579, "crunched": 0, "end": 1629, "filename": "/README.md"}, {"audio": 0, "start": 1629, "crunched": 0, "end": 2697, "filename": "/3rdparty/LICENSE"}, {"audio": 0, "start": 2697, "crunched": 0, "end": 18560, "filename": "/3rdparty/lume.lua"}, {"audio": 0, "start": 18560, "crunched": 0, "end": 24407, "filename": "/3rdparty/middleclass.lua"}, {"audio": 0, "start": 24407, "crunched": 0, "end": 37353, "filename": "/3rdparty/tween.lua"}, {"audio": 0, "start": 37353, "crunched": 0, "end": 261945, "filename": "/assets/font/OpenSans-Bold.ttf"}, {"audio": 0, "start": 261945, "crunched": 0, "end": 479305, "filename": "/assets/font/OpenSans-Regular.ttf"}, {"audio": 0, "start": 479305, "crunched": 0, "end": 606521, "filename": "/assets/img/background.png"}, {"audio": 0, "start": 606521, "crunched": 0, "end": 608352, "filename": "/assets/img/background.xcf"}, {"audio": 0, "start": 608352, "crunched": 0, "end": 613386, "filename": "/assets/img/clock.png"}, {"audio": 0, "start": 613386, "crunched": 0, "end": 634514, "filename": "/assets/img/defeat.png"}, {"audio": 0, "start": 634514, "crunched": 0, "end": 635258, "filename": "/assets/img/enter.png"}, {"audio": 0, "start": 635258, "crunched": 0, "end": 653057, "filename": "/assets/img/intro.png"}, {"audio": 0, "start": 653057, "crunched": 0, "end": 653550, "filename": "/assets/img/options_bar.png"}, {"audio": 0, "start": 653550, "crunched": 0, "end": 671756, "filename": "/assets/img/victory.png"}, {"audio": 0, "start": 671756, "crunched": 0, "end": 674205, "filename": "/assets/img/generic props/alien.png"}, {"audio": 0, "start": 674205, "crunched": 0, "end": 677959, "filename": "/assets/img/generic props/babysit.png"}, {"audio": 0, "start": 677959, "crunched": 0, "end": 680399, "filename": "/assets/img/generic props/bankrobber.png"}, {"audio": 0, "start": 680399, "crunched": 0, "end": 698876, "filename": "/assets/img/generic props/cthulhu.png"}, {"audio": 0, "start": 698876, "crunched": 0, "end": 701080, "filename": "/assets/img/generic props/fred.png"}, {"audio": 0, "start": 701080, "crunched": 0, "end": 730641, "filename": "/assets/img/generic props/hurricane.png"}, {"audio": 0, "start": 730641, "crunched": 0, "end": 747652, "filename": "/assets/img/generic props/planecrash.png"}, {"audio": 0, "start": 747652, "crunched": 0, "end": 751172, "filename": "/assets/img/generic props/queen.png"}, {"audio": 0, "start": 751172, "crunched": 0, "end": 775251, "filename": "/assets/img/generic props/shark.png"}, {"audio": 0, "start": 775251, "crunched": 0, "end": 777962, "filename": "/assets/img/generic props/somme.png"}, {"audio": 0, "start": 777962, "crunched": 0, "end": 778867, "filename": "/assets/img/locations/background.png"}, {"audio": 0, "start": 778867, "crunched": 0, "end": 788386, "filename": "/assets/img/locations/bathroom.png"}, {"audio": 0, "start": 788386, "crunched": 0, "end": 794530, "filename": "/assets/img/locations/desert_island.png"}, {"audio": 0, "start": 794530, "crunched": 0, "end": 803954, "filename": "/assets/img/locations/north_pole.png"}, {"audio": 0, "start": 803954, "crunched": 0, "end": 935939, "filename": "/assets/img/locations/prison.png"}, {"audio": 0, "start": 935939, "crunched": 0, "end": 956359, "filename": "/assets/img/locations/school.png"}, {"audio": 0, "start": 956359, "crunched": 0, "end": 982729, "filename": "/assets/img/locations/space.png"}, {"audio": 0, "start": 982729, "crunched": 0, "end": 990403, "filename": "/assets/img/locations/tennis_court.png"}, {"audio": 0, "start": 990403, "crunched": 0, "end": 1122983, "filename": "/assets/img/locations/volcano.png"}, {"audio": 0, "start": 1122983, "crunched": 0, "end": 1184425, "filename": "/assets/img/locations/western_front.png"}, {"audio": 0, "start": 1184425, "crunched": 0, "end": 1185735, "filename": "/assets/img/person/person.png"}, {"audio": 0, "start": 1185735, "crunched": 0, "end": 1234379, "filename": "/assets/img/person/person.xcf"}, {"audio": 0, "start": 1234379, "crunched": 0, "end": 1237187, "filename": "/assets/img/person/person1.png"}, {"audio": 0, "start": 1237187, "crunched": 0, "end": 1239212, "filename": "/assets/img/person/person2.png"}, {"audio": 0, "start": 1239212, "crunched": 0, "end": 1241286, "filename": "/assets/img/person/person3.png"}, {"audio": 0, "start": 1241286, "crunched": 0, "end": 1244237, "filename": "/assets/img/person/person4.png"}, {"audio": 0, "start": 1244237, "crunched": 0, "end": 1247075, "filename": "/assets/img/person/person5.png"}, {"audio": 0, "start": 1247075, "crunched": 0, "end": 1249241, "filename": "/assets/img/person/person6.png"}, {"audio": 0, "start": 1249241, "crunched": 0, "end": 1251148, "filename": "/assets/img/person/person7.png"}, {"audio": 0, "start": 1251148, "crunched": 0, "end": 1253935, "filename": "/assets/img/person/person8.png"}, {"audio": 0, "start": 1253935, "crunched": 0, "end": 1256597, "filename": "/assets/img/person/person9.png"}, {"audio": 0, "start": 1256597, "crunched": 0, "end": 1258400, "filename": "/assets/img/personprop/anon.png"}, {"audio": 0, "start": 1258400, "crunched": 0, "end": 1260879, "filename": "/assets/img/personprop/movie.png"}, {"audio": 0, "start": 1260879, "crunched": 0, "end": 1262715, "filename": "/assets/img/personprop/personprop1.png"}, {"audio": 0, "start": 1262715, "crunched": 0, "end": 1264531, "filename": "/assets/img/personprop/personprop2.png"}, {"audio": 0, "start": 1264531, "crunched": 0, "end": 1266666, "filename": "/assets/img/personprop/personprop3.png"}, {"audio": 0, "start": 1266666, "crunched": 0, "end": 1269134, "filename": "/assets/img/personprop/personprop4.png"}, {"audio": 0, "start": 1269134, "crunched": 0, "end": 1272191, "filename": "/assets/img/personprop/personprop5.png"}, {"audio": 0, "start": 1272191, "crunched": 0, "end": 1274894, "filename": "/assets/img/personprop/personprop6.png"}, {"audio": 0, "start": 1274894, "crunched": 0, "end": 1296007, "filename": "/assets/img/personprop/personprop7.png"}, {"audio": 0, "start": 1296007, "crunched": 0, "end": 1298174, "filename": "/assets/img/personprop/yodel.png"}, {"audio": 0, "start": 1298174, "crunched": 0, "end": 1302753, "filename": "/assets/img/street/damn_alien.png"}, {"audio": 0, "start": 1302753, "crunched": 0, "end": 1307363, "filename": "/assets/img/street/damn_girl.png"}, {"audio": 0, "start": 1307363, "crunched": 0, "end": 1312509, "filename": "/assets/img/street/damn_marry.png"}, {"audio": 0, "start": 1312509, "crunched": 0, "end": 1317225, "filename": "/assets/img/street/damn_somo.png"}, {"audio": 0, "start": 1317225, "crunched": 0, "end": 1322302, "filename": "/assets/img/street/damn_super.png"}, {"audio": 0, "start": 1322302, "crunched": 0, "end": 1326537, "filename": "/assets/img/street/damn_tall_1.png"}, {"audio": 0, "start": 1326537, "crunched": 0, "end": 1330905, "filename": "/assets/img/street/damn_tall_2.png"}, {"audio": 0, "start": 1330905, "crunched": 0, "end": 1337528, "filename": "/assets/img/street/damn_with_parachute.png"}, {"audio": 0, "start": 1337528, "crunched": 0, "end": 1343202, "filename": "/assets/img/street/man_left.png"}, {"audio": 0, "start": 1343202, "crunched": 0, "end": 1349875, "filename": "/assets/img/street/man_left_tap.png"}, {"audio": 0, "start": 1349875, "crunched": 0, "end": 1356936, "filename": "/assets/img/street/man_mad.png"}, {"audio": 0, "start": 1356936, "crunched": 0, "end": 1364901, "filename": "/assets/img/street/man_mad_tap.png"}, {"audio": 0, "start": 1364901, "crunched": 0, "end": 1370689, "filename": "/assets/img/street/man_right.png"}, {"audio": 0, "start": 1370689, "crunched": 0, "end": 1377245, "filename": "/assets/img/street/man_right_tap.png"}, {"audio": 0, "start": 1377245, "crunched": 0, "end": 1385291, "filename": "/assets/img/street/man_stand.png"}, {"audio": 0, "start": 1385291, "crunched": 0, "end": 1394242, "filename": "/assets/img/street/man_stand_tap.png"}, {"audio": 1, "start": 1394242, "crunched": 0, "end": 1412408, "filename": "/assets/sound/ask1.ogg"}, {"audio": 1, "start": 1412408, "crunched": 0, "end": 1431824, "filename": "/assets/sound/ask2.ogg"}, {"audio": 1, "start": 1431824, "crunched": 0, "end": 1458757, "filename": "/assets/sound/ask3.ogg"}, {"audio": 1, "start": 1458757, "crunched": 0, "end": 1480323, "filename": "/assets/sound/ask4.ogg"}, {"audio": 1, "start": 1480323, "crunched": 0, "end": 1505923, "filename": "/assets/sound/ask5.ogg"}, {"audio": 1, "start": 1505923, "crunched": 0, "end": 1529503, "filename": "/assets/sound/ask6.ogg"}, {"audio": 1, "start": 1529503, "crunched": 0, "end": 1560799, "filename": "/assets/sound/ask7.ogg"}, {"audio": 1, "start": 1560799, "crunched": 0, "end": 1580487, "filename": "/assets/sound/ask8.ogg"}, {"audio": 1, "start": 1580487, "crunched": 0, "end": 1600558, "filename": "/assets/sound/ask9.ogg"}, {"audio": 1, "start": 1600558, "crunched": 0, "end": 1632962, "filename": "/assets/sound/hey1.ogg"}, {"audio": 1, "start": 1632962, "crunched": 0, "end": 1645101, "filename": "/assets/sound/hey2.ogg"}, {"audio": 1, "start": 1645101, "crunched": 0, "end": 1672188, "filename": "/assets/sound/hey3.ogg"}, {"audio": 1, "start": 1672188, "crunched": 0, "end": 1693918, "filename": "/assets/sound/hey4.ogg"}, {"audio": 1, "start": 1693918, "crunched": 0, "end": 1724448, "filename": "/assets/sound/hey5.ogg"}, {"audio": 1, "start": 1724448, "crunched": 0, "end": 1749897, "filename": "/assets/sound/hey6.ogg"}, {"audio": 1, "start": 1749897, "crunched": 0, "end": 1793559, "filename": "/assets/sound/hey7.ogg"}, {"audio": 1, "start": 1793559, "crunched": 0, "end": 1821183, "filename": "/assets/sound/hey8.ogg"}, {"audio": 1, "start": 1821183, "crunched": 0, "end": 1854937, "filename": "/assets/sound/hey9.ogg"}, {"audio": 1, "start": 1854937, "crunched": 0, "end": 2438134, "filename": "/assets/sound/music.ogg"}, {"audio": 1, "start": 2438134, "crunched": 0, "end": 2459800, "filename": "/assets/sound/no1.ogg"}, {"audio": 1, "start": 2459800, "crunched": 0, "end": 2473005, "filename": "/assets/sound/no2.ogg"}, {"audio": 1, "start": 2473005, "crunched": 0, "end": 2488408, "filename": "/assets/sound/no3.ogg"}, {"audio": 1, "start": 2488408, "crunched": 0, "end": 2508694, "filename": "/assets/sound/no4.ogg"}, {"audio": 1, "start": 2508694, "crunched": 0, "end": 2537470, "filename": "/assets/sound/no5.ogg"}, {"audio": 1, "start": 2537470, "crunched": 0, "end": 2569630, "filename": "/assets/sound/no6.ogg"}, {"audio": 1, "start": 2569630, "crunched": 0, "end": 2602282, "filename": "/assets/sound/no7.ogg"}, {"audio": 1, "start": 2602282, "crunched": 0, "end": 2620901, "filename": "/assets/sound/no8.ogg"}, {"audio": 1, "start": 2620901, "crunched": 0, "end": 2641460, "filename": "/assets/sound/no9.ogg"}, {"audio": 1, "start": 2641460, "crunched": 0, "end": 2654326, "filename": "/assets/sound/yes1.ogg"}, {"audio": 1, "start": 2654326, "crunched": 0, "end": 2672748, "filename": "/assets/sound/yes2.ogg"}, {"audio": 1, "start": 2672748, "crunched": 0, "end": 2695755, "filename": "/assets/sound/yes3.ogg"}, {"audio": 1, "start": 2695755, "crunched": 0, "end": 2727222, "filename": "/assets/sound/yes4.ogg"}, {"audio": 1, "start": 2727222, "crunched": 0, "end": 2756344, "filename": "/assets/sound/yes5.ogg"}, {"audio": 1, "start": 2756344, "crunched": 0, "end": 2784904, "filename": "/assets/sound/yes6.ogg"}, {"audio": 1, "start": 2784904, "crunched": 0, "end": 2815209, "filename": "/assets/sound/yes7.ogg"}, {"audio": 1, "start": 2815209, "crunched": 0, "end": 2837679, "filename": "/assets/sound/yes8.ogg"}, {"audio": 1, "start": 2837679, "crunched": 0, "end": 2869076, "filename": "/assets/sound/yes9.ogg"}, {"audio": 0, "start": 2869076, "crunched": 0, "end": 2869714, "filename": "/lib/defeat.lua"}, {"audio": 0, "start": 2869714, "crunched": 0, "end": 2871676, "filename": "/lib/game.lua"}, {"audio": 0, "start": 2871676, "crunched": 0, "end": 2879971, "filename": "/lib/options.lua"}, {"audio": 0, "start": 2879971, "crunched": 0, "end": 2880560, "filename": "/lib/pregame.lua"}, {"audio": 0, "start": 2880560, "crunched": 0, "end": 2893382, "filename": "/lib/scene.lua"}, {"audio": 0, "start": 2893382, "crunched": 0, "end": 2895168, "filename": "/lib/sounds.lua"}, {"audio": 0, "start": 2895168, "crunched": 0, "end": 2899594, "filename": "/lib/street.lua"}, {"audio": 0, "start": 2899594, "crunched": 0, "end": 2900722, "filename": "/lib/timer.lua"}, {"audio": 0, "start": 2900722, "crunched": 0, "end": 2901369, "filename": "/lib/victory.lua"}], "remote_package_size": 2901369, "package_uuid": "d7c00571-7e4b-4f6c-a2a1-19595316d5df"});

})();
