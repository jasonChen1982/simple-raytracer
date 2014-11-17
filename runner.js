var fs = require('fs');
var srt = require('./index.js');
var Parser = require('./modules/scene-parser').Parser;
var Png = require('png').Png;

// Constants
var N_UNITS = 50;
var SCENE_PATH = './example-scenes/pokeball.rt'

var scene = srt.prepareScene(SCENE_PATH)

var tasks = srt.prepareTasks({
  split: N_UNITS, /* Number of tasks the job is going to be divided into */
  animation: false,
  width: scene.global.width,
  height: scene.global.height
});

// console.log('TASKS:', tasks);
// console.log('SCENE:', scene);

var rgb = rgb = new Buffer(scene.global.width * scene.global.height * 3);

var results = tasks.map(function(task) {
  return {
    begin_x: task.begin_x,
    end_x: task.end_x,
    begin_y: task.begin_y,
    end_y: task.end_y,
    animation: task.animation,
    data: srt.runRayTraceTask(scene, task)
  };
})


results.map(function (el) {
  for(var y = el.begin_y; y < el.end_y; y++) {
    for(var x = el.begin_x; x < el.end_x; x++) {
      var z = (x * scene.global.width + y) * 3;
      rgb[z] = el.data[i++];
      rgb[z+1] = el.data[i++];
      rgb[z+2] = el.data[i++];
    }
  }
});

var png = new Png(rgb, scene.global.width, scene.global.height, 'rgb');
fs.writeFileSync('./out.png', png.encodeSync().toString('binary'), 'binary');

