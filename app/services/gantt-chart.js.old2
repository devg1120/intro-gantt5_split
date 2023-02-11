import Service from '@ember/service';
import { isNone } from '@ember/utils';
import EmberObject from '@ember/object';
import { alias } from '@ember/object/computed';
import dateUtil from '../utils/date-util';
//import MinMaxChildDatesMixin from '../mixins/min-max-child-dates-mixin';

import { computed, get, set } from '@ember/object';
import { mapBy, max, min } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';

const jobTypes = [
  {
    title: 'Concept',
    color: '#d84599',
  },
  {
    title: 'Design',
    color: '#71b5a0',
  },
  {
    title: 'Programming',
    color: '#e5ce42',
  },
];

export default class GanttChartService extends Service {
	/*
  mixin(map) {
    map['title'] = 'empty';
    map['collapsed'] = false;
    map['jobs'] = alias('childs');

    map['child'] = [];

    map['childsStart'] = mapBy('childs', 'dateStart');
    map['minStart'] = min('childsStart');
    map['childsEnd'] = mapBy('childs', 'dateEnd');
    map['maxEnd'] = max('childsEnd');

    map['minStartDate'] = computed('minStart', function () {
      let start = this.minStart;
      if (typeof start === 'number') {
        let newdate = new Date(start);
        newdate.setUTCHours(0, 0, 0, 0);
        return newdate;
      }
      return start;
    });
    map['minStartDate'] = 'A';

    map['maxEndDate'] = computed('maxEnd', function () {
      let end = this.maxEnd;
      if (typeof end === 'number') {
        let newdate = new Date(end);
        newdate.setUTCHours(0, 0, 0, 0);
        return newdate;
      }
      return end;
    });

    map['maxEndDate'] = 'D';
  }
*/

