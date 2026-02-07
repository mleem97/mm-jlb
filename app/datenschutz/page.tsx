"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { ObfuscatedText } from "@/components/ObfuscatedText";
import { Card, CardContent } from "@/components/ui/card";

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Datenschutzerklärung
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            Informationen zum Datenschutz gemäß DSGVO (Stand: Februar 2026).
          </p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">1. Verantwortlicher</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <ObfuscatedText
                    encoded="TWV5ZXIgTWVkaWEKQW0gRnJpZWRyaWNoLUViZXJ0LVBhcmsgMWEKMzExNTcgU2Fyc3RlZHQKRGV1dHNjaGxhbmQ="
                    multiline
                    revealLabel="Adresse anzeigen"
                  />
                </p>
                <div className="text-sm text-muted-foreground leading-relaxed mt-3">
                  <ul className="space-y-1">
                    <li>
                      <ObfuscatedText
                        label="Telefon:"
                        encoded="MDUwNjYgNjk1IDU3IDgzIC0gKEtlaW4gU3VwcG9ydCk="
                        asLinkType="tel"
                        revealLabel="Telefon anzeigen"
                      />
                    </li>
                    <li>
                      <ObfuscatedText
                        label="E-Mail:"
                        encoded="a29udGFrdEBtZXllcm1lZGlhLmV1"
                        asLinkType="mailto"
                        revealLabel="E-Mail anzeigen"
                      />
                    </li>
                    <li>
                      GitHub Issue:
                      <a
                        href="https://github.com/mleem97/mm-jlb/issues/new/choose"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-indigo-500 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
                      >
                        Issue erstellen
                      </a>
                    </li>
                    <li>
                      Website:
                      <a
                        href="https://meyermedia.eu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-indigo-500 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
                      >
                        meyermedia.eu
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">2. Erhebung und Speicherung personenbezogener Daten</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  2.1 Beim Besuch der Website: Beim Aufrufen unserer Website werden durch den auf
                  Ihrem Endgerät verwendeten Browser automatisch Informationen an den Server unserer
                  Website gesendet. Diese Informationen werden temporär in einem Logfile gespeichert.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  Wir vermeiden so weit wie möglich die Verarbeitung personenbezogener Daten auf unseren
                  Servern. Sollte sich dies nicht vermeiden lassen (auch nur temporär), aktualisieren wir
                  die nachfolgende Liste.
                </p>
                <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Liste der serverseitigen Verarbeitungen (derzeit keine):
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Derzeit keine Einträge</li>
                  </ul>
                </div>
                <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Folgende Informationen werden dabei erfasst und bis zur automatisierten Löschung gespeichert:
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>IP-Adresse des anfragenden Rechners</li>
                    <li>Datum und Uhrzeit des Zugriffs</li>
                    <li>Name und URL der abgerufenen Datei</li>
                    <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                    <li>Verwendeter Browser und ggf. das Betriebssystem</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">3. Verwendung von Cookies</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  3.1 Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die im
                  Browser bzw. vom Browser auf dem Computersystem des Nutzers gespeichert werden.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  3.2 Wir verwenden folgende Arten von Cookies:
                </p>
                <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1">
                  <li>Technisch notwendige Cookies: Diese Cookies sind erforderlich, um die grundlegenden Funktionen der Website zu gewährleisten.</li>
                  <li>Technisch notwendige Darstellung: Die automatische Auswahl des Dark/Light Mode erfolgt anhand der Systemeinstellungen Ihres Browsers/Endgeräts. Eine aktive Auswahl durch den Nutzer erfolgt nicht.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">4. Kontaktaufnahme</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  4.1 Bei der Kontaktaufnahme mit uns (z. B. per Kontaktformular oder E-Mail) werden
                  die von Ihnen mitgeteilten Daten von uns gespeichert, um Ihre Fragen zu bearbeiten
                  und mögliche Anschlussfragen zu beantworten.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  4.2 Die in diesem Zusammenhang anfallenden Daten löschen wir, nachdem die Speicherung
                  nicht mehr erforderlich ist, oder schränken die Verarbeitung ein, falls gesetzliche
                  Aufbewahrungspflichten bestehen.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  4.3 Für den Import von LinkedIn/XING-Daten sowie für OCR-basierte PDF-Parsing-Prozesse
                  verarbeiten wir die Daten temporär auf einem Caching-Server bzw. in einem S3-Zwischenspeicher,
                  um die Extraktion und Normalisierung durchzuführen. Nach Beenden der Sitzung werden diese
                  temporären Daten vollständig von unseren Servern gelöscht.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">5. Rechtsgrundlage der Datenverarbeitung</h2>
                <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1">
                  <li>Art. 6 Abs. 1 lit. f DSGVO: Wahrung berechtigter Interessen (Bereitstellung und Sicherheit der Website).</li>
                  <li>Art. 6 Abs. 1 lit. b DSGVO: Vertragserfüllung oder vorvertragliche Maßnahmen.</li>
                  <li>Art. 6 Abs. 1 lit. a DSGVO: Verarbeitung aufgrund Ihrer Einwilligung.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">6. Weitergabe von Daten</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  6.1 Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im
                  Folgenden aufgeführten Zwecken findet nicht statt.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  6.2 Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
                </p>
                <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1">
                  <li>Sie ausdrücklich eingewilligt haben (Art. 6 Abs. 1 lit. a DSGVO).</li>
                  <li>Die Weitergabe zur Erfüllung eines Vertrags erforderlich ist (Art. 6 Abs. 1 lit. b DSGVO).</li>
                  <li>Eine gesetzliche Verpflichtung zur Weitergabe besteht (Art. 6 Abs. 1 lit. c DSGVO).</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">7. Hosting</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  7.1 Unsere Website wird extern gehostet. Die personenbezogenen Daten, die auf
                  dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  7.2 Das Hosting erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren Kunden
                  (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten
                  Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter
                  (Art. 6 Abs. 1 lit. f DSGVO).
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  7.3 Hosting bei Anbietern aus Drittstaaten: Der App-Host ist Vercel, der DNS-Provider ist
                  Cloudflare. Wir achten soweit wie möglich darauf, dass unsere Dienste in der EU gehostet
                  werden. Aufgrund der technischen Funktionsweise der DNS-Infrastruktur und der globalen
                  Routing-Architektur von Vercel/Cloudflare kann jedoch nicht ausgeschlossen werden, dass
                  technisch notwendige Daten in Einzelfällen auch in Drittstaaten verarbeitet werden.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border/50 p-4">
                  <h3 className="text-sm font-semibold mb-2">Vercel (App-Hosting)</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <ObfuscatedText
                      encoded="VmVyY2VsIEluYy4KNDQwIE4gQmFycmFuY2EgQXZlbnVlICM0MTMzCkNvdmluYSwgQ0EgOTE3MjMKVW5pdGVkIFN0YXRlcw=="
                      multiline
                      revealLabel="Adresse anzeigen"
                    />
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    <ObfuscatedText
                      label="E-Mail:"
                      encoded="cHJpdmFjeUB2ZXJjZWwuY29t"
                      asLinkType="mailto"
                      revealLabel="E-Mail anzeigen"
                    />
                    <br />
                    Support:
                    <a
                      href="https://vercel.com/help"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-indigo-500 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
                    >
                      Vercel Support
                    </a>
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4">
                  <h3 className="text-sm font-semibold mb-2">Cloudflare (DNS)</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <ObfuscatedText
                      encoded="Q2xvdWRmbGFyZSwgSW5jLgoxMDEgVG93bnNlbmQgU3QuClNhbiBGcmFuY2lzY28sIENBIDk0MTA3ClVTQQ=="
                      multiline
                      revealLabel="Adresse anzeigen"
                    />
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    <ObfuscatedText
                      label="E-Mail:"
                      encoded="ZHBvQGNsb3VkZmxhcmUuY29t"
                      asLinkType="mailto"
                      revealLabel="E-Mail anzeigen"
                    />
                    <br />
                    Support:
                    <a
                      href="https://dash.cloudflare.com/?to=/:account/support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-indigo-500 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
                    >
                      Cloudflare Support
                    </a>
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4">
                  <h3 className="text-sm font-semibold mb-2">Hetzner Online GmbH</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <ObfuscatedText
                      encoded="SW5kdXN0cmllc3RyLiAyNQo5MTcxMCBHdW56ZW5oYXVzZW4KRGV1dHNjaGxhbmQ="
                      multiline
                      revealLabel="Adresse anzeigen"
                    />
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    <ObfuscatedText
                      label="E-Mail:"
                      encoded="aW5mb0BoZXR6bmVyLmNvbQ=="
                      asLinkType="mailto"
                      revealLabel="E-Mail anzeigen"
                    />
                    <br />
                    <ObfuscatedText
                      label="Telefon:"
                      encoded="KzQ5ICgwKSA5ODMxIDUwNS0w"
                      asLinkType="tel"
                      revealLabel="Telefon anzeigen"
                    />
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4">
                  <h3 className="text-sm font-semibold mb-2">MVNet Solutions UG (haftungsbeschränkt)</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <ObfuscatedText
                      encoded="R2VzY2jDpGZ0c2bDvGhyZXI6IERhbmlsbyBFcmljaCBTdMOkbmRlcgpQZXN0YWxvenppc3RyYcOfZSAxMgoxNzMwOSBQYXNld2FsawpEZXV0c2NobGFuZA=="
                      multiline
                      revealLabel="Adresse anzeigen"
                    />
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    <ObfuscatedText
                      label="E-Mail:"
                      encoded="bWFpbEBtdm5ldHNvbHV0aW9ucy5kZQ=="
                      asLinkType="mailto"
                      revealLabel="E-Mail anzeigen"
                    />
                    <br />
                    <ObfuscatedText
                      label="Poststelle:"
                      encoded="cG9zdHN0ZWxsZUBtdm5ldHNvbHV0aW9ucy5kZQ=="
                      asLinkType="mailto"
                      revealLabel="E-Mail anzeigen"
                    />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">8. Ihre Rechte als betroffene Person</h2>
                <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1">
                  <li>Auskunftsrecht (Art. 15 DSGVO)</li>
                  <li>Berichtigungsrecht (Art. 16 DSGVO)</li>
                  <li>Löschungsrecht (Art. 17 DSGVO)</li>
                  <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                  <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                  <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
                  <li>Beschwerderecht bei einer Aufsichtsbehörde</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">9. Speicherdauer</h2>
                <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1">
                  <li>Wir speichern personenbezogene Daten nur so lange, wie dies für die Erfüllung der verfolgten Zwecke erforderlich ist oder sofern dies durch Gesetze vorgeschrieben ist.</li>
                  <li>Logfiles werden nach spätestens 7 Tagen automatisch gelöscht.</li>
                  <li>Kontaktdaten werden nach Abschluss der Kommunikation bzw. nach Ende der Geschäftsbeziehung gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">10. Sicherheit</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  10.1 Wir treffen nach Maßgabe des Art. 32 DSGVO unter Berücksichtigung des Stands
                  der Technik angemessene technische und organisatorische Maßnahmen, um ein dem Risiko
                  angemessenes Schutzniveau zu gewährleisten.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  10.2 Unsere Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung eine
                  SSL- bzw. TLS-Verschlüsselung.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">11. Änderungen dieser Datenschutzerklärung</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  11.1 Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets
                  den aktuellen rechtlichen Anforderungen entspricht.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  11.2 Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  Bei Fragen zum Datenschutz kontaktieren Sie uns unter:{" "}
                  <ObfuscatedText
                    encoded="a29udGFrdEBtZXllcm1lZGlhLmV1"
                    asLinkType="mailto"
                    revealLabel="E-Mail anzeigen"
                  />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}