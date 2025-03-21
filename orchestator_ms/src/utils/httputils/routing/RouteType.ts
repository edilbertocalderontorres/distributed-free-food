/**
 * Representa un objeto de configuración de ruta.
 * 
 * @property {string} method - El método HTTP para la ruta (por ejemplo, GET, POST, PUT, DELETE).
 * @property {string} path - el path URL para la ruta.
 * @property {Function} handler - La función que maneja las solicitudes a la ruta.
 * @property {any} controller - El controlador asociado con la ruta.
 */

export type RouteLinkType = { method: string; path: string; handler: Function, controller: any };