var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
var utils = require('loader-utils');

module.exports = function() {
  // ...
};

module.exports.pitch = function(request) {
  this.addDependency(request);
  var query = utils.parseQuery(this.query);
  var compiler = createCompiler(this, request, {
    filename: utils.interpolateName(this, query.name, {}),
  });
  runCompiler(compiler, this.async());
};

function runCompiler(compiler, callback) {
  compiler.runAsChild(function(error, entries) {
    if (error) {
      callback(error);
    } else if (entries[0]){
      var url = entries[0].files[0];
      callback(null, getSource(url));;
    } else {
      callback(null, null);
    }
  });
}

function createCompiler(loader, request, options) {
  var compiler = getCompilation(loader).createChildCompiler('entry', options);
  var plugin = new SingleEntryPlugin(loader.context, '!!' + request, 'main')
  compiler.apply(plugin);

  var query = utils.parseQuery(loader.query);
  var ignoredPlugins = query.ignoredPlugins || [];

  if (query.plugins) {
    if (query.plugins === true) {
      loader.options.plugins
        .filter(mainPlugin => !ignoredPlugins.includes(mainPlugin.constructor.name))
        .forEach(mainPlugin => compiler.apply(mainPlugin));
    } else if (Array.isArray(query.plugins)) {
      query.plugins.forEach(pluginName => {
        loader.options.plugins
          .filter(mainPlugin => mainPlugin.constructor.name === pluginName)
          .forEach(mainPlugin => compiler.apply(mainPlugin));
      })
    }
  }

  var subCache = 'subcache ' + __dirname + ' ' + request;
  compiler.plugin('compilation', function(compilation) {
    if (!compilation.cache) {
      return;
    }
    if (!compilation.cache[subCache]) {
      compilation.cache[subCache] = {};
    }
    compilation.cache = compilation.cache[subCache];
  });
  return compiler;
}

function getSource(url) {
  return 'module.exports = __webpack_public_path__ + ' + JSON.stringify(url);
}

function getCompilation(loader) {
  return loader._compilation;
}
