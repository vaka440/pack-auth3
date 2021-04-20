import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRegisterComponent } from './page-register.component';

describe('PageRegisterComponent', () => {
  let component: PageRegisterComponent;
  let fixture: ComponentFixture<PageRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
