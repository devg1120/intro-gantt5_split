import Controller from '@ember/controller';
import { set, get } from '@ember/object';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';


export default class IndexController extends Controller {
  @tracked  dayWidth ;

//  constructor() {
//    super(...arguments);
  constructor(owner, args) {
    super(owner, args);

    this.dayWidth = 20;
    let today = new Date();
    today.setDate(today.getDate() - 10);
    this.viewStartDate = today;
    this.viewEndDate = null;
    this.headerTitle = 'Project/Job';
  }

    @action
    zoom(value) {
      let newDayWidth = Math.max(1, parseInt(get(this, 'dayWidth')) + parseInt(value) );
      console.log("zoom dayWidth",newDayWidth )
      set(this, 'dayWidth', newDayWidth);
      //this.dayWidth = newDayWidth;
    }

    @action
    collapse(project) {
      project.toggleProperty('collapsed');
    }

    @action
    datesChanged(job, start, end, action) {
      // console.log(job, 'job ref');
      // console.log(start, 'start changed');
      // console.log(end, 'end changed');
      // console.log(action, 'action');

      set(job, 'dateStart', start); // NOT NEEDED -> is set directly
      set(job, 'dateEnd', end);
    }

}
