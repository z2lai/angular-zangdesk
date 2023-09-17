import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesListTileComponent } from './issues-list-tile.component';

describe('IssuesListTileComponent', () => {
  let component: IssuesListTileComponent;
  let fixture: ComponentFixture<IssuesListTileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssuesListTileComponent]
    });
    fixture = TestBed.createComponent(IssuesListTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
