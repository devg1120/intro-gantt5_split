import Component from '@glimmer/component';
//import {observer,get,set} from '@ember/object';
import {debounce} from '@ember/runloop';
import {htmlSafe} from '@ember/template';
import {isArray, A} from "@ember/array";
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {computed,observer,get,set,setProperties} from '@ember/object';


import dateUtil from '../utils/date-util';

export default class GanttLineInlineChildsComponent extends Component {

  layout;
  classNames= ['gantt-line-inline-childs'];

  job= null;

  chart= null;
  parentLine= null;
  childLines= null;

  stripeWidth= 3;

  debounceTime= 0;
  @tracked dateStart;
  @tracked dateEnd;
  @tracked periods;
  @tracked minStartDate;
  @tracked maxEndDate;
  @tracked project;

  constructor(owner, args) {
    super(owner, args);
    this.chart = args.chart;
    this.childLines = args.childLines;
    this.parentLine = args.parentLine;
     
    //this.job = args.job;
    this.project = args.project;

    //console.log(this.job);
    //this.dateStart = this.project.dateStart;
    //this.dateEnd   = this.project.dateEnd;
    this.dateStart = this.project.minStartDate;
    this.dateEnd   = this.project.maxEndDate;
    //this.color   = this.project.color;
    //this.style   = args.style;
    //this.title   = args.title;
    this.setTopLinefunc = args.setTopLine;
    this.setTopLinefunc(this);
    this.calculatePeriods();
  }

/*
  didInsertElement() {
    this._super(...arguments);
    this.calculatePeriods();
  },
*/

//  @tracked childLines= null;
//  @tracked periods= null;
/*
  reloadPeriods= observer('parentLine.{dateStart,dateEnd,dayWidth}','childLines','childLines.@each.{dateStart,dateEnd,color}', function() {
    debounce(this, this.calculatePeriods, get(this, 'debounceTime'));
  });
*/

  //@computed('parentLine.{dateStart,dateEnd,dayWidth}','childLines','childLines.@each.{dateStart,dateEnd,color}') 
  @computed('this.dateStart','this.dateEnd','this.project', 'this.project.minStartDate', 'this.project.maxEndDate') 
  get periods() {
    console.log("get periods()");
    //console.log(this.periods);
    // go through all jobs and generate compound child elements
    let chart = get(this, 'chart'),
        childs = get(this, 'childLines'),
        //start = get(this, 'parentLine.dateStart'),
        //end = get(this, 'parentLine.dateEnd');
        start = get(this, 'project.minStartDate'),
        end = get(this, 'project.maxEndDate');

     //console.dir(childs);
     console.log("parentLine start:",start);
     console.log("parentLine end:",end);
    // generate period segments
    let periods = dateUtil.mergeTimePeriods(childs, start, end);

    // calculate width of segments
    if (periods && periods.length > 0) {
      periods.forEach(period => {
        period.width = chart.dateToOffset(period.dateEnd, period.dateStart, true);
        period.background = this.getBackgroundStyle(period.childs);
        period.style = htmlSafe(`width:${period.width}px;background:${period.background};`);
      });
    }

  //  return periods;
  return {};

  }


  calculatePeriods() {
    console.log("calculatePeriods()");

  /*
    console.log("calculatePeriods()");
    //console.log(this.periods);
    // go through all jobs and generate compound child elements
    let chart = get(this, 'chart'),
        childs = get(this, 'childLines'),
        //start = get(this, 'parentLine.dateStart'),
        //end = get(this, 'parentLine.dateEnd');
        start = get(this, 'project.minStartDate'),
        end = get(this, 'project.maxEndDate');

     //console.dir(childs);
     console.log("parentLine start:",start);
     console.log("parentLine end:",end);
    // generate period segments
    let periods = dateUtil.mergeTimePeriods(childs, start, end);

    // calculate width of segments
    if (periods && periods.length > 0) {
      periods.forEach(period => {
        period.width = chart.dateToOffset(period.dateEnd, period.dateStart, true);
        period.background = this.getBackgroundStyle(period.childs);
        period.style = htmlSafe(`width:${period.width}px;background:${period.background};`);
      });
    }

    set(this, 'periods', periods);
    //this.periods= periods;
    console.log(this.periods);
*/
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
