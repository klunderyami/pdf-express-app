import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos de Servicio - DocExpress',
  description:
    'Términos y condiciones de uso del servicio DocExpress para procesamiento de documentos PDF.',
}

export default function TermsPage() {
  const lastUpdated = '18 de agosto de 2026'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Términos de Servicio
          </h1>
          <p className="text-slate-600">
            Última actualización: {lastUpdated}
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              1. Aceptación de los Términos
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Al acceder y utilizar DocExpress (en adelante, "el Servicio"), usted
              acepta cumplir con estos Términos de Servicio. Si no está de acuerdo con
              alguna parte de estos términos, no debe utilizar el Servicio. Estos
              términos constituyen un acuerdo legal vinculante entre usted y DocExpress.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              2. Descripción del Servicio
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              DocExpress es una herramienta web que permite a los usuarios unir,
              comprimir y extraer páginas de archivos PDF (el "Servicio"). Las
              herramientas disponibles incluyen:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Unión de múltiples archivos PDF en un solo documento.</li>
              <li>Compresión de archivos PDF para reducir su tamaño.</li>
              <li>Extracción de páginas específicas de un documento PDF.</li>
            </ul>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium mb-2">Procesamiento Local</p>
              <p className="text-blue-700 leading-relaxed">
                Todos los archivos se procesan íntegramente en el navegador del
                usuario. Los documentos <strong>en ningún momento se suben a un
                servidor</strong> y son eliminados automáticamente al cerrar la
                sesión. El procesamiento local garantiza la confidencialidad total
                de los datos del usuario.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              3. Uso Permitido
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Al utilizar el Servicio, usted se compromete a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>No usar el Servicio para actividades ilegales o no autorizadas.</li>
              <li>
                No subir o procesar documentos que contengan contenido ilegal,
                difamatorio, fraudulento o que infrinja derechos de terceros.
              </li>
              <li>
                No intentar vulnerar la seguridad del Servicio, incluyendo intentos
                de acceso no autorizado a datos o sistemas.
              </li>
              <li>
                No utilizar el Servicio para distribuir malware, virus o cualquier
                código dañino.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              4. Planes y Suscripciones
            </h2>
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              4.1 Plan Gratuito (Freemium)
            </h3>
            <p className="text-slate-700 leading-relaxed">
              El plan gratuito permite el procesamiento de hasta 3 archivos y un
              tamaño máximo de 20 MB por lote. El acceso al plan gratuito está sujeto
              a las tarifas y límites vigentes en el momento del uso.
            </p>
            <h3 className="text-lg font-medium text-slate-800 mt-4 mb-2">
              4.2 Planes de Pago (Pro)
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Los planes de pago, incluyendo el Pase de Urgencia (24 horas) y la
              Membresía Pro (mensual), ofrecen procesamiento sin límite de archivos.
              Los precios se publican en la plataforma y pueden estar sujetos a
              cambios con notificación previa.
            </p>
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium mb-2">Política de Reembolsos</p>
              <p className="text-green-700 leading-relaxed">
                Debido a la naturaleza digital e inmediata del Servicio, así como al
                procesamiento local que impide comprobar el uso real del servicio,
                <strong> no se ofrecen reembolsos </strong> una vez realizado el pago,
                salvo que el servicio resulte técnicamente defectuoso y no pueda
                completar la operación contratada. Las solicitudes de reembolso por
                defectos técnicos deben realizarse dentro de las 24 horas siguientes
                a la compra.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              5. Pagos y Pasarela PayPal
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Los pagos se procesan de forma segura a través de PayPal. Al realizar
              un pago, usted acepta los Términos de Servicio y la Política de
              Privacidad de PayPal. DocExpress no almacena información de tarjetas de
              crédito, números de cuentas bancarias ni datos financieros de los
              usuarios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              6. Propiedad Intelectual
            </h2>
            <p className="text-slate-700 leading-relaxed">
              El software, el diseño, los gráficos, los textos y todos los demás
              elementos que conforman DocExpress son propiedad exclusiva de DocExpress
              o de sus licenciantes y están protegidos por las leyes de propiedad
              intelectual vigentes. Los documentos que usted procesa siguen siendo de
              su propiedad y usted es completamente responsable de su contenido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              7. Limitación de Responsabilidad
            </h2>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p>
                DocExpress se proporciona &ldquo;tal cual&rdquo; y &ldquo;según
                disponibilidad&rdquo;, sin garantías de ningún tipo, expresas o
                implícitas. Usted asume la completa responsabilidad por el uso de la
                herramienta y por los documentos que procese.
              </p>
              <p>
                En ningún caso DocExpress será responsable por daños directos,
                indirectos, incidentales, especiales o consecuentes que resulten del
                uso o la imposibilidad de uso del Servicio, incluso si se ha
                informado de la posibilidad de dichos daños.
              </p>
              <p>
                Los datos introducidos por el usuario se procesan localmente en su
                equipo; no obstante, cualquier pérdida de información derivada de un
                mal uso o de un fallo del navegador no será responsabilidad de
                DocExpress.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              8. Privacidad
            </h2>
            <p className="text-slate-700 leading-relaxed">
              El procesamiento de archivos se realiza en el navegador del usuario y
              los documentos no se almacenan en servidores propios. Para conocer
              cómo manejamos la información y la privacidad, consulte nuestra{' '}
              <a href="/privacy" className="text-primary-600 hover:underline font-medium">
                Política de Privacidad
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              9. Modificaciones de los Términos
            </h2>
            <p className="text-slate-700 leading-relaxed">
              DocExpress se reserva el derecho de modificar estos Términos de Servicio
              en cualquier momento. Los cambios serán publicados en esta página con
              una fecha de actualización revisada. El uso continuado del Servicio
              después de la publicación de los cambios constituye la aceptación de
              los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              10. Ley Aplicable
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Estos Términos de Servicio se rigen por las leyes de los Estados Unidos
              Mexicanos, sin perjuicio de sus principios de conflictos de leyes. Cualquier
              disputa que surja en relación con estos términos será sometida a la
              jurisdicción exclusiva de los tribunales competentes de la Ciudad de
              México, México.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              11. Contacto
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Para cualquier pregunta, comentario o solicitud sobre estos Términos de
              Servicio, puede contactarnos directamente a través del formulario de
              contacto disponible en nuestro repositorio público o mediante los
              canales oficiales del proyecto.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}