  getTest3() {
    class Project {
      title = 'empty';
      childs = [];
      collapsed = false;
      childProject = null;

      @alias('childs') jobs;

      @mapBy('childs', 'dateStart') childsStart;
      @min('childsStart') minStart;

      @mapBy('childs', 'dateEnd') childsEnd;
      @max('childsEnd') maxEnd;

      //@tracked minStartDate;
      //@tracked maxEndDate;

      constructor(title) {
        set(this, 'title', title);
      }

      set childs(value) {
        set(this, 'childs', value);
      }
      set minStartDate(date) {
        set(this, 'minStartDate', date);
      }
      set maxEndDate(date) {
        set(this, 'maxEndDate', date);
      }

      @computed('minStart')
      get minStartDate() {
        let start = this.minStart;
        if (typeof start === 'number') {
          let newdate = new Date(start);
          newdate.setUTCHours(0, 0, 0, 0);
          return newdate;
        }
        return start;
      }

      @computed('maxEnd')
      get maxEndDate() {
        let end = this.maxEnd;
        if (typeof end === 'number') {
          let newdate = new Date(end);
          newdate.setUTCHours(0, 0, 0, 0);
          return newdate;
        }
        return end;
      }
    }

    let projects = new Array();  ///     honnbann 
    let today = new Date();
    let types = jobTypes;
    // PT1
    var childpj = new Project('sub project');
    childpj.jobs = [
      {
        isSubProj: false,
        title: types[0].title,
        color: types[0].color,
        dateStart: dateUtil.datePlusDays(today, 3),
        dateEnd: dateUtil.datePlusDays(today, 6),
      },
      {
        isSubProj: false,
        title: types[1].title,
        color: types[1].color,
        dateStart: dateUtil.datePlusDays(today, 7),
        dateEnd: dateUtil.datePlusDays(today, 10),
      },
    ];


    var pj = new Project('ACoca Cola Logo');
    pj.jobs = [
      {
        isSubProj: false,
        title: types[0].title,
        color: types[0].color,
        dateStart: dateUtil.datePlusDays(today, 3),
        dateEnd: dateUtil.datePlusDays(today, 6),
      },
      {
        isSubProj: true,
        childpj: childpj,
        dateStart: dateUtil.datePlusDays(today, 3),
        dateEnd: dateUtil.datePlusDays(today, 10),
      },
      {
        isSubProj: false,
        title: types[1].title,
        color: types[1].color,
        dateStart: dateUtil.datePlusDays(today, 7),
        dateEnd: dateUtil.datePlusDays(today, 10),
      },
      {
        isSubProj: false,
        title: types[0].title + ' - second round',
        color: types[0].color,
        dateStart: dateUtil.datePlusDays(today, 12),
        dateEnd: dateUtil.datePlusDays(today, 17),
      },
      {
        isSubProj: false,
        title: types[1].title + ' - second round',
        color: types[1].color,
        dateStart: dateUtil.datePlusDays(today, 14),
        dateEnd: dateUtil.datePlusDays(today, 20),
      },
    ];
    projects.push(pj);


    // PT2
    var pj = new Project('Coca Cola Website');
    let todayAfter = dateUtil.datePlusDays(today, 15);
    pj.jobs = [
      {
        isSubProj: false,
        title: types[0].title,
        color: types[0].color,
        dateStart: dateUtil.datePlusDays(todayAfter, 0),
        dateEnd: dateUtil.datePlusDays(todayAfter, 20),
      },
      {
        isSubProj: false,
        title: types[1].title,
        color: types[1].color,
        dateStart: dateUtil.datePlusDays(todayAfter, 3),
        dateEnd: dateUtil.datePlusDays(todayAfter, 25),
      },
      {
        isSubProj: false,
        title: types[2].title,
        color: types[2].color,
        dateStart: dateUtil.datePlusDays(todayAfter, 7),
        dateEnd: dateUtil.datePlusDays(todayAfter, 30),
      },
    ];
    projects.push(pj);

    // PT3
    var childpj1 = new Project('sub project 2');
    childpj1.jobs = [
      {
        isSubProj: false,
        title: types[0].title,
        color: types[0].color,
        dateStart: dateUtil.datePlusDays(today, 3),
        dateEnd: dateUtil.datePlusDays(today, 6),
      },
      {
        isSubProj: false,
        title: types[1].title,
        color: types[1].color,
        dateStart: dateUtil.datePlusDays(today, 7),
        dateEnd: dateUtil.datePlusDays(today, 10),
      },
    ];
    var childpj2 = new Project('sub project 1');
    childpj2.jobs = [
      {
        isSubProj: false,
        title: types[0].title,
        color: types[0].color,
        dateStart: dateUtil.datePlusDays(today, 3),
        dateEnd: dateUtil.datePlusDays(today, 6),
      },
      {
        isSubProj: true,
        childpj: childpj1,
        dateStart: dateUtil.datePlusDays(today, 3),
        dateEnd: dateUtil.datePlusDays(today, 10),
      },
      {
        isSubProj: false,
        title: types[1].title,
        color: types[1].color,
        dateStart: dateUtil.datePlusDays(today, 7),
        dateEnd: dateUtil.datePlusDays(today, 10),
      },
    ];

    var pj = new Project('System dev');
    let todayAfter2 = dateUtil.datePlusDays(today, 20);
    pj.jobs = [
      {
        isSubProj: false,
        title: types[0].title,
        color: types[0].color,
        dateStart: dateUtil.datePlusDays(todayAfter2, 0),
        dateEnd: dateUtil.datePlusDays(todayAfter2, 10),
      },
      {
        isSubProj: false,
        title: types[1].title,
        color: types[1].color,
        dateStart: dateUtil.datePlusDays(todayAfter2, 5),
        dateEnd: dateUtil.datePlusDays(todayAfter2, 15),
      },
      {
        isSubProj: false,
        title: types[2].title,
        color: types[2].color,
        dateStart: dateUtil.datePlusDays(todayAfter2, 17),
        dateEnd: dateUtil.datePlusDays(todayAfter2, 24),
      },
      {
        isSubProj: true,
        childpj: childpj2,
        dateStart: dateUtil.datePlusDays(today, 3),
        dateEnd: dateUtil.datePlusDays(today, 10),
      },
      
    ];
    projects.push(pj);
    return projects;
  }

