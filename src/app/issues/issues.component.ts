import { Component } from '@angular/core';
import { Issue } from '../issue';
import { ISSUES } from '../mock-issues';

@Component({
  selector: 'zd-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent {
  public issues?: Issue[];
  public selectedIssue?: Issue;

  ngOnInit(): void {
    this.issues = ISSUES;
  }

  selectIssue(issue: Issue): void {
    this.selectedIssue = issue;
  }
}
