import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueEditComponent } from './issue-edit.component';

describe('IssueEditComponent', () => {
  let component: IssueEditComponent;
  let fixture: ComponentFixture<IssueEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueEditComponent]
    });
    fixture = TestBed.createComponent(IssueEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
