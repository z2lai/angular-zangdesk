import { Component } from '@angular/core';
import { Issue } from '../issue';
import { IssueService } from '../issue.service';

@Component({
  selector: 'zd-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent {
  public issues?: Issue[];
  public selectedIssue?: Issue;

  constructor(
    private issueService: IssueService
  ) { }

  ngOnInit(): void {
    this.issueService.getIssues()
      .subscribe(issues => this.issues = issues);
  }

  selectIssue(issue: Issue): void {
    this.selectedIssue = issue;
  }
}
