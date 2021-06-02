import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonContent } from '@ionic/angular';
import { ChatService } from '../services/chat.service';

interface Chat {
  image?: string,
  tipo: number,
  mensagem: string,
  time: string,
  buttons?: any;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  mensage: string;
  trans: string;
  data: Date = new Date();
  typing: boolean = false;
  mes: string = ("0" + (this.data.getMonth() + 1)).slice(-2);
  dia: string = ("0" + this.data.getDate()).slice(-2);
  hora: string = ("0" + this.data.getHours()).slice(-2);
  minutos: string = ("0" + this.data.getMinutes()).slice(-2);
  tempo: string = this.dia + "/"
    + this.mes + "/"
    + this.data.getFullYear() + " - "
    + this.hora + ":"
    + this.minutos;

  chat: Chat[] = []

  chat2 = [{
    image: "assets/Logo.png",
    image_2: "assets/points.svg",
    tipo: 3,
  }]

  token: string
  user_ref: string = "123"
  next_intent: string

  botoes = []
  constructor(private router: Router, private alertCtrl: AlertController, private chatService: ChatService) { }


  ngOnInit() {
    this.logar()
    if (this.chat[this.chat.length - 1] && this.chat[this.chat.length - 1].buttons) {
      this.botoes = this.chat[this.chat.length - 1].buttons
    }
  }

  async logar() {
    let log: any = await this.chatService.autenticate()
    console.log(log.token)

    this.token = log.token
    this.welcome()
  }

  async welcome() {
    let conv: any = await this.chatService.conversa(null, "WELCOME", this.user_ref, this.token)

    conv.messenger.forEach(element => {
      this.chat.push({
        image: "assets/Logo.png",
        tipo: 1,
        mensagem: element,
        time: this.tempo,
      })
      this.botoes = conv.quick_replies
    });
    this.ScrollToBottom()
  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      message: 'Por favor, digite antes de enviar!',
      buttons: ['Entendi']
    });

    await alert.present();
  }

  async ScrollToBottom() {
    this.content.scrollToBottom(750);
  }

  back() {
    this.router.navigateByUrl("/home")
  }

  async send() {
    if (this.mensage) {
      this.chat.push({
        tipo: 2,
        mensagem: this.mensage,
        time: this.tempo,
      })
      this.botoes = null
      this.typing = true;
      this.trans = this.mensage
      this.mensage = null
      this.ScrollToBottom();
      setTimeout(() => {
        this.recive(this.trans, "TALK")
        this.typing = false;
        this.ScrollToBottom();
      }, 2500)
    } else {
      this.presentAlert();
    }
  }

  async recive(input, next_intent) {
    let com: any = await this.chatService.conversa(input, next_intent, this.user_ref, this.token)

    com.messenger.forEach(element => {
      this.chat.push({
        image: "assets/Logo.png",
        tipo: 1,
        mensagem: element,
        time: this.tempo,
      })
      this.botoes = com.quick_replies
    })
    this.ScrollToBottom();
  }

  async resposta(btn, next_intent) {
    this.chat.push({
      image: "assets/Logo.png",
      tipo: 2,
      mensagem: btn,
      time: this.tempo
    })
    this.botoes = []
    this.mensage = null

    this.typing = true;
    this.ScrollToBottom();
    setTimeout(() => {
      this.recive(null, next_intent)
      this.typing = false;
      this.ScrollToBottom();
    }, 2500)
  }
}
