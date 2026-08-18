import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad - DocExpress',
  description:
    'Política de privacidad del servicio DocExpress. Conoce cómo protegemos tus datos y documentos PDF.',
}

export default function PrivacyPage() {
  const lastUpdated = '18 de agosto de 2026'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-slate-600">
            Última actualización: {lastUpdated}
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Resumen Ejecutivo: Tus Documentos Son Privados
            </h2>
            <p className="text-blue-800 leading-relaxed">
              DocExpress procesa todos los archivos PDF <strong>íntegramente en tu
              navegador</strong>. Los documentos <strong>nunca se suben a nuestros
              servidores</strong>, no se almacenan en bases de datos, no se envían a
              terceros y son eliminados automáticamente cuando cierras la pestaña. El
              único dato que compartimos con PayPal es tu correo electrónico al momento
              de realizar un pago.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              1. Información que Recopilamos
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Recopilamos la información mínima necesaria para ofrecerte el Servicio:
            </p>

            <h3 className="text-lg font-medium text-slate-800 mb-2">
              1.1 Datos de Pago (únicamente si compras Pro)
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Correo electrónico:</strong> proporcionado por PayPal al
                completar una compra. Se utiliza exclusivamente para verificar el
                estado activo de tu suscripción.
              </li>
              <li>
                <strong>Identificador de orden de PayPal:</strong> utilizado para
                confirmar la transacción. No procesamos ni almacenamos información de
                tarjetas de crédito, cuentas bancarias o datos financieros, ya que el
                pago se procesa enteramente en los servidores seguros de PayPal.
              </li>
            </ul>

            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <h3 className="text-xl font-medium text-slate-800 mb-2">
                1.2 Datos que NO recopilamos
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>El contenido de tus documentos PDF.</li>
                <li>Nombres originales de los archivos procesados.</li>
                <li>Metadatos de los documentos.</li>
                <li>Historial de archivos subidos o procesados.</li>
                <li>Información de navegación ni dirección IP.</li>
                <li>Cookies de seguimiento o publicidad.</li>
                <li>Datos de tarjetas bancarias o de crédito.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              2. Procesamiento Local de Archivos
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              Todos los archivos se procesan localmente en tu dispositivo mediante
              JavaScript. El flujo de procesamiento es el siguiente:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-slate-700">
              <li>
                Seleccionas tus archivos PDF en tu navegador.
              </li>
              <li>
                La aplicación <strong>los lee en tu memoria local</strong> con la
                tecnología File API.
              </li>
              <li>
                El procesamiento (unión, compresión o extracción) ocurre 100% en tu
                CPU local con la librería pdf-lib.
              </li>
              <li>
                El resultado se descarga directamente desde tu navegador.
              </li>
              <li>Los archivos se eliminan de la memoria al cerrar la pestaña.</li>
            </ol>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 leading-relaxed">
                <strong>Seguridad:</strong> como los archivos no salen de tu
                dispositivo, el servicio funciona incluso sin conexión a internet
                (una vez cargada la aplicación). Esto elimina cualquier riesgo de
                interceptación de datos durante la transferencia.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              3. Uso del Correo Electrónico y Pagos
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              Únicamente cuando adquieres un plan Pro, la pasarela PayPal nos
              proporciona tu correo electrónico para registrar tu suscripción:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Verificación de acceso:</strong> cuando intentas procesar
                archivos, almacenamos una sesión temporal (cookie) que contiene tu
                correo y fecha de expiración, para validar que tu suscripción siga
                activa.
              </li>
              <li>
                <strong>No enviamos correos no solicitados:</strong> no utilizamos tu
                correo para marketing, boletines ni avisos no relacionados con tu
                pago.
              </li>
              <li>
                <strong>No vendemos ni compartimos tu correo</strong> con terceros,
                excepto por requerimiento legal o para proteger los derechos del
                Servicio.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              4. Almacenamiento de Datos
            </h2>
            <p className="text-slate-700 leading-relaxed">
              La información almacenada en nuestros servidores se limita a los
              registros de suscripción (correo electrónico, tipo de plan, fecha de
              expiración e identificador de orden) necesarios para gestionar los pagos
              y accesos. Esta información se conserva mientras la suscripción esté
              vigente y durante el período legalmente exigible a efectos de
              contabilidad y cumplimiento fiscal. Posteriormente, se elimina de forma
              segura.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              5. Seguridad
            </h2>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>Implementamos las siguientes medidas de seguridad:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>HTTPS obligatorio:</strong> todo el tráfico está cifrado con
                  TLS 1.2 o superior (HSTS).
                </li>
                <li>
                  <strong>Cookies HttpOnly:</strong> la sesión de suscripción se
                  almacena como cookie HttpOnly y SameSite y expira automáticamente.
                </li>
                <li>
                  <strong>Encryptación en reposo:</strong> los datos de suscripción se
                  almacenan en Supabase con cifrado en reposo gestionado por la
                  infraestructura.
                </li>
                <li>
                  <strong>Sin procesamiento de datos en servidores:</strong> al ser el
                  procesamiento del documento 100% local, no existe superficie de
                  ataque para fugas de documentos.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              6. Derechos del Usuario (ARCO / RGPD)
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              Dependiendo de tu país de residencia, puedes ejercer tus derechos de
              Acceso, Rectificación, Cancelación u Oposición (ARCO), así como los
              derechos del RGPD (acceso, portabilidad, supresión, limitación y
              oposición):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Acceso: solicitar una copia de los datos que almacenamos de ti.</li>
              <li>Rectificación: actualizar la información incorrecta o desactualizada.</li>
              <li>Supresión: solicitar la eliminación completa de tus datos de suscripción.</li>
              <li>Oposición: oponerte a cualquier tratamiento de tus datos.</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-3">
              Para ejercer alguno de estos derechos, contáctanos a través de los
              canales públicos del proyecto y te responderemos en un plazo máximo de
              30 días.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              7. Servicios de Terceros
            </h2>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <h3 className="text-xl font-medium text-slate-800">7.1 PayPal</h3>
              <p>
                Utilizamos PayPal para procesar pagos. Al comprar un plan, PayPal
                maneja tus datos financieros conforme a su propia Política de
                Privacidad. No compartimos tus documentos con PayPal, solo el correo
                y el identificador de la transacción. Te recomendamos consultar la{' '}
                <a
                  href="https://www.paypal.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline font-medium"
                >
                  Política de Privacidad de PayPal
                </a>
                .
              </p>
              <h3 className="text-xl font-medium text-slate-800 mt-4 mb-2">
                7.2 Proveedor de hosting / BBDD (Supabase)
              </h3>
              <p>
                Los registros de suscripciones se almacenan en Supabase, cuyo
                servidor se encuentra en EE.UU. y cuenta con certificaciones de
                seguridad relevantes en la industria. No procesan documentos.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              8. Transferencia Internacional de Datos
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Cuando realizas un pago, los datos de la transacción pueden transferirse
              a servidores de PayPal en los EE.UU. u otros países. Al aceptar esta
              Política de Privacidad, consientes las transferencias internacionales
              necesarias para procesar tu pago.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              9. Retención de Datos
            </h2>
            <p className="text-slate-700 leading-relaxed">
              La información de suscripción se conserva mientras el registro esté
              vigente y durante el período de retención legal aplicable (normalmente
              de 6 a 10 años en cuentas fiscales). Al finalizar la membresía, los
              datos se eliminan automáticamente. Los documentos PDF que procesas no se
              conservan en ningún momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              10. Cambios en esta Política
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Podemos actualizar esta Política de Privacidad periódicamente. Cuando se
              produzcan cambios sustanciales, se publicará mediante notificación en el
              sitio oficial o por correo electrónico en caso de tener tu correo del
              registro de pago. Te recomendamos revisar esta página de vez en cuando.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              11. Derecho de Reembolso y Contacto
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Para preguntas sobre privacidad, solicitudes de datos o reembolsos,
              puedes contactarnos mediante los canales oficiales del proyecto. Las
              solicitudes de reembolso por defectos técnicos deben presentarse dentro
              de las 24 horas tras la compra, tal como se detalla en los{' '}
              <a href="/terms" className="text-primary-600 hover:underline font-medium">
                Términos de Servicio
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}