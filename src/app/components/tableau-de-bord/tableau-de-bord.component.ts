import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Chart, ChartConfiguration, ChartType} from "chart.js";
import {FormsModule} from "@angular/forms";
import {AdminService} from "../../services/admin.service";
import {CommandeService} from "../../services/commande.service";
import {MessageService} from "../../services/message.service";
import {PromotionService} from "../../services/promotion.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.css'
})
export class TableauDeBordComponent implements OnInit, AfterViewInit {

  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  // Properties for component state
  isToggled: boolean = true;
  selectedDay: number = 9;
  currentMonth: string = 'MAI 2025';

  // Chart properties
  chart: Chart | null = null;
  chartId: string = 'subscription-chart';
  isChartLoading: boolean = false;
  selectedChartType: ChartType = 'bar';

  adminCount: number = 0;
  todayOrders: number = 0;
  activePromotions: number = 0;
  unreadMessages: number = 0;

  // Chart data
  chartData = {
    monthly: 2.2,
    annually: 1.8
  };

  // Calendar data
  calendarDays: number[] = [];
  calendarHeaders: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  constructor(private elementRef: ElementRef,protected adminService:AdminService,protected commandeService:CommandeService,protected messageService:MessageService,protected promotionService:PromotionService) {}

  ngOnInit(): void {
    this.generateCalendarDays();
      this.adminService.countRegistredAdmin().subscribe(dt=>{
        this.adminCount = dt;
      });

      this.commandeService.countOrderDay().subscribe(dt=>{
        this.todayOrders = dt;
      });
      this.promotionService.countPromotionActive().subscribe(dt=>{
        this.activePromotions = dt;
      });
      this.messageService.countMessagesNotReply().subscribe(dt=>{
        this.unreadMessages = dt;
      });
  }

  ngAfterViewInit(): void {
    this.initializeEventListeners();
    setTimeout(() => {
      this.initChart();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  // Generate calendar days for the current month
  generateCalendarDays(): void {
    for (let i = 1; i <= 31; i++) {
      this.calendarDays.push(i);
    }
  }

  // Initialize Chart.js
  private initChart(): void {
    if (!this.chartCanvas) {
      console.error('Chart canvas not found');
      return;
    }

    this.isChartLoading = true;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context from canvas');
      this.isChartLoading = false;
      return;
    }

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const chartConfig: ChartConfiguration = {
      type: this.selectedChartType,
      data: {
        labels: ['Mensuel', 'Annuel'],
        datasets: [{
          label: 'Souscriptions',
          data: [this.chartData.monthly, this.chartData.annually],
          backgroundColor: [
            'rgba(255, 107, 157, 0.8)',
            'rgba(79, 172, 254, 0.8)'
          ],
          borderColor: [
            'rgba(255, 107, 157, 1)',
            'rgba(79, 172, 254, 1)'
          ],
          borderWidth: 2,
          borderRadius: this.selectedChartType === 'bar' ? 8 : 0,
          hoverBackgroundColor: [
            'rgba(255, 107, 157, 0.9)',
            'rgba(79, 172, 254, 0.9)'
          ],
          hoverBorderColor: [
            'rgba(255, 107, 157, 1)',
            'rgba(79, 172, 254, 1)'
          ],
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            display: false // We'll use custom legend
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y || context.parsed;
                return `${label}: ${value}K souscriptions`;
              }
            }
          }
        },
        scales: this.getScalesConfig(),
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        },
        elements: {
          bar: {
            borderWidth: 2,
          }
        }
      }
    };

