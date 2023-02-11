import Component from '@glimmer/component';


import { bind } from '@ember/runloop';
import { htmlSafe } from '@ember/template';
import {computed,get,set} from '@ember/object';
import {isEmpty} from '@ember/utils';
import {alias, or} from '@ember/object/computed';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import dateUtil from '../utils/date-util';


export default class ChildLineComponent extends Component {



  chart= null;

  parentLine= null;

  //dayWidth= alias('chart.dayWidth');
  @alias('chart.dayWidth') dayWidth;
  @alias('job.dateStart') dateStart;
  @alias('job.dateEnd') dateEnd;

  title= '';


  // collapsed: false, // use ember-bootstrap !

  color= null;

  isEditable= true;

  chartElement= null;

  barElement= null;

  onDateChange= null;

  titleStyle = null;

  classNames= ['gantt-line-wrap'];
  classNameBindings= ['isResizing','isMoving'];

  //@alias('job.dateStart') dateStart;
  //@alias('job.dateEnd') dateEnd;

  constructor(owner, args) {
    super(owner, args);
    //this.dateStart = args.job.dateStart;
    //this.dateEnd   = args.job.dateEnd;
    this.color   = args.job.color;
    this.chart   = args.chart;
    this.job   = args.job;
    this.project   = args.project;
    this.chartElement   = args.chartElement;
    this.onDataUpdate   = args.onDataUpdate;

  // let style = `left:${get(this, 'barOffset')}px;width:${get(this, 'barWidth')}px;`;
    this.child_stack = args.child_stack + 1;
    //this.titleStyle = "padding-left: 3px;";
    this.titleStyle = htmlSafe(`padding-left: ${(get(this,'child_stack')-1)*30}px;`);
    //console.log(this.chartElement) ;
    if (get(this, 'isEditable') && !this._handleMoveStart) {
      this._handleMoveStart = bind(this, this.activateMove);
      this._handleResizeLeft = bind(this, this.activateResizeLeft);
      this._handleResizeRight = bind(this, this.activateResizeRight);
      this._handleResizeMove = bind(this, this.resizeBar);
      this._handleFinish = bind(this, this.deactivateAll);
    }
   //this.didInsertElement();
  };


  //didInsertElement() {
  @action
  createElement(element_) {
    //console.log("createElement() {", element_);
    this.element = element_;


    // bar reference
    //let bar = this.element.querySelector('.gantt-line-bar');
    let bar = this.element.querySelector('.gantt-child-line-bar');
    set(this, 'barElement', bar);

    // chart reference
    //let chart = get(this, 'chart').element_;
    //let chart = this.chart.element_;
    //console.log(chart);
    //set(this, 'chartElement', chart);
    //console.log(this.chartElement);

    // below, only if editable
    if (!get(this, 'isEditable')) return;

    // register resize and drag handlers
    let barResizeL = this.element.querySelector('.bar-resize-l');
    let barResizeR = this.element.querySelector('.bar-resize-r');

    // resize
    barResizeL.addEventListener('mousedown', this._handleResizeLeft);
    barResizeR.addEventListener('mousedown', this._handleResizeRight);

    // move
    bar.addEventListener('mousedown', this._handleMoveStart);

    // resize/move
    document.addEventListener('mousemove', this._handleResizeMove);
    document.addEventListener('mouseup', this._handleFinish);


  };

/*
  willDestroyelement() {
    this._super(...arguments);

    if (!get(this, 'isEditable')) return;

    let bar = get(this, 'barElement');
    let barResizeL = bar.querySelector('.bar-resize-l');
    let barResizeR = bar.querySelector('.bar-resize-r');
    // let chart = document.querySelector('.gantt-chart-inner');

    // unregister resize and drag helpers
    bar.removeEventListener('mousedown', this._handleMoveStart);
    barResizeL.removeEventListener('mousedown', this._handleResizeLeft);
    barResizeR.removeEventListener('mousedown', this._handleResizeRight);
    document.removeEventListener('mousemove', this._handleResizeMove);
    document.removeEventListener('mouseup', this._handleFinish);
  },
*/

  @computed('dateStart', 'dayWidth','chart.viewStartDate')
  get barOffset(){
    //return get(this, 'chart').dateToOffset( get(this, 'dateStart') );
    return get(this, 'chart').dateToOffset( this.dateStart );
  }

  // width of bar on months
  @computed('dateStart', 'dateEnd', 'dayWidth') 
  get barWidth() {
    //return get(this, 'chart').dateToOffset( get(this, 'dateEnd'), get(this, 'dateStart'), true );
    return get(this, 'chart').dateToOffset( this.dateEnd, this.dateStart, true );
  }

  // styling for left/width

  @computed('barOffset','barWidth')
  get barStyle() {

    let style = `left:${get(this, 'barOffset')}px;width:${get(this, 'barWidth')}px;`;
    if (get(this, 'color')) {
      style+= `background-color:${get(this, 'color')}`;
    }
    //console.log(htmlSafe(style));
    return htmlSafe(style);
  }

