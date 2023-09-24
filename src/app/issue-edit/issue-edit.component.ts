import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Issue } from '../issue';

@Component({
  selector: 'zd-issue-edit',
  templateUrl: './issue-edit.component.html',
  styleUrls: ['./issue-edit.component.css']
})
export class IssueEditComponent {
  @Input() issue!: Issue;

  @Output() saveIssue = new EventEmitter<Issue>();
  @Output() deleteIssue = new EventEmitter<number>();
  
  constructor() {
    console.log('IssueEdit Component Instantiated!');
  }

  save(issue: Issue) {
    console.log(issue);
    this.saveIssue.emit(issue);
  }

  delete(id: number) {
    this.deleteIssue.emit(id);
  }
}