    try {
      this.chart = new Chart(ctx, chartConfig);
      this.isChartLoading = false;
    } catch (error) {
      console.error('Error creating chart:', error);
      this.isChartLoading = false;
    }
  }

  // Get scales configuration based on chart type
  private getScalesConfig(): any {
    if (this.selectedChartType === 'pie' || this.selectedChartType === 'doughnut') {
      return {};
    }

    return {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderDash: [5, 5]
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 12,
            weight: 500
          },
          callback: function(value: any) {
            return value + 'K';
          }
        }
      }
    };
  }

  // Change chart type
  changeChartType(): void {
    this.initChart();
  }

  // Update chart data
  updateChartData(): void {
    this.isChartLoading = true;

    // Simulate API call
    setTimeout(() => {
      // Generate random data for demonstration
      this.chartData = {
        monthly: Math.round((Math.random() * 3 + 1) * 10) / 10,
        annually: Math.round((Math.random() * 2.5 + 1) * 10) / 10
      };

      if (this.chart) {
        this.chart.data.datasets[0].data = [this.chartData.monthly, this.chartData.annually];
        this.chart.update('active');
      }

      this.isChartLoading = false;
    }, 1000);
  }




  // Initialize event listeners
  private initializeEventListeners(): void {
    this.setupCalendarEvents();
    this.setupToggleSwitch();
    this.setupStatCardAnimations();
    this.setupNavigationEvents();
  }

  // Calendar day selection
  private setupCalendarEvents(): void {
    const calendarDays = this.elementRef.nativeElement.querySelectorAll('.calendar-day:not(.header)');

    calendarDays.forEach((day: HTMLElement) => {
      if (day.textContent && day.textContent.trim()) {
        day.addEventListener('click', () => {
          this.onDayClick(parseInt(day.textContent!), calendarDays);
        });
      }
    });
  }

  onDayClick(dayNumber: number, event: MouseEvent): void {
    this.selectedDay = dayNumber;

    // Récupération sécurisée de tous les éléments
    const calendarDays = Array.from(document.querySelectorAll('.calendar-day')) as HTMLElement[];

    // Supprimer la classe active de tous les éléments
    calendarDays.forEach((d) => {
      d.classList.remove('active');
    });

    // Ajouter la classe active à l'élément cliqué
    const target = event.target as HTMLElement;
    target.classList.add('active');
  }

  // Toggle switch functionality
  private setupToggleSwitch(): void {
    const toggleSwitch = this.elementRef.nativeElement.querySelector('.toggle-switch');

    if (toggleSwitch) {
      toggleSwitch.addEventListener('click', () => {
        this.onToggleSwitch(toggleSwitch);
      });
    }
  }

  onToggleSwitch(target: EventTarget | null): void {
    if (!(target instanceof HTMLElement)) return;

    this.isToggled = !this.isToggled;

    if (this.isToggled) {
      target.style.background = '#4facfe';
      target.style.setProperty('--after-transform', 'translateX(22px)');
    } else {
      target.style.background = '#ddd';
      target.style.setProperty('--after-transform', 'translateX(3px)');
    }

    console.log('Promotions active:', this.isToggled);
  }

  // Stat cards hover animations
  private setupStatCardAnimations(): void {
    const statCards = this.elementRef.nativeElement.querySelectorAll('.stat-card');

    statCards.forEach((card: HTMLElement) => {
      card.addEventListener('mouseenter', () => {
        this.onStatCardHover(card, true);
      });

      card.addEventListener('mouseleave', () => {
        this.onStatCardHover(card, false);
      });
    });
  }

  onStatCardHover(card: HTMLElement, isHovering: boolean): void {
    if (isHovering) {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    } else {
      card.style.transform = 'translateY(0) scale(1)';
    }
  }

  // Navigation active state
  private setupNavigationEvents(): void {
    const navItems = this.elementRef.nativeElement.querySelectorAll('.nav-item');

    navItems.forEach((item: HTMLElement) => {
      item.addEventListener('click', (e: Event) => {
        this.onNavItemClick(e, navItems);
      });
    });
  }

  onNavItemClick(event: Event, navItems: NodeListOf<HTMLElement>): void {
    event.preventDefault();

    navItems.forEach((nav: HTMLElement) => {
      nav.classList.remove('active');
    });

    const clickedItem = event.currentTarget as HTMLElement;
    clickedItem.classList.add('active');

    // Handle navigation logic here
    const navText = clickedItem.querySelector('span')?.textContent;
    console.log('Navigation clicked:', navText);
  }

  // Calendar navigation methods
  onPreviousMonth(): void {
    // Logic to navigate to previous month
    console.log('Previous month clicked');
  }

  onNextMonth(): void {
    // Logic to navigate to next month
    console.log('Next month clicked');
  }

  // Method to check if a day is selected
  isDaySelected(day: number): boolean {
    return this.selectedDay === day;
  }

  // Method to get toggle switch classes
  getToggleSwitchClasses(): string {
    return this.isToggled ? 'toggle-switch active' : 'toggle-switch';
  }

  // Admin actions
  onAdminClick(): void {
    console.log('Admin button clicked');
  }

  onLogoutClick(): void {
    console.log('Logout button clicked');
    // Implement logout logic
  }

  // Utility method to format numbers
  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  // Method to get current date info
  getCurrentDateInfo(): { day: number, month: string, year: number } {
    const now = new Date();
    return {
      day: now.getDate(),
      month: now.toLocaleString('fr-FR', { month: 'long' }).toUpperCase(),
      year: now.getFullYear()
    };
  }

}
