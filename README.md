# node-loading [![Build status](https://travis-ci.com/alcidesqueiroz/node-loading.svg?branch=master)](https://travis-ci.com/alcidesqueiroz/node-loading)

> 🕶  Superb loadings for Node console apps.

<img src="https://gist.githubusercontent.com/alcidesqueiroz/c3d6c6edc559194bc37a2c464a21768d/raw/49d978a017db73a276511683832d94f6c0be0cbd/node-loading-logo.png" width="300" />

A set of loading animations for terminal apps written in Node.

## Install

With npm:
```
$ npm install --save node-loading
```

With Yarn:
```
$ yarn add node-loading
```

## Usage

```javascript
const { DeterminateBar } = require('node-loading');
const loading = DeterminateBar();
loading.start();
loading.message = 'Doing something nice...';

let progress = 0;
const intervalId = setInterval(() => {
  loading.setProgress(++progress);

  if (progress === 50) loading.message = 'Calculating things...';

  if (progress === 100) {
    loading.stop();
    clearInterval(intervalId);
  }
}, 100);

```

## Colors

As shown below, it's possible to define custom colors for both loading animations. Node-loading accepts these colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white` and `gray` (or `grey`).

## API

Node-loading has two different loading animations: `DeterminateBar` and `IndeterminateBar`.

### DeterminateBar

A loading bar that goes from 0% to 100% and is ideal for showing that a specific quantity of progress has occurred.

<img src="https://gist.githubusercontent.com/alcidesqueiroz/c3d6c6edc559194bc37a2c464a21768d/raw/49d978a017db73a276511683832d94f6c0be0cbd/node-loading-determinate-bar.gif" width="800" />

#### DeterminateBar([options])

##### options
- **stream**: The stream to write the output. Accepted values: `STDERR` (default) and `STDOUT`.
- **row**: The index of the row where the bar should be rendered.
- **completedColor**: The color for the part that represents the completed quantity (default: 'green').
- **remainingColor**: The color for the part that represents the remaining quantity (default: 'gray').
- **messageColor**: The color for the message (default: the value of `completedColor`).
- **width**: The width (in columns) of the loading animation (default: the full console width).

#### instance.start()
Starts the animation.

#### instance.stop()
Stops the animation and clears the line.

#### instance.setProgress(progress)
Sets the progress (a number between `0` and `100`);

#### instance.message
The message to be shown below the bar.


### IndeterminateBar

A loading bar that has no specific amount of progress indicated.

<img src="https://gist.githubusercontent.com/alcidesqueiroz/c3d6c6edc559194bc37a2c464a21768d/raw/49d978a017db73a276511683832d94f6c0be0cbd/node-loading-indeterminate-bar.gif" width="800" />

#### IndeterminateBar([options])

##### options

- **stream**: The stream to write the output. Accepted values: `STDERR` (default) and `STDOUT`.
- **row**: The index of the row where the bar should be rendered.
- **foregroundColor**: The bar foreground color (default: 'cyan').
- **backgroundColor**: The bar background color (default: 'gray').
- **messageColor**: The color for the message (default: the value of `completedColor`).
- **width**: The width (in columns) of the loading animation (default: the full console width).

#### instance.start()
Starts the animation.

#### instance.stop()
Stops the animation and clears the line.

#### instance.message
The message to be shown below the bar.

#### instance.speed
A number from 1 to 5 that controls the animation speed.

## Author

Alcides Queiroz Aguiar

- Website: [www.alcidesqueiroz.com](https://www.alcidesqueiroz.com)
- Medium: [@alcidesqueiroz](https://medium.com/@alcidesqueiroz)
- Twitter: [alcidesqueiroz](https://twitter.com/alcidesqueiroz)
- Behance [alcidesqueiroz](https://behance.net/alcidesqueiroz)
- Stack Overflow: [http://is.gd/aqanso](http://stackoverflow.com/users/1295666/alcides-queiroz-aguiar)
- E-mail: alcidesqueiroz &lt;at&gt; gmail

## License

This code is free to use under the terms of the [MIT License](LICENSE.md).
