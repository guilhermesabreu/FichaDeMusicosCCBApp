import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/AuthService/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Pessoa } from '../models/Pessoa';
import { PessoaService } from '../services/PessoaService/pessoa.service';
import { FichaComponent } from '../ficha/ficha.component';
import { EventEmitterService } from '../event-emmiter/event-emitter.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  
  admins: Pessoa[] = [];
  perfil!: string;
  
  constructor(private authService: AuthService
    ,private eventEmitterService: EventEmitterService
    ,public router: Router
    ,private rout: ActivatedRoute
    ,public pessoaService: PessoaService
    ,private toastr: ToastrService) { }
    
    ngOnInit() {
    }
    
    // obterPerfil(){
    //   let userName = this.userName();
    //   this.authService.obterPerfilPorUserName(userName).subscribe(
    //     (role: string)=>{
    //       this.perfil = role; 
    //     }, error =>{
    //       this.toastr.error('Não foi possível obter o perfil deste usuário');
    //     }
    //     )
    //   }
      
      // perfilCliente(){
      //   this.obterPerfil();
      //   this.perfil == 'Adm' ? false : true;
      // }
      
      loggedIn() {
        return this.authService.loggedIn();
      }
      
      logOut() {
        localStorage.removeItem('token');
        this.toastr.show('Log Out');
        this.router.navigate(['/login']);
      }
      
      entrar() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
      
      userName() {
        return sessionStorage.getItem('username');
      }
      
      showMenu() {
        return this.router.url !== "/login";
      }

      showSubItem():string{
        return sessionStorage.getItem('role')!.toString();
      }

      listarInstrutores() {
        this.eventEmitterService.onFirstComponentButtonClick('INSTRUTOR'); 
      }

      listarAlunos() {
        this.eventEmitterService.onFirstComponentButtonClick('ALUNO'); 
      }

      listarEncarregados() {
        this.eventEmitterService.onFirstComponentButtonClick('ENCARREGADO');
      }

      
      // obterUsuarios() {
      //   this.admService.listaDeAdms().subscribe(
      //     (_users: any) => {
      //       this.admins = _users;
      //       this.atualizarPerfil();
      //     }, error => {
      //       this.toastr.error(`Erro ao tentar Carregar Usuários: ${error}`);
      //     });
      //   }
        
        // atualizarPerfil(){
        //   if(typeof this.admins === 'object'){
        //     var userName = sessionStorage.getItem('username');
        //     const usuarioLogado =  this.admins.filter((adm) => adm.userName == userName);
        //     const perfilAdm = usuarioLogado.map((perfil) => perfil.company);
        //     if(perfilAdm == undefined || perfilAdm == null || perfilAdm.toString() == ''){
        //       this.router.navigate(['/user/perfilCliente']);
        //     }else{
        //       this.router.navigate(['/user/perfilAdm']);
        //     }
        //   }else{
        //     this.router.navigate(['/user/perfilCliente']);
        //   }
        // }
        
        // telaDeAgendamento(){
        //   if(typeof this.admins === 'object'){
        //     var userName = sessionStorage.getItem('username');
        //     const usuarioLogado =  this.admins.filter((adm) => adm.userName == userName);
        //     const perfilUsuario = usuarioLogado.map((perfil) => perfil.company);
        //     if(perfilUsuario == undefined || perfilUsuario == null || perfilUsuario.toString() == ''){
        //       this.router.navigate(['/agendamentosUser']);
        //     }else{
        //       this.router.navigate(['/agendamentosAdm']);
        //     }
        //   }else{
        //     this.router.navigate(['/agendamentosUser']);
        //   }
        // }
        
        showButton(){
          var urlCorreta = this.router.url.indexOf("agendamentos");
          if(urlCorreta > 0){
            return true;
          }
          else{
            return false;
          }
        }
      }
      