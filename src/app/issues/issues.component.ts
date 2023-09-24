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
  issues$!: Observable<Issue[]>; // TODO: Move possible shared state up to single application state class (store) in core layer
  selectedIssue?: Issue | null;

  constructor(
    private issueService: IssueService
  ) { 
    console.log('Component Instantiated!');
  }

  ngOnInit() {
    this.issues$ = this.getIssues();
  }

  getIssues() {
    return this.issueService.getIssues()
  }

  getIssuesByName(name: string) {
    if (!name.trim()) {
      this.getIssues();
    } else {
      this.issues$ = this.issueService.searchIssuesByName(name)
    }
  }

  private updateIssueInList(issue: Issue) {
    //TODO: Implement this method to be called for any optimistic updates to avoid waiting for API response
  }

  selectIssue(issue: Issue) {
    this.selectedIssue = { ...issue };
  }

  addIssue(issue: Issue) {
    issue.name = issue.name.trim(); //application logic stored in smart component instead of facade class
    if (!issue.name) return;

    this.issueService.addIssue(issue)
      .subscribe(() => this.issues$ = this.getIssues());
  }

  saveSelectedIssue(issue: Issue) {
    console.log(issue);
    issue.name = issue.name.trim(); //application logic stored in smart component instead of facade class
    if (!issue.name) return;

    if (issue.id) { //application logic stored in smart component instead of facade class
      this.issueService.updateIssue(issue)
        .subscribe(() => this.issues$ = this.getIssues());
    } else {
      this.addIssue(issue);
    }
  }

  deleteSelectedIssue(issueId: number) {
    this.issueService.deleteIssue(issueId)
      .subscribe(() => {
        this.issues$ = this.getIssues();
        this.selectedIssue = null;
      });
  }
}
