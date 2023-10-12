import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Issue } from '../issue';
import { Observable } from 'rxjs';

@Component({
  selector: 'zd-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuesListComponent {
  @Input() issues$!: Observable<Issue[]>;
  @Input() selectedIssueId: number | undefined;

  @Output() selectIssue = new EventEmitter<Issue>;

  constructor() {
    console.log('IssueListTile Component Instantiated!');
  }

  select(issue: Issue) {
    this.selectIssue.emit(issue);
  }

  //TODO: This method can be moved to the Issues class for DDD approach
  identifyIssue(index: number, issue: Issue){
    return issue.id; 
 }
}
