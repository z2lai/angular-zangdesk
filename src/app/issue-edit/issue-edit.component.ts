import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Issue } from '../issue';

@Component({
  selector: 'zd-issue-edit',
  templateUrl: './issue-edit.component.html',
  styleUrls: ['./issue-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueEditComponent {
  @Input() issue!: Issue;

  @Output() saveIssue = new EventEmitter<Issue>();
  @Output() deleteIssue = new EventEmitter<Issue>();
  @Output() addNewIssue = new EventEmitter<Issue>();
  
  constructor() {
    console.log('IssueEdit Component Instantiated!');
  }

  save() {
    this.saveIssue.emit(this.issue);
  }

  delete() {
    this.deleteIssue.emit(this.issue);
  }

  add() {
    this.addNewIssue.emit(this.issue);
  }

  ngOnInit() {
    console.log('IssueEdit Component Initialized!');
  }
}