  // TODO: title -> ?
  @computed('dateStart', 'dateEnd')
  get barTitle() {
    //let days = get(this, 'chart').dateToOffset( get(this, 'dateStart') ) / get(this, 'dayWidth');
    //let start = get(this, 'dateStart'),
    //    end = get(this, 'dateEnd');
    let days = get(this, 'chart').dateToOffset( this.dateStart  / this.dayWidth);
    let start = this.dateStart,
        end = this.dateEnd;

    if (start && end) {
      return `days: ${days} : `+start.toString()+' to '+end.toString();
    }
    return '';
  }


  /**
   * Get element offset to parent (including scroll)
   * TODO: use from util package or ember?
   *
   * @method offsetLeft
   * @param el
   * @protected
   */
  offsetLeft(el) {
    let rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    return rect.left + scrollLeft;
  };


  // RESIZING FUNCTIONS
  isEditing= or('isResizingLeft','isResizingRight','isMoving');
  isResizing= or('isResizingLeft','isResizingRight');
  isResizingLeft= false;
  isResizingRight= false;
  timelineOffset= 0;

  activateResizeLeft(){
    this.initTimlineOffset();
    set(this, 'isResizingLeft', true);
  };

  activateResizeRight(){
    this.initTimlineOffset();
    set(this, 'isResizingRight', true);
  };

  initTimlineOffset() {
    this.chartElement = this.chart.element_;
    let timelineElement = get(this, 'chartElement').querySelector('.gantt-line-timeline');
    set(this, 'timelineOffset', this.offsetLeft(timelineElement));
    set(this, 'movingMouseOffset', 0);
  };

  // MOVE FUNCTION
  isMoving= false;
  movingDays= 0;
  movingMouseOffset= 0;

  activateMove(e) {
    //console.log("activateMove");
    e.preventDefault();
    this.initTimlineOffset();

    // remember days-duration of line
    //let moveDays = Math.floor(Math.abs(get(this, 'dateStart').getTime() - get(this, 'dateEnd').getTime()) / 86400000);
    let moveDays = Math.floor(Math.abs(this.dateStart.getTime() - this.dateEnd.getTime()) / 86400000);

    // remember click-offset for adjusting mouse-to-bar
    let mouseOffset = e.clientX - this.offsetLeft(e.target);

    set(this, 'movingDays', moveDays);
    set(this, 'movingMouseOffset', mouseOffset);
    set(this, 'isMoving', true);

  };

  @action
  resizeBar(e) {
    if (this.isDestroyed) return;
    if (!get(this, 'isEditing')) return;
    e.preventDefault();

    // offset -> start/end-date
    let offsetLeft = (e.clientX - get(this, 'timelineOffset') - get(this, 'movingMouseOffset'));
    let dateOffset = get(this, 'chart').offsetToDate(offsetLeft);

    // resize left
    if (get(this, 'isResizingLeft')) {
      dateOffset = (dateOffset > get(this, 'dateEnd')) ? get(this, 'dateEnd') : dateOffset; // dont allow lower than start
      set(this, 'dateStart', dateOffset);
      set(this.job, 'dateStart', this.dateStart); 

    // resize right
    } else if (get(this, 'isResizingRight')) {
      //dateOffset = (dateOffset < get(this, 'dateStart')) ? get(this, 'dateStart') : dateOffset; // dont allow lower than start
      dateOffset = (dateOffset < this.dateStart) ? this.dateStart : dateOffset; // dont allow lower than start
      set(this, 'dateEnd', dateOffset);
      set(this.job, 'dateEnd', this.dateEnd);

    // move
    } else if (get(this, 'isMoving')) {
      let dateOffsetEnd = new Date(dateOffset.getTime() + (get(this, 'movingDays')*86400000));
      set(this, 'dateStart', dateOffset);
      set(this, 'dateEnd', dateOffsetEnd);
      set(this.job, 'dateStart', this.dateStart); 
      set(this.job, 'dateEnd', this.dateEnd);
    }

  };

  deactivateAll(){

    if (this.isDestroyed) return;

    // check if something happened on this line
   /*
    let action = '';
    if (get(this, 'isResizing')) {
      action = 'resize';

    } else if (get(this, 'isMoving')) {
      action = 'move';
    }
*/
    set(this, 'isResizingLeft', false);
    set(this, 'isResizingRight', false);
    set(this, 'isMoving', false);
/*
    if (!isEmpty(action)) {
      let callback = get(this, 'onDateChange');
      if (typeof callback === 'function') {
        callback(get(this, 'dateStart'), get(this, 'dateEnd'), action);
      }
    }
    */
      //set(this.job, 'dateStart', this.dateStart); 
      //set(this.job, 'dateEnd', this.dateEnd);
      //    console.log(this.project);
	  //
    //this.onDataUpdate(this.job, this.dateStart, this.dateEnd);
	 
    //this.onDataUpdate();

  }




}
