# entry-loader

A [webpack](https://webpack.github.io/) loader that creates an entry chunk for a file.

## Installation

`npm install entry-loader`

## Usage

```javascript
// returns url for entry file
var url = require('entry-loader?name=file-[hash].js!./file');

// compiled entry file will use all plugins from main compiler
var url = require('entry-loader?name=file-[hash].js&plugins=true!./file');

// compiled entry file will use all plugins from main compiler except HtmlWebpackPlugin
var url = require('entry-loader?name=file-[hash].js&plugins=true&ignoredPlugins=["HtmlWebpackPlugin"]!./file');

// compiled entry file will use DllReferencePlugin plugin with configuration from main compiler
var url = require('entry-loader?name=file-[hash].js&plugins=["DllReferencePlugin"]!./file');
```

To make it easier to use entry-loader you can use `resolveLoader` configuration option:

```javascript
module.exports = {
  // ...
  resolveLoader: {
    alias: {
      entry: `entry-loader?${JSON.stringify({
        name: 'scripts/[name].js',
        // ...
      })}`
    }
  },
  // ...
};
```

```javascript
// Same as 'entry-loader?name=[name].js!./file'
var url = require('entry!./file');
```
