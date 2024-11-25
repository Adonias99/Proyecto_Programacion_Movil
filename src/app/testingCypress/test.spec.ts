describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('/elegir');
  });

  it(' primer testing: Registrarse', () => {
    cy.visit('/registrarse')
    cy.contains('Registrarse');
    cy.get('ion-input[placeholder="Ingrese su nombre de usuario"] input').type('Isra');
    cy.get('ion-input[placeholder="Ingrese su correo electrónico"] input').type('is.gonzalezd@duocuc.cl');
    cy.get('ion-input[placeholder="Ingrese su contraseña"] input').type('1234567');
    cy.get('ion-input[placeholder="Repita su contraseña"] input').type('1234567');
    cy.get('ion-input[placeholder="Ingrese su nombre y apellido"] input').type('Israel Gonzalez');
    cy.window().then((window) => {
      
      (window as any).grecaptcha = {
        execute: () => Promise.resolve('valid-recaptcha-token'),
      };
    });
    cy.get('ion-button').contains('Registrarse').click();
    cy.wait(5000);
  });
  it(' segundo testing: Login', () => {
    cy.visit('/login')
    cy.contains('Login');
    cy.get('ion-input[placeholder="Ingrese Correo Electrónico"]').should('be.visible');
    cy.get('ion-input[placeholder="Ingrese Correo Electrónico"] input').type('ho.vergara@duocuc.cl');
    cy.get('ion-input[placeholder="Ingrese contraseña"] input').type('123456');
    cy.get('ion-button').contains('Ingresar').click();
    cy.wait(5000);
  });

  

 it('tercer testing: Programar Viaje', () => {
    cy.visit('/home')
    cy.contains('Programar viaje');
    cy.get('ion-button').contains('Programar Viaje').should('be.visible').click();
    cy.url().should('include', '/programar');

    cy.get('ion-input[placeholder="Ingrese el destino del viaje"] input').type('Macul');

    cy.get('ion-input[placeholder="Ingrese la capacidad de su vehículo"] input').type('3');
    cy.get('ion-input[placeholder="Ingrese el precio del viaje"] input').type('2500');
    cy.get('ion-input[placeholder="Ingrese hora de salida del viaje"] input').type('11:40');
    cy.get('ion-input[placeholder="Ingrese el Lugar de Encuentro"] input').type('Afuera Duoc');
    
    cy.get('ion-button').contains('Programar Viaje').click();
    cy.contains('Viaje programado').should('be.visible');


    cy.wait(5000);
  });
  it('cuarto testing: Mis Viajes', ()=>{
    cy.visit('/home')
    cy.contains('Mis Viajes');
    cy.get('ion-button').contains('Mis').should('be.visible').click();
    cy.url().should('include', '/misviajes');
    cy.get('ion-button').contains('Ver').click();
    cy.get('ion-button').contains('Iniciar').click();
    
    cy.wait(5000);
  })
  it(' quinto testing: Cancelar Viaje',()=>{
    cy.visit('/home')
    cy.contains('Cancelar Viaje');
    cy.get('ion-button').contains('Cancelar').click();
    cy.url().should('include', '/cancelarviaje');
    cy.get('ion-button').contains('Anular').click();
    cy.url().should('include', '/cancelarviaje');
    cy.wait(5000);
  })

});
