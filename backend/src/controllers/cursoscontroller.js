import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import * as cursoService from '../services/cursoService.js';

// Lista todos los cursos soportando paginación y búsqueda por texto
export const getCursos = async (req, res) => {
    try {
        const { limit, offset, search } = req.query; 
        const resultado = await cursoService.listarCursos(limit, offset, search); 
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar el catálogo' });
    }
};

// Trae la información detallada de un solo curso por su ID
export const getCursoId = async (req, res) => {
    try {
        const curso = await cursoService.obtenerDetalleCurso(req.params.id);
        res.json(curso);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Curso no encontrado o inactivo' });
        }
        console.error('Error al obtener el detalle del curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crea un curso nuevo guardando también qué usuario hizo la acción
export const crearCurso = async (req, res) => {
    try {
        const id_usuario = req.usuario.id; 
        const nuevoCurso = await cursoService.registrarCurso(req.body, id_usuario);
        res.status(201).json(nuevoCurso);
    } catch (error) {
        if (error.message === 'VALIDATION_ERROR') {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        console.error('Error al crear curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Edita los datos de un curso existente
export const actualizarCurso = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const cursoActualizado = await cursoService.actualizarDatosCurso(req.params.id, req.body, id_usuario);
        res.json(cursoActualizado);
    } catch (error) {
        if (error.message === 'VALIDATION_ERROR') {
            return res.status(400).json({ error: 'Todos los campos son obligatorios para actualizar' });
        }
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        console.error('Error al actualizar curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Aplica la baja lógica de un curso (no lo borra definitivamente de la BD)
export const eliminarCurso = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        await cursoService.darDeBajaCurso(req.params.id, id_usuario);
        res.json({ message: 'Curso eliminado correctamente' });
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        console.error('Error al eliminar curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Renderiza la plantilla HTML con los datos reales y devuelve un archivo PDF
export const generarDiplomaPdf = async (req, res) => {
    try {
        const idCurso = req.params.id;
        const nombreAlumno = req.query.alumno || "Estudiante";

        // Buscamos los datos del curso para inyectarlos en el diploma
        const cursoInfo = await cursoService.obtenerDetalleCurso(idCurso);

        const datosDiploma = {
            nombreAlumno: nombreAlumno, 
            nombreCurso: cursoInfo.nombre, 
            fechaEmision: new Date().toLocaleDateString('es-AR')
        };

        // Preparamos el HTML con Handlebars
        const templatePath = path.join(process.cwd(), 'src', 'templates', 'diploma.hbs');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');

        const template = Handlebars.compile(templateHtml);
        const htmlFinal = template(datosDiploma);

        // Levantamos el navegador invisible para imprimir el PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.setContent(htmlFinal, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            landscape: true, 
            printBackground: true 
        });

        await browser.close();

        // Enviamos el PDF al frontend listo para descargar
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=diploma-${idCurso}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ error: 'Error al generar el diploma' });
    }
};