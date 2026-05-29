# Distribuidora de Leña y Carbón - Backend API

Backend del sistema de gestión de ventas, caja y stock para una distribuidora mayorista y minorista de leña y carbón. Construido con Java 17 y Spring Boot 3 siguiendo arquitectura limpia, principios SOLID y TDD.

## Requisitos
- Java 17
- Maven
- MySQL (u otro RDBMS configurado en `application.yml`)

## Configuración y Ejecución
1. Configurar la base de datos en `src/main/resources/application.yml` (por defecto usa `root` sin contraseña en localhost:3306).
2. Para compilar y correr tests:
   ```bash
   mvn clean test
   ```
3. Para iniciar la aplicación:
   ```bash
   mvn spring-boot:run
   ```

## Estructura de la Aplicación
- **Controllers**: Exponen la API REST.
- **Services**: Lógica de negocio (Transaccional, validaciones de stock, caja).
- **Repositories**: Interfaces Spring Data JPA para acceso a base de datos.
- **Entities**: Mapeo ORM.
- **DTOs**: Objetos de transferencia de datos con validaciones de Jakarta (Bean Validation).

## APIs Principales

### Productos
- `GET /api/v1/productos` - Lista de productos.
- `POST /api/v1/productos` - Crear producto.
- `POST /api/v1/productos/actualizar-precios` - **[Crítico]** Actualiza masivamente los precios (mayorista/minorista) en base a un porcentaje.

### Ventas
- `POST /api/v1/ventas` - Registra una venta, descuenta el stock de forma atómica y suma a la caja diaria. Retorna error si no hay caja abierta o stock insuficiente.
- `GET /api/v1/ventas` - Historial de ventas.

### Caja Diaria
- `POST /api/v1/caja/abrir` - Abre la caja del día con un saldo inicial.
- `POST /api/v1/caja/cerrar` - Cierra la caja del día.
- `GET /api/v1/caja/balance` - Muestra los ingresos y el balance actual.

## Manejo de Errores
Se implementó un `GlobalExceptionHandler` que intercepta excepciones de negocio (`BusinessException`, `InsufficientStockException`) y de validación (`MethodArgumentNotValidException`) devolviendo siempre una estructura JSON limpia con el detalle del error.