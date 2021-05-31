import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonContent } from '@ionic/angular';

interface Chat {
  image: string,
  tipo: number,
  mensagem: string,
  time: any,
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
  data: Date = new Date();
  typing: boolean = false;
  mes: any = ("0" + (this.data.getMonth() + 1)).slice(-2);
  dia: any = ("0" + this.data.getDate()).slice(-2);
  hora: any = ("0" + this.data.getHours()).slice(-2);
  minutos: any = ("0" + this.data.getMinutes()).slice(-2);
  tempo: any = this.dia + "/"
    + this.mes + "/"
    + this.data.getFullYear() + " - "
    + this.hora + ":"
    + this.minutos;

  chat: Chat[] = [{
    image: "assets/Logo.png",
    tipo: 1,
    mensagem: "Olá, usuário! \nMeu nome é <nome> ",
    time: this.tempo,
  }]

  chat2=[ {
    image: "assets/Logo.png",
    image_2: "assets/points.svg",
    tipo: 3,
  }]

  botoes = []
  constructor(private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {

    if (this.chat[this.chat.length - 1] && this.chat[this.chat.length - 1].buttons) {
      this.botoes = this.chat[this.chat.length - 1].buttons
    }
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

  send() {
    if (this.mensage) {
      this.chat.push({
        image: "assets/Logo.png",
        tipo: 2,
        mensagem: this.mensage,
        time: this.tempo
      })
      this.botoes = []
      this.mensage = null

      this.typing = true;
      this.ScrollToBottom();
      setTimeout(() => {
        this.recive()
        this.typing = false;
        this.ScrollToBottom();
      }, 2500)
    } else {
      this.presentAlert();
    }


  }

  recive() {
    this.chat.push({
      image: "assets/Logo.png",
      tipo: 1,
      mensagem: this.mensage,
      time: this.tempo
    })
    this.botoes = [{
      texto: "sim"
    },
    {
      texto: "não"
    }]


    this.ScrollToBottom();
  }

  resposta(btn) {
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
      this.recive()
      this.typing = false;
      this.ScrollToBottom();
    }, 2500)

  }


}
