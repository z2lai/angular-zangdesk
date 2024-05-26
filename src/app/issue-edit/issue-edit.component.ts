import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Issue } from '../issue';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'zd-issue-edit',
  templateUrl: './issue-edit.component.html',
  styleUrls: ['./issue-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueEditComponent {
  //TODO: Implement input setter to break object references by cloning the object
  @Input() issue!: Issue;

  @Output() saveIssue = new EventEmitter<Issue>();
  @Output() deleteIssue = new EventEmitter<Issue>();
  @Output() addNewIssue = new EventEmitter<Issue>();

  @ViewChild('issueForm') issueForm?: NgForm;
  
  constructor() {
    console.log('IssueEdit Component Instantiated!');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.issueForm?.reset(); // this is required to ensure that all FormControl values
    console.log('Input changed!');
    console.log(changes);
    console.log(this.issueForm?.value);
  }

  setModelValue() {
    console.log(this.issueForm?.value);
    this.issue = {
      name: 'Reset',
      description: 'abc',
    } as Issue;
    console.log(this.issueForm?.value);
  }

  setFormControlValue() {
    console.log(this.issueForm?.value);
    this.issueForm?.controls['description'].setValue('abc', { emitModelToViewChange: false });
    console.log(this.issueForm?.value);
  }

  logForm() {
    console.log('Description FormControl:', this.issueForm?.controls['description']);
  }

  onSave(issueForm: NgForm) {
    const issue: Issue = {
      ...this.issue,
      ...issueForm.value
    }
    this.saveIssue.emit(issue);
  }

  onDelete() {
    this.deleteIssue.emit(this.issue);
  }

  onAdd() {
    this.addNewIssue.emit(this.issue);
  }

  ngOnInit() {
    console.log('IssueEdit Component Initialized!');
    this.issueForm?.controls['description'].valueChanges.subscribe(updatedValue => console.log('updated value:', updatedValue));
    this.issueForm?.form.valueChanges.subscribe(updatedValue => console.log('updated FormGroup:', updatedValue));
  }
}
