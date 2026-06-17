import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import * as cursoService from '../services/cursoService.js';

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

export const generarDiplomaPdf = async (req, res) => {
    try {
        const idCurso = req.params.id;
        
        // 1. Atrapamos el nombre del alumno que viene desde el select de React en la URL (?alumno=...)
        // Si por alguna razón llega vacío, le ponemos "Estudiante" por defecto.
        const nombreAlumno = req.query.alumno || "Estudiante";

        // 2. Traemos el nombre REAL del curso desde tu base de datos para que no quede fijo
        const cursoInfo = await cursoService.obtenerDetalleCurso(idCurso);

        // 3. Armamos el paquete de datos inyectando las variables reales
        const datosDiploma = {
            nombreAlumno: nombreAlumno, // El nombre que elegiste en el frontend
            nombreCurso: cursoInfo.nombre, // El nombre del curso de la BD
            fechaEmision: new Date().toLocaleDateString('es-AR')
        };

        // 4. Leemos el archivo HTML (.hbs)
        const templatePath = path.join(process.cwd(), 'src', 'templates', 'diploma.hbs');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');

        // 5. Compilamos la plantilla inyectando los datos
        const template = Handlebars.compile(templateHtml);
        const htmlFinal = template(datosDiploma);

        // 6. Lanzamos Puppeteer (el navegador fantasma)
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Cargamos nuestro HTML en la página
        await page.setContent(htmlFinal, { waitUntil: 'networkidle0' });

        // 7. Generamos el PDF (formato A4, apaisado, e imprimimos fondos CSS)
        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            landscape: true, 
            printBackground: true 
        });

        await browser.close();

        // 8. Enviamos el PDF crudo al Frontend
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=diploma-${idCurso}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ error: 'Error al generar el diploma' });
    }
};