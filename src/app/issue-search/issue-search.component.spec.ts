import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueSearchComponent } from './issue-search.component';

describe('IssueSearchComponent', () => {
  let component: IssueSearchComponent;
  let fixture: ComponentFixture<IssueSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueSearchComponent]
    });
    fixture = TestBed.createComponent(IssueSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
