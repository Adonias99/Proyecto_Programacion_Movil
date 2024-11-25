import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Plugins } from '@capacitor/core';

const { Permissions } = Plugins;

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage {
  scanResult: string = '';

  async requestCameraPermission() {
    const result = await Permissions['request']({ name: 'camera' });
    return result.state === 'granted';
  }

  async startScan() {
    const permissionGranted = await this.requestCameraPermission();

    if (!permissionGranted) {
      console.log('Permiso de cámara no concedido.');
      this.scanResult = 'Se necesita permiso para acceder a la cámara.';
      return;
    }
    
    try {
      // Iniciar el escáner de códigos de barras
      const result: any = await BarcodeScanner.startScan();

      // Imprimir el resultado en la consola para inspeccionar su estructura
      console.log(result);

      // Verificar si el resultado tiene contenido escaneado
      if (result && result.content) {
        this.scanResult = result.content; // Almacenar el resultado escaneado
      } else {
        this.scanResult = 'No se encontró ningún código.';
      }
    } catch (error) {
      console.error('Error al escanear:', error);
      this.scanResult = 'Error al intentar escanear el código.';
    }
  }
}
