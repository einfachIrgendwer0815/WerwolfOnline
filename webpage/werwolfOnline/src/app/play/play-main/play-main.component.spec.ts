import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayMainComponent } from './play-main.component';

describe('PlayMainComponent', () => {
  let component: PlayMainComponent;
  let fixture: ComponentFixture<PlayMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
