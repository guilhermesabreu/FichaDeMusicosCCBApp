import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';


import { AppComponent } from './app.component';
import { PessoasPelaPrimeiraLetraDoNomePipe } from './helps/PessoasPelaPrimeiraLetraDoNome.pipe';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegistroPessoaComponent } from './registroPessoa/registroPessoa.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { PessoaService } from './services/PessoaService/pessoa.service';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { DatePipe } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { EventEmitterService } from './event-emmiter/event-emitter.service';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormatarDataPipe } from './helps/FormatarData.pipe';
import { FormatarDataInvertidaPipe } from './helps/FormatarDataInvertida.pipe';
import { PerfilComponent } from './perfil/perfil.component';
import { FichaAlunosComponent } from './ficha-alunos/ficha-alunos.component';
import { FichaInstrutoresComponent } from './ficha-instrutores/ficha-instrutores.component';
import { FichaEncarregadosComponent } from './ficha-encarregados/ficha-encarregados.component';

@NgModule({
  declarations: [			
    AppComponent,
    LoginComponent,
    NavComponent,
    FooterComponent,
    RegistroPessoaComponent,
    PessoasPelaPrimeiraLetraDoNomePipe,
    FormatarDataPipe,
    FormatarDataInvertidaPipe,
    PerfilComponent,
    FichaAlunosComponent,
    FichaInstrutoresComponent,
      FichaEncarregadosComponent
   ],
  imports: [
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    FormsModule,
    CalendarModule,
    AutoCompleteModule,
    BsDatepickerModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    CarouselModule.forRoot(),
    AccordionModule.forRoot()
  ],
  providers: [
    EventEmitterService,
    PessoaService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
