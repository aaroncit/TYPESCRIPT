// Importamos las clases Logger y LoggerFactory desde la biblioteca 'slf4j-node'
import { Logger, LoggerFactory } from 'slf4j-node';

// Definición de la clase Empleado
class Empleado {
    // Constructor que recibe un id y un nombre
    constructor(public id: number, public nombre: string) { }

    // Método para comparar dos empleados basados en su id
    compareTo(other: Empleado): number {
        return this.id - other.id;
    }

    // Método para convertir el objeto Empleado a una cadena de texto
    toString(): string {
        return `Empleado ID: ${this.id}, Nombre: ${this.nombre}`;
    }
}

// Definición de la interfaz IBST (Binary Search Tree)
interface IBST<T> {
    insertar(emp: T): void; // Método para insertar un elemento en el árbol
    existe(id: number): boolean; // Método para verificar si un elemento existe en el árbol
    obtener(id: number): T | null; // Método para obtener un elemento del árbol
    esHoja(): boolean; // Método para verificar si el nodo es una hoja
    esVacio(): boolean; // Método para verificar si el árbol está vacío
    preOrden(): void; // Método para recorrer el árbol en preorden
    postOrden(): void; // Método para recorrer el árbol en postorden
    inOrden(): void; // Método para recorrer el árbol en inorden
    eliminar(id: number): void; // Método para eliminar un elemento del árbol
}

// Definición de la clase BST (Binary Search Tree)
class BST implements IBST<Empleado> {
    // Logger estático para registrar mensajes de la clase BST
    private static readonly LOGGER: Logger = LoggerFactory.getLogger(BST);

    // Propiedades de la clase BST
    private valor: Empleado | null = null; // Valor almacenado en el nodo
    private izdo: BST | null = null; // Nodo izquierdo
    private dcho: BST | null = null; // Nodo derecho
    private padre: BST | null = null; // Nodo padre

    // Método privado para insertar un empleado en el árbol
    private insertarImp(emp: Empleado, padre: BST | null): void {
        // Si el nodo está vacío, se inserta el empleado como nuevo nodo
        if (!this.valor) {
            this.valor = emp;
            this.padre = padre;
        } else {
            // Si el empleado es menor que el valor actual, se inserta en el subárbol izquierdo
            if (emp.compareTo(this.valor) < 0) {
                // Si el subárbol izquierdo no existe, se crea uno nuevo
                if (!this.izdo) {
                    this.izdo = new BST();
                }
                // Se inserta el empleado en el subárbol izquierdo recursivamente
                this.izdo.insertarImp(emp, this);
            } else if (emp.compareTo(this.valor) > 0) {
                // Si el empleado es mayor que el valor actual, se inserta en el subárbol derecho
                if (!this.dcho) {
                    this.dcho = new BST();
                }
                // Se inserta el empleado en el subárbol derecho recursivamente
                this.dcho.insertarImp(emp, this);
            } else {
                // Si el empleado ya existe en el árbol, se lanza una excepción
                throw new Error("Insertando elemento duplicado");
            }
        }
    }

    // Método público para insertar un empleado en el árbol
    public insertar(emp: Empleado): void {
        this.insertarImp(emp, null);
    }

    // Método para verificar si un empleado con el ID dado existe en el árbol
    public existe(id: number): boolean {
        if (this.valor) {
            if (id === this.valor.id) {
                return true;
            } else if (this.izdo && id < this.valor.id) {
                return this.izdo.existe(id);
            } else if (this.dcho && id > this.valor.id) {
                return this.dcho.existe(id);
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Método para obtener un empleado con el ID dado del árbol
    public obtener(id: number): Empleado | null {
        if (this.valor) {
            if (id === this.valor.id) {
                return this.valor;
            } else if (this.izdo && id < this.valor.id) {
                return this.izdo.obtener(id);
            } else if (this.dcho && id > this.valor.id) {
                return this.dcho.obtener(id);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    // Método para verificar si el nodo es una hoja (no tiene hijos)
    public esHoja(): boolean {
        return !!this.valor && !this.izdo && !this.dcho;
    }

    // Método para verificar si el árbol está vacío (no tiene nodos)
    public esVacio(): boolean {
        return !this.valor;
    }

    // Método para recorrer el árbol en preorden
    public preOrden(): void {
        this.preordenImpl("");
    }

    // Método para recorrer el árbol en postorden
    public postOrden(): void {
        this.postordenImpl("");
    }

    // Método para recorrer el árbol en inorden
    public inOrden(): void {
        this.inordenImpl("");
    }

    // Método privado para recorrer el árbol en inorden
    private inordenImpl(prefijo: string): void {
        if (this.izdo) {
            this.izdo.inordenImpl(prefijo + "  ");
        }
        BST.LOGGER.info(prefijo + this.valor);
        if (this.dcho) {
            this.dcho.inordenImpl(prefijo + "  ");
        }
    }

    // Método privado para recorrer el árbol en postorden
    private postordenImpl(prefijo: string): void {
        if (this.izdo) {
            this.izdo.postordenImpl(prefijo + "  ");
        }
        if (this.dcho) {
            this.dcho.postordenImpl(prefijo + "  ");
        }
        BST.LOGGER.info(prefijo + this.valor);
    }

    // Método privado para recorrer el árbol en preorden
    private preordenImpl(prefijo: string): void {
        if (this.valor) {
            BST.LOGGER.info(prefijo + this.valor);
            if (this.izdo) {
                this.izdo.preordenImpl(prefijo + "  ");
            }
            if (this.dcho) {
                this.dcho.preordenImpl(prefijo + "  ");
            }
        }
    }

    // Método privado para eliminar un nodo del árbol
    private eliminarImpl(id: number): void {
        if (this.izdo && this.dcho) {
            // Caso 1: El nodo a eliminar tiene dos hijos
            let sucesor: BST = this.dcho.encontrarMenor();
            this.valor = sucesor.valor;
            this.dcho.eliminar(sucesor.valor.id);
        } else if (this.izdo || this.dcho) {
            // Caso 2: El nodo a eliminar tiene un hijo
            let hijo: BST | null = this.izdo || this.dcho;
            if (this.padre) {
                if (this === this.padre.izdo) {
                    this.padre.izdo = hijo;
                } else {
                    this.padre.dcho = hijo;
                }
                if (hijo) hijo.padre = this.padre;
            } else {
                this.valor = hijo?.valor || null;
                this.izdo = hijo?.izdo || null;
                this.dcho = hijo?.dcho || null;
            }
        } else {
            // Caso 3: El nodo a eliminar es una hoja
            if (this.padre) {
                if (this === this.padre.izdo) {
                    this.padre.izdo = null;
                } else {
                    this.padre.dcho = null;
                }
                this.padre = null;
            } else {
                this.valor = null;
            }
        }
    }

    // Método público para eliminar un nodo del árbol
    public eliminar(id: number): void {
        if (this.valor) {
            if (id === this.valor.id) {
                this.eliminarImpl(id);
            } else if (this.izdo && id < this.valor.id) {
                this.izdo.eliminar(id);
            } else if (this.dcho && id > this.valor.id) {
                this.dcho.eliminar(id);
            }
        }
    }

    // Método para encontrar el nodo con el menor valor en el subárbol
    private encontrarMenor(): BST {
        let actual: BST = this;
        while (actual.izdo) {
            actual = actual.izdo;
        }
        return actual;
    }
}
