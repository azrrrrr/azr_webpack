require('./src/style.css')

document.write('entry')

document.write('<br/>')

document.write(require('./src/module'))

import $ from 'jquery';

console.log($)

document.write('<br/>')

const moment = require('moment');
document.write(moment().locale('zh-cn').format('LLLL'));

export default function() {
  document.write('entry==> export')
}
