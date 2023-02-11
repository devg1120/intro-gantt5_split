import Component from '@glimmer/component';
import {observer,get,set} from '@ember/object';
import {debounce} from '@ember/runloop';
import {htmlSafe} from '@ember/template';
import {isArray, A} from "@ember/array";
import { tracked } from '@glimmer/tracking';

import dateUtil from '../utils/date-util';

export default class LineInlineChildsComponent extends Component {

  layout;
  classNames= ['gantt-line-inline-childs'];

  @tracked job= null;

  chart= null;
  parentLine= null;

  stripeWidth= 3;

  debounceTime= 0;

  constructor(owner, args) {
    super(owner, args);
    this.chart = args.chart;

    //console.log(this.chart);
    //this.childLines = args.childLines;
    //this.parentLine = args.parentLine;
     
    this.job = args.job;

    //console.log(this.job);
    this.dateStart = this.job.dateStart;
    this.dateEnd   = this.job.dateEnd; 
    this.color   = this.job.color;   
    //this.style   = args.style;   
    //this.title   = args.title;   
    //console.log(this.color)
    //console.log(this.style)
    //console.log(this.title)
    this.calculatePeriods();
    //console.log(this.periods);
  }

/*
  didInsertElement() {
    this._super(...arguments);
    this.calculatePeriods();
  },
*/

  childLines= null;
  periods= null;
  reloadPeriods= observer('parentLine.{dateStart,dateEnd,dayWidth}','childLines','childLines.@each.{dateStart,dateEnd,color}', function() {
    debounce(this, this.calculatePeriods, get(this, 'debounceTime'));
  });

  calculatePeriods() {

    // go through all jobs and generate compound child elements
   /*
    let chart = get(this, 'chart'),
        childs = get(this, 'childLines'),
        start = get(this, 'parentLine.dateStart'),
        end = get(this, 'parentLine.dateEnd');
   */
    let chart = get(this, 'chart'),
        childs = get(this, 'childLines'),
        start = get(this, 'dateStart'),
        end = get(this, 'dateEnd');
    // generate period segments
    //console.log(start);
    //console.log(end);
    //console.log(childs);
    let periods = dateUtil.mergeTimePeriods(childs, start, end);

    periods = [{
          dateStart: start,
          dateEnd: end,
	  //backgraund: this.color,
          childs: null
    }];
  

    // calculate width of segments
    if (periods && periods.length > 0) {
      periods.forEach(period => {
        period.width = this.chart.dateToOffset(period.dateEnd, period.dateStart, true);
        period.background = this.getBackgroundStyle(period.childs);
        period.style = htmlSafe(`width:${period.width}px;background:${period.background};`);
      });
    }

    //console.log(periods);
    set(this, 'periods', periods);
  };

  getBackgroundStyle(childs) {

    if (!isArray(childs) || childs.length === 0) {
      return 'transparent';
    }

    let colors = A(A(childs).getEach('color'));
    colors = colors.uniq(); // every color only once!
    colors = colors.sort(); // assure color-order always the same

    // single-color
    if (colors.length === 1) {
      return colors[0];
    }

    // multi-color
    let background = 'repeating-linear-gradient(90deg,'; // or 180? ;)
    let pxOffset = 0;
    let stripeWidth = get(this, 'stripeWidth');

    colors.forEach(color => {
      let nextOffset = pxOffset+stripeWidth;
      background+= `${color} ${pxOffset}px,${color} ${nextOffset}px,`;
      pxOffset = nextOffset;
    });

    background = background.substring(0, background.length-1) + ')';

    return background;
  };



}