  getDataScenario1() {
    let projects = [];
    let today = new Date();
    let types = jobTypes;

    // let intelligent project object
    let ProjectObject = EmberObject.extend(MinMaxChildDatesMixin, {
      title: 'empty',
      collapsed: false,
      jobs: alias('childs'),
    });

    // P1
    projects.push(
      ProjectObject.create({
        title: `Coca Cola Logo P1`,
        childs: [
          {
            title: types[0].title,
            color: types[0].color,
            dateStart: dateUtil.datePlusDays(today, 3),
            dateEnd: dateUtil.datePlusDays(today, 6),
          },
          {
            title: types[1].title,
            color: types[1].color,
            dateStart: dateUtil.datePlusDays(today, 7),
            dateEnd: dateUtil.datePlusDays(today, 10),
          },
          {
            title: types[0].title + ' - second round',
            color: types[0].color,
            dateStart: dateUtil.datePlusDays(today, 12),
            dateEnd: dateUtil.datePlusDays(today, 17),
          },
          {
            title: types[1].title + ' - second round',
            color: types[1].color,
            dateStart: dateUtil.datePlusDays(today, 14),
            dateEnd: dateUtil.datePlusDays(today, 20),
          },
        ],
      })
    );

    // P2 - web
    let todayAfter = dateUtil.datePlusDays(today, 15);
    projects.push(
      ProjectObject.create({
        title: `Coca Cola Website`,
        jobs: [
          {
            title: types[0].title,
            color: types[0].color,
            dateStart: dateUtil.datePlusDays(todayAfter, 0),
            dateEnd: dateUtil.datePlusDays(todayAfter, 20),
          },
          {
            title: types[1].title,
            color: types[1].color,
            dateStart: dateUtil.datePlusDays(todayAfter, 3),
            dateEnd: dateUtil.datePlusDays(todayAfter, 25),
          },
          {
            title: types[2].title,
            color: types[2].color,
            dateStart: dateUtil.datePlusDays(todayAfter, 7),
            dateEnd: dateUtil.datePlusDays(todayAfter, 30),
          },
        ],
      })
    );

    return { projects };
  }

  getRandomDemoData() {
    let projects = [];
    let today = new Date();

    // job-types with color
    let types = jobTypes;

    // let intelligent project object
    let ProjectObject = EmberObject.extend(MinMaxChildDatesMixin, {
      title: 'empty',
      collapsed: false,
      jobs: alias('childs'),
    });

    // create some dummy content
    for (let i = 1; i <= 3; i++) {
      let jobs = [];
      let numJobs = Math.ceil(Math.random() * 8) + 2;
      let projectStart = this.getRandomDate(today, 20, false);

      // some jobs for each project
      for (let j = 1; j < numJobs; j++) {
        let jobStart = this.getRandomDate(projectStart);
        let jobType = types[j % 3];
        jobs.push({
          title: `${jobType.title} ${j}`,
          dateStart: jobStart,
          dateEnd: this.getRandomDate(jobStart),
          color: jobType.color,
        });
      }

      // intelligent project object creation
      projects.push(
        ProjectObject.create({
          title: `Project ${i}`,
          jobs: jobs,
        })
      );
    }

    // console.log(projects, 'projects');
    return { projects };
  }

  getRandomDate(date, maxDays, allowBefore) {
    allowBefore = isNone(allowBefore) ? false : allowBefore;
    maxDays = maxDays || 30;

    let newDate = new Date(date.getTime());
    newDate.setUTCHours(0, 0, 0, 0);
    let randomDays = Math.ceil(Math.random() * maxDays);

    if (allowBefore) {
      randomDays -= Math.ceil(Math.random() * 15);
    }

    newDate.setDate(newDate.getDate() + randomDays);

    return newDate;
  }
}
