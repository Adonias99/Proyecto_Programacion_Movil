import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  codigoQR: any;
  qr: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const codigoQRParam = this.route.snapshot.paramMap.get('codigoQR');
    if (codigoQRParam) {
      this.codigoQR = JSON.parse(codigoQRParam);
      this.qr = JSON.stringify(this.codigoQR);
  
      // Puedes acceder al nombre del usuario aquí
      console.log('Nombre del Usuario:', this.codigoQR.nombreUsuario);
    }
  }
}


