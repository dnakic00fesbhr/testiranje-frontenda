import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Item {
  id: number;
  name: string;
  title: string;
  userId: number;
  description: string;
  timestamp: string;
}

interface FormData {
  name: string;
  email: string;
  comments: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-4 -left-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div class="absolute -bottom-8 -right-4 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-neutral-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div class="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <header class="text-center mb-16">
          <div class="inline-block p-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl mb-6">
            <div class="bg-white rounded-xl px-8 py-4">
              <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                FESB završni rad
              </h1>
            </div>
          </div>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stranica za potrebe završnog rada - Angular
          </p>
        </header>

        <section class="mb-16">
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div class="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              Interaktivni elementi
            </h2>

            <div class="flex flex-wrap gap-4">
              <button
                (click)="handleButtonClick()"
                class="group relative px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span class="relative z-10">Klik ({{ clickCount }})</span>
                <div class="absolute inset-0 bg-gradient-to-r from-gray-800 to-black rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                (click)="refreshData()"
                [disabled]="loading"
                [class]="loading ? 
                  'px-8 py-4 font-semibold rounded-2xl shadow-lg transition-all duration-300 bg-gray-400 text-white cursor-not-allowed' :
                  'px-8 py-4 font-semibold rounded-2xl shadow-lg transition-all duration-300 bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:shadow-xl hover:scale-105 active:scale-95'"
              >
                <span *ngIf="loading" class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Učitava...
                </span>
                <span *ngIf="!loading">Resetiraj</span>
              </button>
            </div>
          </div>
        </section>

        <section class="mb-16">
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div class="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              Forma
            </h2>

            <div class="justify-self-center w-100">
              <div class="max-w-md space-y-6">
                <div class="group">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Ime
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="formData.name"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 transition-all duration-200 group-hover:border-gray-300"
                    placeholder="Ime i prezime"
                  />
                </div>

                <div class="group">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    [(ngModel)]="formData.email"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 transition-all duration-200 group-hover:border-gray-300"
                    placeholder="Email"
                  />
                </div>

                <div class="group">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Napomena
                  </label>
                  <textarea
                    [(ngModel)]="formData.comments"
                    rows="4"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 transition-all duration-200 resize-none group-hover:border-gray-300"
                    placeholder="Napomena"
                  ></textarea>
                </div>

                <button
                  (click)="handleFormSubmit()"
                  class="w-full px-8 py-4 bg-gradient-to-r from-gray-800 to-black text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-98"
                >
                  Pošalji
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-16">
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div class="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              Image Performance Testing
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                *ngFor="let imageName of imageNames"
                class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square"
              >
                <div class="absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-400/20 group-hover:opacity-0 transition-opacity duration-500"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="bg-white/80 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <img
                        [alt]="imageName"
                        width="500"
                        height="500"
                        [src]="'/images/' + imageName + '.jpg'"
                        class="rounded-2xl"
                      />
                    </div>
                    <p class="text-gray-600 font-medium">
                      {{ imageName }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-16">
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div class="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
                API
              </h2>
              <div class="px-4 py-2 bg-gray-100 rounded-xl">
                <span class="text-sm font-medium text-gray-600">
                  {{ loading ? 'Loading...' : items.length + ' items' }}
                </span>
              </div>
            </div>

            <div *ngIf="apiError" class="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p class="text-red-800 font-medium">
                API Error: {{ apiError }}
              </p>
            </div>

            <div *ngIf="loading" class="text-center py-16">
              <div class="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-gray-600">Učitavanje</p>
            </div>

            <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                *ngFor="let item of items; let i = index"
                class="group bg-white/80 rounded-2xl p-6 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                [style.animation-delay]="i * 50 + 'ms'"
              >
                <div class="flex items-start justify-between mb-3">
                  <h3 class="font-semibold text-gray-800 text-sm leading-snug group-hover:text-gray-900 transition-colors">
                    {{ item.title }}
                  </h3>
                  <span class="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                    User {{ item.userId }}
                  </span>
                </div>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                  {{ item.description }}
                </p>
                <div class="flex items-center text-xs text-gray-500">
                  <div class="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  {{ item.timestamp }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Performance Metrics Section -->
        <section class="mb-16">
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div class="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              Statistika
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 class="font-semibold text-gray-800 mb-2">Klikova</h3>
                <p class="text-3xl font-bold text-gray-700">{{ clickCount }}</p>
              </div>

              <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                <h3 class="font-semibold text-slate-800 mb-2">
                  Prikazanih stavki
                </h3>
                <p class="text-3xl font-bold text-slate-700">
                  {{ items.length }}
                </p>
              </div>

              <div class="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200">
                <h3 class="font-semibold text-neutral-800 mb-2">Browser</h3>
                <p class="text-sm text-neutral-600 truncate">
                  {{ getBrowserInfo() }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    
    .animation-delay-4000 {
      animation-delay: 4s;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 0.3;
      }
      50% {
        opacity: 0.5;
      }
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  clickCount = 0;
  items: Item[] = [];
  loading = true;
  apiError: string | null = null;
  
  formData: FormData = {
    name: '',
    email: '',
    comments: ''
  };
  
  imageNames = ['first_image', 'second_image', 'third_image'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchData(): void {
    this.loading = true;
    this.apiError = null;
    
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (postsData) => {
          const transformedPosts = postsData.map(post => ({
            id: post.id,
            name: '',
            title: post.title,
            description: post.body,
            timestamp: new Date().toLocaleString(),
            userId: post.userId,
          }));

          this.items = transformedPosts;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.apiError = 'API request failed';
          this.loading = false;
        }
      });
  }
  refreshData(): void {
    this.loading = true;
    this.apiError = null;
    
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (postsData) => {
          const transformedPosts = postsData.map(post => ({
            id: post.id,
            name: '',
            title: post.title,
            description: post.body,
            timestamp: new Date().toLocaleString(),
            userId: post.userId,
          }));

          this.items = transformedPosts;
          this.loading = false;
          this.clickCount = 0;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.apiError = 'API request failed';
          this.loading = false;
        }
      });
      
 console.log(this.loading)
  }

  handleButtonClick(): void {
    this.clickCount++;
  }

  handleFormSubmit(): void {
    console.log('Form submitted:', this.formData);
    alert('Form submitted successfully!');
  }

  getBrowserInfo(): string {
    if (typeof window !== 'undefined' && window.navigator) {
      const userAgent = window.navigator.userAgent;
      
      // Check for specific browsers
      if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1) {
        return 'Chrome';
      } else if (userAgent.indexOf('Firefox') > -1) {
        return 'Firefox';
      } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        return 'Safari';
      } else if (userAgent.indexOf('Edge') > -1) {
        return 'Edge';
      } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
        return 'Opera';
      } else {
        // Fallback to showing the first part of user agent
        return userAgent.split(' ')[0];
      }
    }
    return 'Server Side';
  }
}