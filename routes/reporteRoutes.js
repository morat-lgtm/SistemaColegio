const express = require("express");

const reporteController =
    require("../controllers/reporteController");

const pdfService =
    require("../services/pdfService");


const router = express.Router();


// ==========================
// RANKING GENERAL DE SALIDAS
// ==========================

router.get(
    "/ranking",
    async (req, res) => {

        try {

            const resultado =
                await reporteController
                    .getRankingSalidas();


            res.json(
                resultado
            );


        } catch (error) {

            console.error(
                "Error ranking salidas:",
                error
            );


            res.status(500).json({

                error:
                    error.message

            });

        }

    }
);


// ==========================
// REPORTE POR ESTUDIANTE
// ==========================

router.get(
    "/estudiante/:id",
    async (req, res) => {

        try {

            const resultado =
                await reporteController
                    .getReportePorEstudiante(
                        req.params.id
                    );


            res.json(
                resultado
            );


        } catch (error) {

            console.error(
                "Error reporte estudiante:",
                error
            );


            res.status(500).json({

                error:
                    error.message

            });

        }

    }
);


// ==========================
// REPORTE POR FECHA
// ==========================

router.get(
    "/fecha/:fecha",
    async (req, res) => {

        try {

            const resultado =
                await reporteController
                    .getReportePorFecha(
                        req.params.fecha
                    );


            res.json(
                resultado
            );


        } catch (error) {

            console.error(
                "Error reporte fecha:",
                error
            );


            res.status(500).json({

                error:
                    error.message

            });

        }

    }
);


// ==========================
// EXPORTAR PDF
// ==========================

router.post(
    "/exportar-pdf",
    async (req, res) => {

        try {

            console.log(
                "REPORTE ROUTES: solicitud de exportación PDF"
            );


            const html =
                req.body.html;


            if (!html) {

                return res.status(400).json({

                    success: false,

                    error:
                        "No se recibió contenido HTML."

                });

            }


            const pdf =
                await pdfService.generarPDF(
                    html
                );


            res.setHeader(
                "Content-Type",
                "application/pdf"
            );


            res.setHeader(
                "Content-Disposition",
                "attachment; filename=reporte.pdf"
            );


            res.send(
                pdf
            );


        }
        catch (error) {

            console.error(
                "Error exportando PDF:",
                error
            );


            res.status(500).json({

                success: false,

                error:
                    error.message

            });

        }

    }
);


// ==========================
// EXPORTAR ROUTER
// ==========================

module.exports =
    router;