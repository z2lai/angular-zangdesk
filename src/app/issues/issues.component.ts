import { Component } from '@angular/core';
import { Issue } from '../issue';
import { IssueService } from '../issue.service';

@Component({
  selector: 'zd-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent {
  issues: Issue[] =[];
  selectedIssue?: Issue;

  constructor(
    private issueService: IssueService
  ) { }

  ngOnInit(): void {
    this.getIssues();
  }

  getIssues(): void {
    this.issueService.getIssues()
      .subscribe(issues => this.issues = issues);
  }

  getIssuesByName(name: string) {
    if (!name.trim()) {
      this.getIssues();
    } else {
      this.issueService.searchIssuesByName(name)
        .subscribe(issues => this.issues = issues);
    }
  }

  selectIssue(issue?: Issue): void {
    this.selectedIssue = issue;
  }

  addIssue(issueName: string): void {
    issueName = issueName.trim();
    if (!issueName) return;
    
    this.issueService.addIssue({ name: issueName } as Issue)
      .subscribe(issue => this.issues.push(issue));
  }

  deleteSelectedIssue(issueId: number): void {
    this.selectIssue();
    this.issueService.deleteIssue(issueId)
      .subscribe(() => this.getIssues());
  }
}
