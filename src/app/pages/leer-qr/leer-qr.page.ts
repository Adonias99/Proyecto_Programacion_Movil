import { Component, OnInit, OnDestroy } from '@angular/core';
import { BarcodeScanner, Barcode } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-leer-qr',
  templateUrl: './leer-qr.page.html',
  styleUrls: ['./leer-qr.page.scss'],
})
export class LeerQrPage implements OnInit, OnDestroy {
  isSupported = false;
  barcodes: Barcode[] = [];
  listener: any;
  isScanning = false; // Estado para controlar si el escáner está activo

  constructor(private alertController: AlertController, private platform: Platform) {}

  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      const { supported } = await BarcodeScanner.isSupported();
      this.isSupported = supported;

      if (this.isSupported) {
        const { camera } = await BarcodeScanner.requestPermissions();
        console.log('Permiso de cámara:', camera); // Mensaje de depuración
        if (camera !== 'granted') {
          this.presentAlert('Permiso de cámara no concedido.');
        }
      } else {
        this.presentAlert('El escáner de códigos QR no está soportado en este dispositivo.');
      }
    } else {
      this.presentAlert('El escáner de códigos QR está disponible solo en la aplicación móvil.');
    }
  }

  async startScan() {
    console.log('Intentando iniciar el escaneo...');

    if (!this.isSupported) {
      this.presentAlert('El escáner de códigos QR no está soportado en este dispositivo.');
      return;
    }

    if (this.isScanning) {
      console.log('Ya se está escaneando.'); // Mensaje de depuración
      return;
    }

    this.isScanning = true; // Establecer el estado a escaneando
    document.querySelector('body')?.classList.add('barcode-scanner-active');

    // Configura el listener para 'barcodesScanned'
    this.listener = await BarcodeScanner.addListener('barcodesScanned', (result) => {
      console.log('Scanned result:', result);
      if (result && result.barcodes.length > 0) {
        this.barcodes = result.barcodes; // Añade todos los códigos escaneados al array
        this.stopScan(); // Detenemos el escáner después de escanear
      }
    });

    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted') {
        this.presentAlert('Permiso de cámara no concedido.');
        this.isScanning = false; // Restablecer el estado si no se concede el permiso
        return;
      }
      // Iniciar el escaneo y abrir la cámara
      await BarcodeScanner.startScan(); // Esto debería abrir la cámara
      console.log('Escaneo iniciado');
    } catch (error) {
      console.error('Error al iniciar el escaneo:', error);
      this.presentAlert('Error al iniciar el escaneo. Verifica los permisos.');
      this.stopScan(); // Detenemos el escáner en caso de error
    }
  }

  async stopScan() {
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
    await BarcodeScanner.stopScan();
    this.isScanning = false; // Cambia el estado a no escaneando

    if (this.listener) {
      this.listener.remove();
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnDestroy() {
    // Limpia el listener cuando se destruye el componente
    if (this.listener) {
      this.listener.remove();
    }
  }
}
