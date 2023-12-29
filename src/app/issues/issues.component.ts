import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Issue } from '../issue';
import { IssueService } from '../issue.service';
import {
  BehaviorSubject,
  Observable,
  combineLatestWith,
  distinctUntilChanged,
  map,
  merge,
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
  private selectedIssueId$ = new BehaviorSubject<number | undefined>(undefined);

  //TODO: Separate this state service method out of this component
  //TODO: Separate new Issue() constructor into a Issue class with id=-1
  // State variable to temporarily hold new issue (id=-1) being created with optimistic update.
  // Gets cleared once issue has been added to database, or API responds with error
  private _newIssueToBeAdded$ = new BehaviorSubject<Issue>({
    name: '',
  } as Issue);
  public readonly newIssueToBeAdded$: Observable<Issue | undefined> =
    this._newIssueToBeAdded$.asObservable();
  //TODO: Separate this state service method out of this component
  public readonly selectedIssue$: Observable<Issue | undefined> =
    this.selectedIssueId$.pipe(
      distinctUntilChanged(),
      combineLatestWith(this.issues$),
      map(
        ([selectedIssueId, issues]: [number | undefined, Issue[]]):
          | Issue
          | undefined => {
          if (selectedIssueId === -1)
            return this._newIssueToBeAdded$.getValue();

          const selectedIssue = issues.find(
            (issue: Issue) => issue.id === selectedIssueId,
          );
          return selectedIssue ? { ...selectedIssue } : undefined;
        },
      ),
      tap(selectedIssue => console.log('Selected Issue:', selectedIssue)),
    );

  // // UI State Variable for Issue Edit component, leave this within component for now instead of creating facade class
  // public readonly issueSelectedForEdit$: Observable<Issue | undefined> = merge(
  //   this.newIssueToBeAdded$,
  //   this.selectedIssue$,
  // ).pipe(tap(issue => console.log('Issue Selected for Edit: ', issue)));

  constructor(private issueService: IssueService) {
    console.log('Component Instantiated!');
  }

  get issues() {
    return this._issues$.getValue();
  }

  //TODO: Remove all getters and setters that hide the fact that they are accessing behaviour Subjects
  // Is using getValue like below an anti-pattern? getter to retrieve selectedIssueId easily without having to subscribe to an observable
  get selectedIssueId() {
    return this.selectedIssueId$.getValue();
  }

  ngOnInit() {
    this.getIssues();
  }

  /* Issues Service Methods */

  //TODO: Separate this state service method out of this component
  saveNewIssue(newIssueWithoutId: Issue) {
    // Optimistic Update
    const newIssueWithTempId = { ...newIssueWithoutId, id: -1 };
    //TODO: Should refactor issues, selectedIssueId, and newIssue into one state object so I
    // as they are so closely related so I don't have to emit three separate times
    // Note: selectedIssue$ only emits once despite the three simultaneous next() calls due to pipe(distinctUntilChanged())
    //TODO: Refactor below to methods that include cloning logic before calling .next()
    // Cloning objects should be done in in the state service so you don't have to worry about it everywhere else
    this._newIssueToBeAdded$.next({ ...newIssueWithTempId });
    this._issues$.next([...this.issues, { ...newIssueWithTempId }]);
    this.selectIssue(newIssueWithTempId);

    //TODO: Avoid having to imperatively call getIssues in order to update local state, local state should be reactive
    // Also, state synchronization strategy can still be determined while using reactive state
    this.issueService.addIssue(newIssueWithoutId).subscribe({
      //TODO: Move replaceIssue and removeIssue logic to own methods in state service to encapsulate logic for finding temp id of -1
      next: issueWithId => {
        this._newIssueToBeAdded$.next({ name: '' } as Issue);
        this._issues$.next([
          ...this.issues.map(issue => (issue.id === -1 ? issueWithId : issue)),
        ]);
        this.selectIssue(issueWithId);
      },
      error: error => {
        console.log(error);
        this._newIssueToBeAdded$.next({ ...newIssueWithoutId });
        this._issues$.next([...this.issues.filter(issue => issue.id !== -1)]);
        this.selectIssue(null);
      },
    });
  }

  getIssues() {
    this.issueService
      .getIssues()
      .subscribe(issues => this._issues$.next(issues));
  }

  selectIssue(issue: Issue | null) {
    this.selectedIssueId$.next(issue ? issue.id : -1);
  }

  updateIssue(issue: Issue) {
    //TODO: Avoid having to imperatively call getIssues in order to update local state, local state should be reactive
    this.issueService.updateIssue(issue).subscribe(() => this.getIssues());
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

  /* Component event handlers */

  onNewIssueSelect() {
    this.selectIssue(null);
  }

  onIssueSelect(issue: Issue) {
    this.selectIssue(issue);
  }

  //TODO: Separate out API service calling methods contained in this UI-related method into a facade (abstraction layer) so that
  // component only contains UI-related methods for separation of concerns. Also, this component contains too many similar method names
  onIssueSave(issue: Issue) {
    // Convert this to proper form validation to avoid duplication of logic here
    issue.name = issue.name.trim();
    //Extra check for saving temp issue (id=-1) during optimistic update since API service performs Upsert on update
    if (!issue.name || issue.id === -1) return;

    this.updateIssue(issue);
  }

  onIssueAdd(selectedIssue: Issue) {
    // Convert this to proper form validation to avoid duplication of logic here
    selectedIssue.name = selectedIssue.name.trim();
    if (!selectedIssue.name) return;

    this.saveNewIssue(selectedIssue);
  }

  onIssueDelete(selectedIssue: Issue) {
    if (selectedIssue.id === -1) return;

    const currentIssues = this.issues;
    this._issues$.next(
      this.issues.filter(issue => issue.id !== selectedIssue.id),
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
