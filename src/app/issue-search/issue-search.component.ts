import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { IssueService } from '../issue.service';
import { Observable } from 'rxjs';
import { Issue } from '../issue';

@Component({
  selector: 'zd-issue-search',
  templateUrl: './issue-search.component.html',
  styleUrls: ['./issue-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueSearchComponent {
  @Output() searchEvent = new EventEmitter<Issue[]>();

  constructor(
    private issueService: IssueService
  ) { }

  getIssuesByName(name: string) {
    let issues: Observable<Issue[]>;
    if (!name.trim()) {
      issues = this.issueService.getIssues();
    } else {
      issues = this.issueService.searchIssuesByName(name);
    }
    issues.subscribe(Issues => {
      this.searchEvent.emit(Issues);
    });
  }
}
