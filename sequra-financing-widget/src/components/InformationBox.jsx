import React from 'react';

const InformationBox = ( { selectedInstalment } ) => {

  const monthlyFee = (selectedInstalment.instalment_amount && selectedInstalment.instalment_amount.string) || 0;
  
  return (
    <div className='info-box'>

      <div className='info-box-header'>
        <span>Fracciona tu pago</span>
        <span>SeQura</span>
      </div>

      <div className='info-box-step'>
        <span className='text'>
                    1. Eliges "Fracciona tu pago" al realizar tu pedido y pagas sólo la primera cuota.
        </span>
        <img src='https://raw.githubusercontent.com/monifasol/frontend-challenge-sequra/main/sequra-financing-widget/public/img/step1.png' alt='Fracciona tu pago - paso 1'/>
      </div>

      <div className='info-box-step'>
        <span className='text'>
                    2. Recibes tu pedido.
        </span>
        <img src='https://raw.githubusercontent.com/monifasol/frontend-challenge-sequra/main/sequra-financing-widget/public/img/step2.png' alt='Fracciona tu pago - paso 2'/>
      </div>

      <div className='info-box-step'>
        <span className='text'>
                    3. El resto de pagos se cargarán automáticamente a tu tarjeta.
        </span>
        <img src='https://raw.githubusercontent.com/monifasol/frontend-challenge-sequra/main/sequra-financing-widget/public/img/step3.png' alt='Fracciona tu pago - paso 3'/>
      </div>

      <p className='text-how-easy'>¡Así de simple!</p>

      <p>
                Has seleccionado pagar en {`${selectedInstalment.instalment_count} 
                cuotas de ${monthlyFee}/mes`}
      </p>

      <p>
                Además, en el importe mostrado ya se incluye la cuota única mensual
                de {`${monthlyFee}/mes`}, por lo que no tendrás ninguna sorpresa.
      </p>

    </div>
  );
};

export default InformationBox;
