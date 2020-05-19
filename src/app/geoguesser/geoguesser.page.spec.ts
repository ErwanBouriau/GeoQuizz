import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GeoguesserPage } from './geoguesser.page';

describe('GeoguesserPage', () => {
  let component: GeoguesserPage;
  let fixture: ComponentFixture<GeoguesserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoguesserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GeoguesserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
