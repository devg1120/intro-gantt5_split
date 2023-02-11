import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import {computed,get,set} from '@ember/object';


export default class SubGanttLineTitleComponent extends Component {

  titleStyle = null;
  constructor(owner, args) {
    super(owner, args);
    this.child_stack = args.child_stack ;
    this.titleStyle = htmlSafe(`padding-left: ${(get(this,'child_stack')-1)*30}px;`);

  }


/*
 @action
 collapse(project) {
  //console.log("collapsed;", project.title,project.collapsed);
  // project.collapsed = !project.collapsed;
  // project.collapsed = true;
 }
*/

/*
 collapse() {
  console.log("collapsed;");
  // project.collapsed = !project.collapsed;
  // project.collapsed = true;

 }
*/

}
