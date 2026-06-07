# AgroFresh ERP — Sistema de Gestión Empresarial
### Proyecto universitario — Contabilidad I · 2026

---

## Estructura del proyecto

```
agrofresh-erp/
│
├── index.html          ← Página principal (abrir en navegador)
│
├── css/
│   └── styles.css      ← Todos los estilos visuales
│
└── js/
    └── app.js          ← Toda la lógica e interactividad
```

---

## Cómo abrir el proyecto en Visual Studio Code

1. Abre **Visual Studio Code**
2. Ve a `Archivo > Abrir carpeta...`
3. Selecciona la carpeta `agrofresh-erp`
4. Haz clic derecho sobre `index.html`
5. Selecciona **"Abrir con Live Server"** *(requiere la extensión Live Server)*

> Si no tienes Live Server instalado:
> - Ve a Extensiones (Ctrl+Shift+X)
> - Busca **Live Server** de Ritwick Dey
> - Instálala y vuelve al paso 4

También puedes simplemente hacer doble clic en `index.html`
para abrirlo directamente en tu navegador.

---

## Módulos del sistema

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | KPIs, gráfica de ventas mensuales, alertas |
| **Inventario** | Productos, stock, precios, búsqueda en vivo |
| **Ventas** | Listado de facturas y formulario de nueva venta con IVA automático |
| **Compras** | Proveedores y órdenes de compra |
| **Recursos Humanos** | Planilla, IGSS (4.83%), resumen de nómina |
| **Contabilidad** | Libro diario, estado de resultados, balance general |
| **Reportes** | Barras de stock y categorías de ventas |

---

## Tecnologías usadas

- **HTML5** — estructura del sistema
- **CSS3** — estilos y diseño responsivo
- **JavaScript (Vanilla)** — lógica sin frameworks externos
- **Tabler Icons** — iconografía (carga desde CDN, requiere internet)

---

## Empresa del proyecto

**AgroFresh Distribuciones, S.A.**
Distribución de productos alimenticios y bebidas naturales
Fundada en 2026 · Guatemala

---

## Personalización rápida

### Cambiar el nombre de la empresa
Edita la línea en `index.html`:
```html
<div class="logo-text">AgroFresh ERP</div>
```

### Cambiar colores
Edita las variables en `css/styles.css`:
```css
:root {
  --blue:      #185FA5;  /* Color principal */
  --green:     #1D9E75;  /* Color de éxito  */
  --red:       #E24B4A;  /* Color de alerta */
}
```

### Agregar un producto al inventario
En `index.html`, busca `<tbody>` dentro de `tabla-inv` y agrega:
```html
<tr>
  <td>PRD-009</td>
  <td>Nombre del producto</td>
  <td>Categoría</td>
  <td>50 u</td>
  <td>10</td>
  <td>Q 5.00</td>
  <td>Q 9.00</td>
  <td><span class="badge green">OK</span></td>
  <td><button class="btn-sm" onclick="editarProd('Nombre')">Editar</button></td>
</tr>
```

---

*Proyecto desarrollado con HTML, CSS y JavaScript puro — sin frameworks.*
