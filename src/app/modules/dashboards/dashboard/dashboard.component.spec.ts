import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { FinanceService } from '../../services/finance.service';
import { AcademicService } from '../../services/academic.service';
import { NgChartsModule } from 'ng2-charts';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let financeService: FinanceService;
  let academicService: AcademicService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [HttpClientTestingModule, NgChartsModule],
      providers: [FinanceService, AcademicService]
    }).compileComponents();

    financeService = TestBed.inject(FinanceService);
    academicService = TestBed.inject(AcademicService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load financial data on init', () => {
    spyOn(component, 'loadFinancialData');
    component.ngOnInit();
    expect(component.loadFinancialData).toHaveBeenCalled();
  });

  it('should update financial data when period changes', () => {
    spyOn(component, 'loadFinancialData');
    component.selectedPeriod = 'week';
    component.updateFinancialData();
    expect(component.loadFinancialData).toHaveBeenCalled();
  });
});
