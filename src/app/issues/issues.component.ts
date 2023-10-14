import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Issue } from '../issue';
import { IssueService } from '../issue.service';
import {
  BehaviorSubject,
  Observable,
  combineLatestWith,
  distinctUntilChanged,
  map,
  tap,
} from 'rxjs';

@Component({
  selector: 'zd-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuesComponent {
  private _issues$ = new BehaviorSubject<Issue[]>([]);
  public readonly issues$: Observable<Issue[]> = this._issues$.asObservable();
  get issues() {
    return this._issues$.getValue();
  }

  private selectedIssueId$ = new BehaviorSubject<number | undefined>(undefined);
  // getter to retrieve selectedIssueId easily without having to subscribe to an observable
  get selectedIssueId() {
    return this.selectedIssueId$.getValue();
  }

  public readonly selectedIssue$?: Observable<Issue | undefined> =
    this.selectedIssueId$.pipe(
      distinctUntilChanged(),
      combineLatestWith(this.issues$),
      map(
        ([selectedIssueId, issues]: [number | undefined, Issue[]]):
          | Issue
          | undefined => {
          if (!selectedIssueId) return { name: '' } as Issue;

          const selectedIssue = issues.find(
            (issue: Issue) => issue.id === selectedIssueId
          );
          return selectedIssue ? { ...selectedIssue } : undefined;
        }
      ),
      tap((selectedIssue) => console.log('Selected Issue:', selectedIssue))
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

  updateIssue(issue: Issue) {
    this.issueService.updateIssue(issue).subscribe(() => this.getIssues());
  }

  saveNewIssue(issue: Issue) {
    this.issueService.addIssue(issue).subscribe(issue => {
      this.getIssues();
      this.onIssueSelect(issue);
    });
  }

  // getIssuesByName(name: string) {
  //   if (!name.trim()) {
  //     this.getIssues();
  //   } else {
  //     this.issues$ = this.issueService.searchIssuesByName(name);
  //   }
  // }

  private updateIssueInList(issue?: Issue) {
    //TODO: Implement this method to be called for any optimistic updates for addIssue or saveSelectedIssue to avoid waiting for API response
    // Can include logic to rollback optimistic update if API response returns error
  }

  onAddIssue() {
    this.selectedIssueId$.next(undefined);
  }

  onIssueSelect(issue: Issue) {
    this.selectedIssueId$.next(issue.id);
  }

  //TODO: Separate out API service calling methods contained in this UI-related method into a facade (abstraction layer) so that 
  // component only contains UI-related methods for separation of concerns. Also, this component contains too many similar method names
  onIssueSave(selectedIssue: Issue) {
    selectedIssue.name = selectedIssue.name.trim();
    // Convert this to proper form validation
    if (!selectedIssue.name) return;

    if (selectedIssue.id) {
      this.updateIssue(selectedIssue);
    } else {
      this.saveNewIssue(selectedIssue);
    }
  }

  onIssueDelete(selectedIssue: Issue) {
    const currentIssues = this.issues;
    this._issues$.next(
      this.issues.filter((issue) => issue.id !== selectedIssue.id)
    );
    this.issueService.deleteIssue(selectedIssue.id).subscribe({
      error: (error: any) => {
        console.log(error);
        // TODO: Current method of rolling back state change leads to bugs if multiple state changes happen
        // before rolling back the first state change. Deleting issue might not be a good candidate for optimistic UI
        this._issues$.next(currentIssues);
      },
    });
  }
}
