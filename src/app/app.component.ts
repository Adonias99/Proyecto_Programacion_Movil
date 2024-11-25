import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/servicio/data.service';
declare var paypal;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  pagoviaje = {
    descripcion: "Viaje hacia: ",
    precio: 0,
    mapa: "mapa o imagen del producto"
  };

  private tipoCambioCLPtoUSD = 800; 

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.currentPrecio.subscribe(precio => {
      this.pagoviaje.precio = precio;
      this.iniciarPaypal();
    });
  }

  iniciarPaypal() {
    const precioUSD = this.pagoviaje.precio / this.tipoCambioCLPtoUSD;

    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: this.pagoviaje.descripcion,
              amount: {
                currency_code: 'USD',
                value: precioUSD.toFixed(2)
              }
            }
          ]
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        console.log(order);
      },
      onError: err => {
        console.log(err);
      }
    }).render(this.paypalElement.nativeElement);
  }
}
