import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Issue } from '../issue';
import { IssueService } from '../issue.service';
import { BehaviorSubject, Observable, combineLatestWith, map, tap } from 'rxjs';

@Component({
  selector: 'zd-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuesComponent {
  private _issues$ = new BehaviorSubject<Issue[]>([]);
  issues$: Observable<Issue[]> = this._issues$.asObservable();

  private selectedIssueId$ = new BehaviorSubject<number | undefined>(undefined);
  // getter to retrieve selectedIssueId easily without having to subscribe to an observable
  get selectedIssueId() {
    return this.selectedIssueId$.getValue();
  }

  selectedIssue$?: Observable<Issue | undefined> = this.selectedIssueId$.pipe(
    combineLatestWith(this.issues$),
    map(
      ([selectedIssueId, issues]: [number | undefined, Issue[]]):
        | Issue
        | undefined => {
        const selectedIssue = issues.find(
          (issue: Issue) => issue.id === selectedIssueId
        );
        return selectedIssue ? { ...selectedIssue } : undefined;
      }
    ),
    tap(selectedIssue => console.log('Selected Issue:', selectedIssue))
  );

  constructor(private issueService: IssueService) {
    console.log('Component Instantiated!');
  }

  ngOnInit() {
    this.getIssues();
  }

  getIssues() {
    this.issueService
      .getIssues()
      .subscribe((issues) => this._issues$.next(issues));
  }

  getIssuesByName(name: string) {
    if (!name.trim()) {
      this.getIssues();
    } else {
      this.issues$ = this.issueService.searchIssuesByName(name);
    }
  }

  private updateIssueInList(issue?: Issue) {
    //TODO: Implement this method to be called for any optimistic updates for addIssue or saveSelectedIssue to avoid waiting for API response
    // Can include logic to rollback optimistic update if API response returns error
  }

  onIssueSelect(issue: Issue) {
    this.selectedIssueId$.next(issue.id);
  }

  addIssue(issue: Issue) {
    issue.name = issue.name.trim();
    if (!issue.name) return;

    this.issueService.addIssue(issue).subscribe(() => this.getIssues());
  }

  saveSelectedIssue(issue: Issue) {
    issue.name = issue.name.trim();
    if (!issue.name) return;

    if (issue.id) {
      this.issueService.updateIssue(issue).subscribe(() => this.getIssues());
    } else {
      this.addIssue(issue);
    }
  }

  deleteSelectedIssue(issueId: number) {
    this.issueService.deleteIssue(issueId).subscribe(() => {
      this.getIssues();
    });
  }
}
