import { Component } from '@angular/core';
import { Issue } from '../issue';
import { IssueService } from '../issue.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'zd-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent {
  issues$!: Observable<Issue[]>;
  selectedIssue?: Issue;

  constructor(
    private issueService: IssueService
  ) { }

  ngOnInit(): void {
    this.getIssues();
  }

  getIssues(): void {
    this.issues$ = this.issueService.getIssues()
  }

  getIssuesByName(name: string) {
    if (!name.trim()) {
      this.getIssues();
    } else {
      this.issues$ = this.issueService.searchIssuesByName(name)
    }
  }

  selectIssue(issue?: Issue): void {
    this.selectedIssue = issue;
  }

  addIssue(issueName: string): void {
    issueName = issueName.trim();
    if (!issueName) return;
    
    this.issueService.addIssue({ name: issueName } as Issue)
    .subscribe(() => this.getIssues());
  }

  deleteSelectedIssue(issueId: number): void {
    this.selectIssue();
    this.issueService.deleteIssue(issueId)
      .subscribe(() => this.getIssues());
  }
}
