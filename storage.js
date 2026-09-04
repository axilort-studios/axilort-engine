/* Axilort Engine device storage bridge.
   Native packages should expose window.AxilortStorage with these async methods:
   read(path), write(path,data), list(path), mkdir(path), remove(path).
   All paths are relative to the app-private axilort-engine-data directory.
   No IndexedDB is used by this storage layer. */
(function(){
  const ROOT='axilort-engine-data';
  function native(){
    const s=window.AxilortStorage;
    if(!s) throw new Error('Axilort native storage bridge is not installed. Run the packaged device app.');
    return s;
  }
  window.AxilortDeviceStorage={
    root:ROOT,
    path(p=''){return p?ROOT+'/'+p.replace(/^\\/+|\\/+$/g,''):ROOT},
    async read(path){return native().read(path)},
    async write(path,data){return native().write(path,data)},
    async list(path=''){return native().list(path)},
    async mkdir(path){return native().mkdir(path)},
    async remove(path){return native().remove(path)},
    async ensure(){
      await native().mkdir(ROOT);
      await native().mkdir(ROOT+'/projects');
      try{await native().read(ROOT+'/setting.json')}catch(e){await native().write(ROOT+'/setting.json','{\n  "version": 1,\n  "theme": "dark",\n  "language": "en",\n  "firstRun": true\n}\n')}
      try{await native().read(ROOT+'/user-data.json')}catch(e){await native().write(ROOT+'/user-data.json','{\n  "version": 1,\n  "user": {},\n  "projects": []\n}\n')}
    }
  };
})();
