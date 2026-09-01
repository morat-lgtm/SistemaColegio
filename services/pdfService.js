const puppeteer = require("puppeteer");


// ==========================
// GENERAR PDF DESDE HTML
// ==========================

class PdfService {


    async generarPDF(html) {

        let browser = null;


        try {

            console.log(
                "PDF SERVICE: iniciando generación..."
            );


            // ==========================
            // VALIDAR HTML
            // ==========================

            if (!html || html.trim() === "") {

                throw new Error(
                    "No se recibió contenido HTML para generar el PDF."
                );

            }


            // ==========================
            // ABRIR NAVEGADOR
            // ==========================

            browser = await puppeteer.launch({

                headless: true,

                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox"
                ]

            });


            // ==========================
            // CREAR PÁGINA
            // ==========================

            const page =
                await browser.newPage();


            // ==========================
            // CARGAR HTML
            // ==========================

            await page.setContent(
                html,
                {
                    waitUntil: "networkidle0"
                }
            );


            // ==========================
            // GENERAR PDF
            // ==========================

            const pdf =
                await page.pdf({

                    format: "A4",

                    printBackground: true,

                    margin: {

                        top: "15mm",

                        right: "15mm",

                        bottom: "15mm",

                        left: "15mm"

                    }

                });


            console.log(
                "PDF SERVICE: PDF generado correctamente."
            );


            return pdf;


        }
        catch (error) {


            console.error(
                "PDF SERVICE: error generando PDF:",
                error
            );


            throw error;


        }
        finally {


            // ==========================
            // CERRAR NAVEGADOR
            // ==========================

            if (browser) {

                await browser.close();

            }

        }

    }

}


// ==========================
// EXPORTAR
// ==========================

module.exports =
    new PdfService();