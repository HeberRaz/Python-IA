
/**
 * Insertion Sort · Laboratorio interactivo
 *
 * Arquitectura:
 * 1. Contenido educativo y plantillas de Python.
 * 2. Estado y persistencia en localStorage.
 * 3. Simulación del algoritmo.
 * 4. Renderizado de la interfaz.
 * 5. Controladores de eventos.
 * 6. Ejecución de Python mediante Web Worker.
 */

'use strict';

// ============================================================
// 1. CONFIGURACIÓN
// ============================================================

const STORAGE_KEY = 'lab-algo-insertion-sort-v1';

const INITIAL_ARRAY = Object.freeze([5, 3, 4, 1, 2]);

const PYODIDE_BASE_URL =
  'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';

const EXECUTION_TIMEOUT_MS = 25000;

const FORMSPREE_ENDPOINT =
  'https://formspree.io/f/mjywjano';

// Conserva el resultado más reciente de las pruebas.
// No representa una calificación verificada.
let latestTestResults = null;
let codeRevision = 0;

let isSubmitting = false;


// ============================================================
// 2. PLANTILLAS DE PYTHON
// ============================================================

const STARTER_CODE = `def insertion_sort(arr):
    # FOR EXTERNO: selecciona cada elemento pendiente
    for i in range(____, ____):
        key = ____
        position = ____

        # FOR INTERNO: compara hacia la izquierda
        for j in range(____, ____, ____):
            if ____:
                ____
                position = ____
            else:
                ____

        arr[____] = key

    return arr`;

const SOLUTION_CODE = `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        position = i

        for j in range(i - 1, -1, -1):
            if arr[j] > key:
                arr[j + 1] = arr[j]
                position = j
            else:
                break

        arr[position] = key

    return arr`;

// ============================================================
// 3. CONTENIDO EDUCATIVO
// ============================================================

const MISSIONS = [
  {
    name: 'Pensar como ordenador',
    short: 'La región ordenada',

    intro:
      'Antes de programar, piensa cómo organizarías tarjetas ' +
      'con números. No necesitas ordenar todo a la vez: ' +
      'puedes ir formando una parte ordenada.',

    questions: [
      '¿Una sola tarjeta necesita ordenarse?',
      'Si ya ordenaste las primeras tarjetas, ¿cómo agregarías la siguiente?',
      '¿Qué permanece verdadero después de cada inserción?'
    ],

    question:
      'Si solo observas el primer número (5), ¿qué puedes afirmar?',

    options: [
      'Ya está ordenado por sí mismo.',
      'Necesitamos compararlo con todos los demás.',
      'Es necesariamente el menor número del arreglo.'
    ],

    correct: 0,

    hint:
      'Con una sola tarjeta no existe ninguna pareja ' +
      'que esté en orden incorrecto.',

    explanation:
      'Una región que contiene un solo elemento está ordenada. ' +
      'Podemos comenzar con [5] como región ordenada e incorporar ' +
      'los demás uno por uno.',

    conclusion:
      'Primera idea: mantener una región izquierda ordenada ' +
      'e ir ampliándola.'
  },

  {
    name: 'Seleccionar el siguiente',
    short: 'El primer for',

    intro:
      'Si el primer elemento ya forma una región ordenada, ' +
      'ahora necesitamos seleccionar cada elemento restante, ' +
      'de izquierda a derecha.',

    questions: [
      '¿Cuál es el primer índice pendiente en Python?',
      '¿Qué patrón de recorrido se repetirá?',
      '¿Qué estructura describe un recorrido con principio y final conocidos?'
    ],

    question:
      '¿Qué recorrido selecciona exactamente todos los elementos pendientes?',

    options: [
      'for i in range(0, len(arr)):',
      'for i in range(1, len(arr)):',
      'for i in range(1, len(arr) - 1):'
    ],

    correct: 1,

    hint:
      'El índice 0 ya está procesado; recuerda que el extremo ' +
      'final de range() no se incluye.',

    explanation:
      'El for externo empieza en 1, selecciona 3, 4, 1 y 2, ' +
      'y termina en el último índice. La variable i representa ' +
      'el elemento a insertar.',

    conclusion:
      'El primer for decide QUÉ elemento insertar, no DÓNDE colocarlo.'
  },

  {
    name: 'Comparar hacia atrás',
    short: 'El segundo for',

    intro:
      'Si ya tenemos [3, 5] ordenados y seleccionamos 4, ' +
      'conviene comenzar comparándolo con 5 y avanzar hacia la izquierda.',

    questions: [
      'Si el seleccionado está en i, ¿dónde está su vecino izquierdo?',
      '¿En qué dirección buscaremos su posición?',
      '¿Cómo lograrías visitar también el índice 0 con range()?'
    ],

    question:
      '¿Qué for recorre desde el elemento anterior hasta el índice 0, hacia atrás?',

    options: [
      'for j in range(i, 0, -1):',
      'for j in range(0, i - 1):',
      'for j in range(i - 1, -1, -1):'
    ],

    correct: 2,

    hint:
      'range(inicio, fin_exclusivo, paso). ' +
      'La primera posición debe ser i-1; el paso será -1.',

    explanation:
      'El segundo for comienza en i-1 y disminuye j de uno en uno. ' +
      'Usamos -1 como límite exclusivo para incluir el índice 0.',

    conclusion:
      'El segundo for busca hacia la IZQUIERDA ' +
      'la posición del elemento seleccionado.'
  },

  {
    name: 'Guardar antes de mover',
    short: 'Proteger key',

    intro:
      'Para insertar el 4 en [3, 5, 4], tendremos que copiar ' +
      'el 5 hacia la derecha. Eso sobrescribiría la casilla ' +
      'donde estaba el 4.',

    questions: [
      'Si copias arr[1] en arr[2], ¿qué pasa con el 4 original?',
      '¿Dónde puedes guardarlo antes de desplazar?',
      '¿Cómo se expresa copiar una casilla a la siguiente en Python?'
    ],

    question:
      '¿Qué combinación conserva el seleccionado ' +
      'y desplaza arr[j] a la derecha?',

    options: [
      'key = arr[i]  y  arr[j + 1] = arr[j]',
      'key = arr[j]  y  arr[j] = arr[i]',
      'key = 0  y  arr[i] = arr[j]'
    ],

    correct: 0,

    hint:
      'Una variable temporal conserva el elemento original; ' +
      'para mover a la derecha, el destino debe ser j+1.',

    explanation:
      'key = arr[i] preserva el valor seleccionado. ' +
      'arr[j + 1] = arr[j] desplaza un número mayor a la derecha, ' +
      'dejando un espacio disponible.',

    conclusion:
      'Guardar key evita perder datos cuando sobrescribimos ' +
      'posiciones del arreglo.'
  },

  {
    name: 'Saber cuándo detenerse',
    short: 'Condición y break',

    intro:
      'Al insertar 4 en [3, 5], movemos el 5 a la derecha. ' +
      'Después encontramos 3, que no es mayor que 4. ' +
      'Ya sabemos dónde detenernos.',

    questions: [
      '¿Qué elementos deben desplazarse?',
      'Si encontramos un elemento menor o igual que key, ¿necesitamos seguir?',
      '¿Qué instrucción sale antes de tiempo de un for?'
    ],

    question:
      '¿Qué condición y acción corresponden al segundo for?',

    options: [
      'Si arr[j] < key: desplazar; si no: continuar.',
      'Si arr[j] > key: desplazar; si no: break.',
      'Desplazar siempre hasta llegar al índice cero.'
    ],

    correct: 1,

    hint:
      'La región izquierda ya está ordenada. ' +
      'Al encontrar un valor menor o igual a key, ' +
      'los que quedan a su izquierda tampoco necesitan moverse.',

    explanation:
      'Desplazamos solamente arr[j] > key. ' +
      'Cuando no se cumple, break termina el for interno. ' +
      'El >= no es necesario y movería también elementos iguales.',

    conclusion:
      'El for interno puede detenerse antes de agotar ' +
      'su rango gracias a break.'
  },

  {
    name: 'Encontrar el hueco final',
    short: 'Variable position',

    intro:
      'Cada desplazamiento deja libre la posición que ocupaba ' +
      'el valor desplazado. Necesitamos recordar ese hueco ' +
      'para insertar key, incluso si recorrimos todo hasta el índice 0.',

    questions: [
      '¿Dónde está el hueco antes del primer desplazamiento?',
      'Si movemos arr[j] a arr[j+1], ¿dónde queda libre?',
      '¿En qué casilla insertamos key cuando acaba el for interno?'
    ],

    question:
      '¿Cómo debemos actualizar la posición libre ' +
      'cuando arr[j] se desplaza?',

    options: [
      'position empieza en i y después se actualiza a j.',
      'position siempre vale i + 1.',
      'position siempre vale j + 1.'
    ],

    correct: 0,

    hint:
      'Cuando desplazas el valor que estaba en j, ' +
      'esa posición j queda disponible para insertar key.',

    explanation:
      'position = i al principio. Cada vez que hacemos ' +
      'arr[j + 1] = arr[j], actualizamos position = j. ' +
      'Al terminar insertamos arr[position] = key.',

    conclusion:
      'position evita un error común: insertar mal ' +
      'cuando key es menor que todos los anteriores.'
  },

  {
    name: 'Pon a prueba la lógica',
    short: 'Simulador interactivo',

    intro:
      'Ahora predice cada operación antes de pulsar «Siguiente». ' +
      'Observa qué hace el recorrido externo y cómo el interno ' +
      'compara, desplaza y se detiene.',

    questions: [
      '¿Qué índice está procesando el for externo?',
      '¿Qué elemento examina el for interno?',
      '¿El siguiente movimiento será comparar, desplazar o insertar?'
    ],

    question:
      'Al insertar el número 1 en una región ordenada [3, 4, 5], ' +
      '¿qué sucede?',

    options: [
      'Se mueve solo el 5.',
      'Se desplazan 5, 4 y 3; el 1 se inserta al principio.',
      'El 1 se queda en su lugar.'
    ],

    correct: 1,

    hint:
      'Compara 1 contra 5, luego 4 y por último 3. ' +
      'Todos son mayores.',

    explanation:
      'Se desplazan todos los elementos mayores a la derecha. ' +
      'Como no hay ninguno menor o igual, position termina en 0 ' +
      'y allí insertamos 1.',

    conclusion:
      'Ya conoces los dos recorridos y las reglas para mover ' +
      'e insertar. Ahora puedes escribir el algoritmo.'
  }
];

/**
 * Fundamentos teóricos de cada misión.
 *
 * Cada elemento del arreglo corresponde a una
 * misión definida en MISSIONS.
 *
 * El contenido se presenta bajo demanda.
 */
const THEORY_FOUNDATIONS = [
  // MISIÓN 1
  {
    title: 'Organización de datos',
    introduction:
      'Antes de programar necesitamos comprender ' +
      'cómo se almacenan los elementos y qué ' +
      'significa que estén ordenados.',

    concepts: [
      {
        title: '¿Qué es un arreglo?',
        definition:
          'Es una colección de elementos que podemos ' +
          'consultar mediante su posición. En Python, ' +
          'podemos utilizar una lista para representar ' +
          'los números que queremos ordenar.',

        example: `numbers = [5, 3, 4, 1, 2]

print(numbers[0])  # 5
print(numbers[1])  # 3`,

        application:
          'Insertion Sort trabaja sobre una colección ' +
          'y modifica las posiciones de sus elementos.'
      },
      {
        title: '¿Qué significa ordenar?',
        definition:
          'Ordenar consiste en organizar elementos ' +
          'siguiendo un criterio. Para un orden ' +
          'ascendente, cada elemento debe ser menor ' +
          'o igual que el siguiente.',

        example: `numbers = [1, 3, 5]

print(numbers[0] <= numbers[1])  # True
print(numbers[1] <= numbers[2])  # True`,

        application:
          'El objetivo es que todos los elementos ' +
          'del arreglo cumplan esta relación.'
      },
      {
        title: '¿Qué es una región ordenada?',
        definition:
          'Es una parte continua de una colección ' +
          'cuyos elementos ya cumplen el criterio ' +
          'de ordenamiento. Una región de un solo ' +
          'elemento siempre está ordenada.',

        example: `numbers = [3, 5, 4, 1, 2]

sorted_region = numbers[:2]

print(sorted_region)  # [3, 5]`,

        application:
          'Insertion Sort construye progresivamente ' +
          'una región ordenada desde la izquierda.'
      }
    ]
  },

  // MISIÓN 2
  {
    title: 'Recorridos y repetición',
    introduction:
      'Para procesar una colección necesitamos ' +
      'comprender los índices, los ciclos for ' +
      'y el funcionamiento de range().',

    concepts: [
      {
        title: '¿Qué es un índice?',
        definition:
          'Es la posición de un elemento dentro ' +
          'de una colección. En Python, el primer ' +
          'elemento tiene índice 0.',

        example: `numbers = [5, 3, 4]

print(numbers[0])  # 5
print(numbers[1])  # 3
print(numbers[2])  # 4`,

        application:
          'Podemos utilizar una variable para ' +
          'identificar el elemento que estamos ' +
          'procesando.'
      },
      {
        title: '¿Cómo funciona un ciclo for?',
        definition:
          'Un ciclo for permite ejecutar un bloque ' +
          'de instrucciones una vez por cada ' +
          'elemento de una secuencia.',

        example: `for index in range(3):
    print(index)

# Resultado:
# 0
# 1
# 2`,

        application:
          'Podemos utilizarlo para visitar ' +
          'secuencialmente los elementos de un arreglo.'
      },
      {
        title: '¿Qué hace range()?',
        definition:
          'range() representa una secuencia de ' +
          'enteros. Puede recibir un inicio, un ' +
          'límite exclusivo y un paso.',

        example: `numbers = [5, 3, 4, 1, 2]

for index in range(1, len(numbers)):
    print(index)

# 1, 2, 3, 4`,

        application:
          'Permite determinar dónde comienza ' +
          'y termina el recorrido externo.'
      },
      {
        title: '¿Qué hace len()?',
        definition:
          'La función len() devuelve la cantidad ' +
          'de elementos de una colección. ' +
          'No devuelve el último índice.',

        example: `numbers = [5, 3, 4]

print(len(numbers))      # 3
print(len(numbers) - 1)  # 2`,

        application:
          'Permite calcular los límites del ' +
          'recorrido sin depender de un tamaño fijo.'
      }
    ]
  },

  // MISIÓN 3
  {
    title: 'Recorridos inversos y ciclos anidados',
    introduction:
      'Ahora necesitas entender cómo recorrer ' +
      'posiciones hacia atrás y cómo combinar ' +
      'dos ciclos for.',

    concepts: [
      {
        title: '¿Qué son los ciclos anidados?',
        definition:
          'Son ciclos colocados dentro de otros. ' +
          'Durante una iteración del ciclo externo, ' +
          'el ciclo interno puede ejecutarse ' +
          'varias veces.',

        example: `for i in range(1, 4):
    for j in range(i):
        print(i, j)

# (1, 0)
# (2, 0)
# (2, 1)
# (3, 0)
# (3, 1)
# (3, 2)`,

        application:
          'Insertion Sort necesita seleccionar ' +
          'un elemento y después examinar una ' +
          'región que puede contener varios elementos.'
      },
      {
        title: '¿Cómo recorrer hacia atrás?',
        definition:
          'range() acepta un paso negativo. ' +
          'Cuando el paso es -1, los índices ' +
          'disminuyen de uno en uno.',

        example: `for index in range(4, -1, -1):
    print(index)

# 4, 3, 2, 1, 0`,

        application:
          'Podemos comenzar desde una posición ' +
          'y revisar los elementos anteriores.'
      },
      {
        title: '¿Por qué el límite es exclusivo?',
        definition:
          'El valor final de range() no pertenece ' +
          'a la secuencia. Esto también se aplica ' +
          'cuando recorremos hacia atrás.',

        example: `print(list(range(3, 0, -1)))
# [3, 2, 1]

print(list(range(3, -1, -1)))
# [3, 2, 1, 0]`,

        application:
          'Comprender los límites evita omitir ' +
          'el primer elemento de la región ordenada.'
      },
      {
        title: '¿Cuál es la diferencia entre i y j?',
        definition:
          'Son nombres de variables que suelen ' +
          'utilizarse para representar índices. ' +
          'No son palabras reservadas de Python. ' +
          'Cada variable puede controlar un ' +
          'recorrido diferente.',

        example: `for i in range(1, 3):
    print("Externo:", i)

    for j in range(i):
        print("Interno:", j)`,

        application:
          'i puede identificar el elemento ' +
          'seleccionado y j las posiciones ' +
          'que revisamos para insertarlo.'
      }
    ]
  },

  // MISIÓN 4
  {
    title: 'Variables, memoria y asignación',
    introduction:
      'Para mover elementos sin perderlos ' +
      'necesitas distinguir entre guardar ' +
      'un valor, consultar una posición ' +
      'y sobrescribirla.',

    concepts: [
      {
        title: '¿Qué es una variable temporal?',
        definition:
          'Es una variable utilizada para ' +
          'conservar un valor mientras realizamos ' +
          'otras operaciones. Su uso evita ' +
          'perder información importante.',

        example: `numbers = [3, 5, 4]

saved_value = numbers[2]

print(saved_value)  # 4`,

        application:
          'key conserva el elemento que queremos ' +
          'insertar mientras movemos otros valores.'
      },
      {
        title: '¿Qué significa asignar un valor?',
        definition:
          'El operador = asigna el resultado de ' +
          'la expresión de la derecha al destino ' +
          'de la izquierda. No comprueba igualdad.',

        example: `x = 5
y = x

x = 8

print(y)  # 5`,

        application:
          'En una lista de enteros, podemos ' +
          'copiar un valor a otra posición ' +
          'sin modificar la variable temporal.'
      },
      {
        title: '¿Cómo se modifica una lista?',
        definition:
          'Podemos reemplazar un elemento ' +
          'asignando un valor a una posición. ' +
          'El valor anterior de esa posición ' +
          'deja de estar almacenado allí.',

        example: `numbers = [3, 5, 4]

numbers[2] = numbers[1]

print(numbers)
# [3, 5, 5]`,

        application:
          'Esta operación permite desplazar ' +
          'un elemento a la derecha. ' +
          'Por eso debemos conservar antes ' +
          'el valor seleccionado.'
      }
    ]
  },

  // MISIÓN 5
  {
    title: 'Condicionales y control del flujo',
    introduction:
      'Un recorrido no siempre necesita ' +
      'completarse. Las condiciones permiten ' +
      'decidir cuándo mover elementos ' +
      'y cuándo detenerse.',

    concepts: [
      {
        title: '¿Qué hace una condición if?',
        definition:
          'Evalúa una expresión que produce ' +
          'True o False. Si la condición es ' +
          'verdadera, ejecuta las instrucciones ' +
          'del bloque correspondiente.',

        example: `number = 7

if number > 5:
    print("Es mayor que 5")`,

        application:
          'Permite determinar cuándo un número ' +
          'debe desplazarse para insertar otro.'
      },
      {
        title: 'Operadores de comparación',
        definition:
          'Los operadores >, <, >=, <=, ' +
          '== y != permiten comparar valores ' +
          'y obtener un resultado booleano.',

        example: `print(7 > 5)   # True
print(3 > 5)   # False
print(5 == 5)  # True`,

        application:
          'Ayudan a decidir si un elemento ' +
          'está en una posición compatible ' +
          'con el orden ascendente.'
      },
      {
        title: '¿Qué hace break?',
        definition:
          'break termina inmediatamente el ' +
          'ciclo más cercano que lo contiene. ' +
          'La ejecución continúa después ' +
          'de ese ciclo.',

        example: `for number in [8, 6, 3, 1]:
    if number < 5:
        break

    print(number)

# 8
# 6`,

        application:
          'Permite detener la búsqueda ' +
          'cuando ya no es necesario ' +
          'examinar más elementos.'
      },
      {
        title: '¿Por qué importa el orden previo?',
        definition:
          'Si una región ya está ordenada, ' +
          'encontrar un elemento menor o igual ' +
          'que cierto valor permite deducir ' +
          'que los elementos anteriores ' +
          'también cumplen esa relación.',

        example: `ordered = [2, 4, 7]
key = 5

# 7 > 5
# 4 <= 5
# No necesitamos revisar 2.`,

        application:
          'Esta propiedad justifica detener ' +
          'anticipadamente el ciclo interno.'
      }
    ]
  },

  // MISIÓN 6
  {
    title: 'Seguimiento de índices y casos límite',
    introduction:
      'Para colocar un elemento correctamente ' +
      'necesitamos seguir la posición disponible ' +
      'y considerar situaciones especiales.',

    concepts: [
      {
        title: '¿Qué es una variable de seguimiento?',
        definition:
          'Es una variable cuyo valor se ' +
          'actualiza para recordar información ' +
          'que cambia durante un proceso.',

        example: `position = 3

position = 2
position = 1
position = 0

print(position)  # 0`,

        application:
          'Podemos conservar el índice ' +
          'donde quedó libre una posición.'
      },
      {
        title: 'Diferencia entre índice y valor',
        definition:
          'El índice indica dónde se encuentra ' +
          'un elemento; el valor es el contenido ' +
          'almacenado en esa posición.',

        example: `numbers = [3, 5, 4]

index = 1

print(index)           # 1
print(numbers[index])  # 5`,

        application:
          'key representa un valor, mientras ' +
          'que position representa el lugar ' +
          'donde debemos insertarlo.'
      },
      {
        title: '¿Qué es un caso límite?',
        definition:
          'Es una situación que ocurre en ' +
          'los extremos o condiciones especiales ' +
          'de un problema. Es importante ' +
          'comprobar que el algoritmo también ' +
          'funciona en esas situaciones.',

        example: `examples = [
    [],
    [7],
    [1, 2, 3],
    [3, 2, 1],
    [2, 2, 1]
]`,

        application:
          'Debemos considerar qué sucede ' +
          'cuando insertamos al principio ' +
          'o cuando no se requiere mover nada.'
      },
      {
        title: '¿Por qué no debemos usar un índice inválido?',
        definition:
          'Una lista de n elementos utiliza ' +
          'índices desde 0 hasta n-1. ' +
          'En Python también existen índices ' +
          'negativos, pero se refieren a ' +
          'elementos contados desde el final.',

        example: `numbers = [3, 5, 4]

print(numbers[0])   # 3
print(numbers[-1])  # 4`,

        application:
          'Al buscar hacia atrás debemos ' +
          'evitar que el recorrido continúe ' +
          'fuera de la región prevista.'
      }
    ]
  },

  // MISIÓN 7
  {
    title: 'Trazabilidad, pruebas y razonamiento',
    introduction:
      'Ahora relacionaremos las instrucciones ' +
      'con los cambios del arreglo y comprobaremos ' +
      'si nuestro razonamiento funciona.',

    concepts: [
      {
        title: '¿Qué es una traza de ejecución?',
        definition:
          'Es un registro paso a paso del ' +
          'estado de las variables y de las ' +
          'operaciones ejecutadas. Sirve ' +
          'para entender cómo evoluciona ' +
          'un programa.',

        example: `# Ejemplo de seguimiento

i = 2
key = 4
j = 1

print(i, j, key)

# 2 1 4`,

        application:
          'El simulador permite observar ' +
          'cómo cambian i, j, key y position.'
      },
      {
        title: '¿Qué es una invariante de ciclo?',
        definition:
          'Es una propiedad que permanece ' +
          'verdadera antes y después de ' +
          'cada iteración relevante de ' +
          'un algoritmo.',

        example: `# Antes de insertar:
# [3, 5] está ordenado.

# Después de insertar 4:
# [3, 4, 5] está ordenado.`,

        application:
          'Al comenzar cada iteración externa, ' +
          'la región izquierda ya está ordenada. ' +
          'Después de insertar, sigue estándolo.'
      },
      {
        title: '¿Qué son las pruebas de software?',
        definition:
          'Son verificaciones que comparan ' +
          'el resultado de una implementación ' +
          'con el resultado esperado.',

        example: `values = [3, 1, 2]
expected = [1, 2, 3]

actual = sorted(values)

assert actual == expected`,

        application:
          'El reto final comprobará tu ' +
          'implementación con distintos ' +
          'tipos de arreglos.'
      },
      {
        title: '¿Qué significa complejidad temporal?',
        definition:
          'Describe cómo crece el trabajo ' +
          'de un algoritmo cuando aumenta ' +
          'el tamaño de su entrada. ' +
          'No representa directamente ' +
          'una cantidad fija de segundos.',

        example: `# Un ciclo puede recorrer n elementos.
# Dos ciclos anidados pueden realizar
# muchas más operaciones.

for i in range(5):
    for j in range(i):
        print(i, j)`,

        application:
          'Insertion Sort puede necesitar ' +
          'un número cuadrático de ' +
          'comparaciones y desplazamientos ' +
          'en el peor caso: O(n²).'
      }
    ]
  }
];

// ============================================================
// 4. ESTADO Y PERSISTENCIA
// ============================================================

function createInitialState() {
  return {
    stage: 0,
    completed: [],
    answers: {},
    hints: {},
    simulationStep: 0,
    code: STARTER_CODE,
    revealed: false
  };
}

function loadState() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || 'null'
    );

    if (!saved || typeof saved !== 'object') {
      return createInitialState();
    }

    const defaults = createInitialState();

    const completed = Array.isArray(saved.completed)
      ? saved.completed.filter(
        index =>
          Number.isInteger(index) &&
          index >= 0 &&
          index < MISSIONS.length
      )
      : [];

    const unlocked = completed.filter(
      index =>
        index === 0 ||
        completed.includes(index - 1)
    );

    const highestStage = Math.min(
      MISSIONS.length,
      unlocked.length
    );

    const requestedStage = Number.isInteger(saved.stage)
      ? saved.stage
      : 0;

    return {
      ...defaults,

      stage: Math.min(
        Math.max(requestedStage, 0),
        highestStage
      ),

      completed: [...new Set(unlocked)],

      answers:
        saved.answers &&
          typeof saved.answers === 'object'
          ? saved.answers
          : {},

      hints:
        saved.hints &&
          typeof saved.hints === 'object'
          ? saved.hints
          : {},

      simulationStep: Number.isInteger(
        saved.simulationStep
      )
        ? Math.max(0, saved.simulationStep)
        : Number.isInteger(saved.sim)
          ? Math.max(0, saved.sim)
          : 0,

      code:
        typeof saved.code === 'string'
          ? saved.code
          : STARTER_CODE,

      revealed: saved.revealed === true
    };
  } catch {
    return createInitialState();
  }
}

let state = loadState();
let activePythonWorker = null;

const elements = {
  view: document.getElementById('mission-view'),
  nav: document.getElementById('mission-nav'),
  progressText: document.getElementById('progress-percent'),
  progressBar: document.getElementById('progress-fill'),
  workspace: document.querySelector('.workspace'),
  resetButton: document.getElementById('reset-progress'),
  resetDialog: document.getElementById('reset-dialog')
};

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );
  } catch {
    // El laboratorio funciona incluso sin localStorage.
  }
}

function updateState(changes) {
  state = {
    ...state,
    ...changes
  };

  saveState();
  render();
}

function isMissionCompleted(index) {
  return state.completed.includes(index);
}

function areAllMissionsCompleted() {
  return MISSIONS.every(
    (_, index) => isMissionCompleted(index)
  );
}

function canVisitStage(index) {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index > MISSIONS.length
  ) {
    return false;
  }

  if (index === 0) {
    return true;
  }

  if (index === MISSIONS.length) {
    return areAllMissionsCompleted();
  }

  return isMissionCompleted(index - 1);
}

// ============================================================
// 5. MODELO: SIMULACIÓN DE INSERTION SORT
// ============================================================

function createTrace(input) {
  const values = [...input];
  const steps = [];

  function record({
    iIndex = null,
    jIndex = null,
    key = null,
    position = null,
    sortedCount = 0,
    focusIndex = -1,
    holeIndex = -1,
    shiftedIndex = -1,
    description,
    codeLine
  }) {
    steps.push({
      values: [...values],
      iIndex,
      jIndex,
      key,
      position,
      sortedCount,
      focusIndex,
      holeIndex,
      shiftedIndex,
      description,
      codeLine
    });
  }

  record({
    sortedCount: Math.min(1, values.length),
    description:
      'El primer elemento forma una región ordenada.',
    codeLine: 'for i in range(1, len(arr)):'
  });

  for (let i = 1; i < values.length; i += 1) {
    const key = values[i];
    let position = i;

    record({
      iIndex: i,
      key,
      position,
      sortedCount: i,
      focusIndex: i,
      description:
        `i = ${i}. Seleccionamos el valor ${key} ` +
        'y lo guardamos en key.',
      codeLine: 'key = arr[i]'
    });

    for (let j = i - 1; j >= 0; j -= 1) {
      record({
        iIndex: i,
        jIndex: j,
        key,
        position,
        sortedCount: i,
        focusIndex: j,
        holeIndex: position === i ? -1 : position,
        description:
          `Comparamos arr[${j}] = ${values[j]} ` +
          `con key = ${key}.`,
        codeLine: 'if arr[j] > key:'
      });

      if (values[j] <= key) {
        record({
          iIndex: i,
          jIndex: j,
          key,
          position,
          sortedCount: i,
          holeIndex: position === i ? -1 : position,
          description:
            `${values[j]} es menor o igual a ${key}. ` +
            'La búsqueda termina.',
          codeLine: 'break'
        });

        break;
      }

      const shiftedValue = values[j];

      values[j + 1] = shiftedValue;
      position = j;

      record({
        iIndex: i,
        jIndex: j,
        key,
        position,
        sortedCount: i,
        holeIndex: position,
        shiftedIndex: j + 1,
        description:
          `${shiftedValue} es mayor que ${key}. ` +
          `Lo desplazamos a la derecha y ` +
          `position ahora vale ${position}.`,
        codeLine: 'arr[j + 1] = arr[j]'
      });
    }

    values[position] = key;

    record({
      iIndex: i,
      key,
      position,
      sortedCount: i + 1,
      focusIndex: position,
      description:
        `Insertamos key = ${key} en el índice ` +
        `${position}. La región ordenada crece.`,
      codeLine: 'arr[position] = key'
    });
  }

  record({
    sortedCount: values.length,
    description:
      'Todos los elementos están ordenados.',
    codeLine: 'return arr'
  });

  return steps;
}

const SIMULATION_STEPS = createTrace(INITIAL_ARRAY);

state.simulationStep = Math.min(
  state.simulationStep,
  SIMULATION_STEPS.length - 1
);

// ============================================================
// 6. UTILIDADES DE PRESENTACIÓN
// ============================================================

function escapeHtml(value) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  return String(value).replace(
    /[&<>"']/g,
    char => entities[char]
  );
}

function renderArray(
  values,
  {
    sortedCount = 0,
    focusIndex = -1,
    holeIndex = -1,
    shiftedIndex = -1,
    iIndex = null,
    jIndex = null
  } = {}
) {
  const label = values.join(', ');

  const cells = values.map((value, index) => {
    const className =
      index === holeIndex
        ? 'hole'
        : index === focusIndex
          ? 'focus'
          : index === shiftedIndex
            ? 'shift'
            : index < sortedCount
              ? 'sorted'
              : '';

    const displayValue =
      index === holeIndex ? '_' : value;

    const markers = [
      index === iIndex
        ? '<span class="index-marker marker-i">i</span>'
        : '',

      index === jIndex
        ? '<span class="index-marker marker-j">j</span>'
        : ''
    ].join('');

    return `
      <div class="array-cell ${className}">
        ${markers}

        ${escapeHtml(displayValue)}

        <small>${index}</small>
      </div>
    `;
  }).join('');

  return `
    <div
      class="array-row"
      role="img"
      aria-label="Arreglo: ${escapeHtml(label)}"
    >
      ${cells}
    </div>
  `;
}

function renderLegend(includeShift = false) {
  return `
    <div class="array-legend">
      <span>
        <i class="dot"></i>
        Región ordenada
      </span>

      <span>
        <i class="dot amber"></i>
        Seleccionado / hueco
      </span>

      ${includeShift
      ? `
            <span>
              <i class="dot blue"></i>
              Desplazado
            </span>
          `
      : ''
    }
    </div>
  `;
}


function renderVariablePanel({
  iIndex = null,
  jIndex = null,
  key = null,
  position = null,
  showPosition = false
} = {}) {
  const variables = [
    {
      name: 'i',
      value: iIndex,
      description: 'Índice del elemento seleccionado',
      className: 'variable-i'
    },
    {
      name: 'j',
      value: jIndex,
      description: 'Índice que compara hacia atrás',
      className: 'variable-j'
    },
    {
      name: 'key',
      value: key,
      description: 'Valor guardado para insertar',
      className: 'variable-key'
    }
  ];

  if (showPosition) {
    variables.push({
      name: 'position',
      value: position,
      description: 'Índice donde insertar key',
      className: 'variable-position'
    });
  }

  const cards = variables.map(variable => `
    <div class="variable-card ${variable.className}">
      <span class="variable-name">
        ${variable.name}
      </span>

      <strong class="variable-value">
        ${variable.value ?? '—'}
      </strong>

      <span class="variable-description">
        ${variable.description}
      </span>
    </div>
  `).join('');

  return `
    <div class="variable-panel">
      <div class="card-heading">
        <span class="section-label">
          VARIABLES DEL ALGORITMO
        </span>
      </div>

      <div class="variable-grid">
        ${cards}
      </div>
    </div>
  `;
}


/**
 * Genera una tarjeta desplegable con:
 * - Definición.
 * - Ejemplo en Python.
 * - Aplicación dentro del algoritmo.
 */
function renderTheoryConcept(concept, index) {
  const conceptNumber = String(index + 1)
    .padStart(2, '0');

  return `
    <details class="theory-concept">

      <summary class="theory-concept-header">
        <span class="theory-concept-number">
          ${conceptNumber}
        </span>

        <span class="theory-concept-title">
          ${escapeHtml(concept.title)}
        </span>

        <span
          class="theory-chevron"
          aria-hidden="true"
        >
          ▾
        </span>
      </summary>

      <div class="theory-concept-content">

        <div class="theory-definition">
          <span class="theory-content-label">
            ¿QUÉ SIGNIFICA?
          </span>

          <p>
            ${escapeHtml(concept.definition)}
          </p>
        </div>

        <div class="theory-example">
          <span class="theory-content-label">
            EJEMPLO EN PYTHON
          </span>

          <pre class="theory-code"><code>${escapeHtml(concept.example)}</code></pre>
        </div>

        <div class="theory-application">
          <span class="theory-content-label">
            ¿CÓMO SE RELACIONA CON INSERTION SORT?
          </span>

          <p>
            ${escapeHtml(concept.application)}
          </p>
        </div>

      </div>
    </details>
  `;
}

/**
 * Renderiza los fundamentos de la misión actual.
 *
 * La información depende del índice de misión
 * para evitar mostrar conceptos adelantados.
 */
function renderTheorySection(missionIndex) {
  const foundation = THEORY_FOUNDATIONS[missionIndex];

  if (!foundation) {
    return '';
  }

  const concepts = foundation.concepts
    .map(renderTheoryConcept)
    .join('');

  return `
    <section
      class="theory-section"
      aria-labelledby="theory-heading"
    >

      <div class="theory-section-header">

        <span
          class="theory-section-icon"
          aria-hidden="true"
        >
          📖
        </span>

        <div>
          <span class="section-label">
            MATERIAL DE CONSULTA
          </span>

          <h3 id="theory-heading">
            Fundamentos teóricos
          </h3>
        </div>

      </div>

      <p class="theory-section-intro">
        ${escapeHtml(foundation.introduction)}
      </p>

      <div class="theory-concepts">
        ${concepts}
      </div>

      <div class="theory-section-footer">
        <span aria-hidden="true">💡</span>

        <p>
          Estos conceptos son herramientas
          para razonar. No necesitas
          memorizarlos: puedes volver
          a consultarlos cuando quieras.
        </p>
      </div>

    </section>
  `;
}

// ============================================================
// 7. NAVEGACIÓN Y PROGRESO
// ============================================================

function renderNavigation() {
  const progress = Math.round(
    state.completed.length /
    MISSIONS.length *
    100
  );

  elements.progressText.textContent = `${progress}%`;
  elements.progressBar.style.width = `${progress}%`;

  const links = MISSIONS.map((mission, index) => {
    const classes = [
      'mission-link',
      state.stage === index ? 'active' : '',
      isMissionCompleted(index) ? 'done' : ''
    ].filter(Boolean).join(' ');

    const symbol = isMissionCompleted(index)
      ? '✓'
      : String(index + 1).padStart(2, '0');

    return `
      <button
        type="button"
        class="${classes}"
        data-stage="${index}"
        ${canVisitStage(index) ? '' : 'disabled'}
        ${state.stage === index ? 'aria-current="step"' : ''}
      >
        <span class="mission-index">
          ${symbol}
        </span>

        <span>
          ${escapeHtml(mission.short)}
        </span>
      </button>
    `;
  });

  links.push(`
    <button
      type="button"
      class="mission-link ${state.stage === MISSIONS.length ? 'active' : ''
    }"
      data-stage="${MISSIONS.length}"
      ${areAllMissionsCompleted() ? '' : 'disabled'}
    >
      <span class="mission-index">⌘</span>
      <span>Reto final · Python</span>
    </button>
  `);

  elements.nav.innerHTML = links.join('');
}

// ============================================================
// 8. CONTENIDO DE LAS MISIONES
// ============================================================

function getMissionExample(index) {
  const examples = [
    {
      values: [5, 3, 4, 1, 2],
      sortedCount: 1,
      iIndex: null,
      jIndex: null,
      key: null
    },
    {
      values: [5, 3, 4, 1, 2],
      sortedCount: 1,
      iIndex: 1,
      jIndex: null,
      key: null
    },
    {
      values: [3, 5, 4, 1, 2],
      sortedCount: 2,
      iIndex: 2,
      jIndex: 1,
      key: null
    },
    {
      values: [3, 5, 4, 1, 2],
      sortedCount: 2,
      iIndex: 2,
      jIndex: 1,
      key: 4
    },
    {
      values: [3, 5, 4, 1, 2],
      sortedCount: 2,
      iIndex: 2,
      jIndex: 1,
      key: 4
    },
    {
      values: [3, 4, 5, 1, 2],
      sortedCount: 3,
      iIndex: 3,
      jIndex: 2,
      key: 1,
      position: 3
    },
    {
      values: [3, 4, 5, 1, 2],
      sortedCount: 3,
      iIndex: 3,
      jIndex: 2,
      key: 1,
      position: 3
    }
  ];

  return examples[index];
}

function renderConceptCard(index) {
  const example = getMissionExample(index);

  return `
    <div class="concept-card">
      <div class="card-heading">
        <span class="section-label">
          OBSERVA EL ARREGLO
        </span>

        <span class="index-label">
          ÍNDICES 0 — 4
        </span>
      </div>

      ${renderArray(example.values, example)}
      ${renderLegend()}
      ${renderVariablePanel({
    ...example,
    showPosition: index >= 5
  })}
    </div>
  `;
}

function renderThinkingQuestions(questions) {
  const items = questions.map(
    question => `<li>${escapeHtml(question)}</li>`
  ).join('');

  return `
    <div class="practice-card">
      <div class="card-heading">
        <span class="section-label">
          ANTES DE RESPONDER
        </span>

        <span class="index-label">
          PIENSA SIN CÓDIGO
        </span>
      </div>

      <ol class="thinking">
        ${items}
      </ol>
    </div>
  `;
}

function renderAnswerFeedback(mission, selected) {
  if (selected === undefined) {
    return '';
  }

  const correct = selected === mission.correct;

  const message = correct
    ? mission.explanation
    : 'Esa opción no conserva todas las propiedades necesarias. ' +
    'Revisa las preguntas o consulta una pista.';

  return `
    <div
      class="feedback ${correct ? 'good' : 'try'}"
      role="status"
    >
      <strong>
        ${correct
      ? '✓ ¡Bien razonado!'
      : '↻ Revisa tu razonamiento'
    }
      </strong>

      ${escapeHtml(message)}
    </div>
  `;
}

function renderQuestionCard(mission, index) {
  const selected = state.answers[index];
  const completed = isMissionCompleted(index);

  const options = mission.options.map(
    (option, optionIndex) => {
      const classes = [
        'option',
        selected === optionIndex ? 'selected' : '',
        completed && optionIndex === mission.correct
          ? 'correct'
          : '',
        selected === optionIndex &&
          selected !== mission.correct
          ? 'incorrect'
          : ''
      ].filter(Boolean).join(' ');

      return `
        <button
          type="button"
          class="${classes}"
          data-answer="${optionIndex}"
          aria-pressed="${selected === optionIndex}"
        >
          <span class="option-letter">
            ${'ABC'[optionIndex]}
          </span>

          <span>
            ${escapeHtml(option)}
          </span>
        </button>
      `;
    }
  ).join('');

  const hint = state.hints[index]
    ? `
      <div class="feedback hint">
        <strong>✧ Pista</strong>
        ${escapeHtml(mission.hint)}
      </div>
    `
    : '';

  return `
    <div class="question-card">
      <div class="card-heading">
        <span class="section-label">
          COMPRUEBA TU RAZONAMIENTO
        </span>

        <span class="index-label">
          UNA RESPUESTA
        </span>
      </div>

      <h3>
        ${escapeHtml(mission.question)}
      </h3>

      <div class="options">
        ${options}
      </div>

      ${renderAnswerFeedback(mission, selected)}
      ${hint}

      <div class="actions">
        <button
          type="button"
          class="btn btn-ghost"
          data-action="toggle-hint"
        >
          ✧ ${state.hints[index]
      ? 'Ocultar pista'
      : 'Necesito una pista'
    }
        </button>

        ${completed
      ? `
              <span class="status good">
                ✓ Misión completada
              </span>
            `
      : ''
    }
      </div>
    </div>
  `;
}

function renderMission() {
  const index = state.stage;
  const mission = MISSIONS[index];
  const completed = isMissionCompleted(index);

  const simulator = index === MISSIONS.length - 1
    ? renderSimulator()
    : '';

  const conclusion = completed
    ? `
      <div class="callout">
        <strong>Idea descubierta:</strong>
        ${escapeHtml(mission.conclusion)}
      </div>
    `
    : '';

  elements.view.innerHTML = `
    <div class="mission-content">
      <div class="lesson-kicker">
        MISIÓN ${String(index + 1).padStart(2, '0')}
        /
        ${String(MISSIONS.length).padStart(2, '0')}
      </div>

      <h2>
        ${escapeHtml(mission.name)}
      </h2>

      <p class="lead">
        ${escapeHtml(mission.intro)}
      </p>

      ${renderConceptCard(index)}
      ${renderTheorySection(index)}
      ${renderThinkingQuestions(mission.questions)}
      ${simulator}
      ${renderQuestionCard(mission, index)}
      ${conclusion}
    </div>

    <div class="step-navigation">
      <button
        type="button"
        class="btn btn-outline"
        data-action="previous"
        ${index === 0 ? 'disabled' : ''}
      >
        ← Anterior
      </button>

      <span class="step-note">
        ${completed
      ? '¡Reto desbloqueado! Continúa.'
      : 'Responde correctamente para avanzar.'
    }
      </span>

      <button
        type="button"
        class="btn btn-primary"
        data-action="next"
        ${completed ? '' : 'disabled'}
      >
        ${index === MISSIONS.length - 1
      ? 'Ir al reto final →'
      : 'Siguiente misión →'
    }
      </button>
    </div>
  `;
}

// ============================================================
// 9. SIMULADOR INTERACTIVO
// ============================================================

function renderSimulator() {
  const step = SIMULATION_STEPS[state.simulationStep];

  return `
    <div class="concept-card" id="simulator">
      <div class="card-heading">
        <span class="section-label">
          SIMULADOR · PASO A PASO
        </span>

        <span class="index-label">
          ${state.simulationStep + 1}
          /
          ${SIMULATION_STEPS.length}
        </span>
      </div>

      ${renderArray(step.values, step)}
      ${renderLegend(true)}
      ${renderVariablePanel({
    ...step,
    showPosition: true
  })}

      <p class="slide-explain">
        ${escapeHtml(step.description)}
      </p>

      <div class="code">
        ${escapeHtml(step.codeLine)}
      </div>

      <div class="actions sim-controls">
        <button
          type="button"
          class="btn btn-outline"
          data-action="simulation-back"
          ${state.simulationStep === 0 ? 'disabled' : ''}
        >
          ← Anterior
        </button>

        <span class="step-counter">
          Acción ${state.simulationStep + 1}
          de ${SIMULATION_STEPS.length}
        </span>

        <button
          type="button"
          class="btn btn-ghost"
          data-action="simulation-next"
          ${state.simulationStep ===
      SIMULATION_STEPS.length - 1
      ? 'disabled'
      : ''
    }
        >
          Siguiente →
        </button>
      </div>

      <button
        type="button"
        class="text-button"
        data-action="simulation-reset"
      >
        ↺ Empezar de nuevo
      </button>
    </div>
  `;
}

// ============================================================
// 10. RETO FINAL DE PROGRAMACIÓN
// ============================================================

function renderChallenge() {
  const solution = state.revealed
    ? `
      <pre class="code">${escapeHtml(SOLUTION_CODE)}</pre>

      <div class="callout">
        El primer for selecciona i.
        El segundo busca desde i - 1 hasta 0.
        Cada desplazamiento actualiza position;
        finalmente insertamos key.
      </div>
    `
    : '';

  elements.view.innerHTML = `
    <div class="mission-content">
      <div class="lesson-kicker">
        MISIÓN FINAL / PROGRAMA TU SOLUCIÓN
      </div>

      <h2>
        Ahora construye el algoritmo.
      </h2>

      <p class="lead">
        Completa los huecos
        (<code>____</code>)
        usando las ideas que descubriste.
        Python se ejecuta en tu navegador.
      </p>

      <div class="summary-card">
        <div class="card-heading">
          <span class="section-label">
            TU CAJA DE HERRAMIENTAS
          </span>

          <span class="index-label">
            YA DESCUBIERTA
          </span>
        </div>

        <ol class="thinking">
          <li>
            El primer <code>for</code>
            elige los elementos pendientes.
          </li>

          <li>
            <code>key</code>
            conserva el valor seleccionado.
          </li>

          <li>
            El segundo <code>for</code>
            compara hacia la izquierda.
          </li>

          <li>
            Si <code>arr[j] &gt; key</code>,
            desplaza; en caso contrario,
            usa <code>break</code>.
          </li>

          <li>
            <code>position</code>
            indica dónde insertar
            <code>key</code>.
          </li>
        </ol>
      </div>

      <div class="challenge-card">
        <div class="card-heading">
          <span class="section-label">
            EDITOR DE PYTHON
          </span>

          <span class="index-label">
            RETO FINAL
          </span>
        </div>

        <label for="code-editor">
          Completa la función
          <code>insertion_sort(arr)</code>:
        </label>

        <div class="code-task">
          <textarea
            id="code-editor"
            spellcheck="false"
            aria-label="Editor Python"
          ></textarea>
        </div>

        <div class="challenge-toolbar">
          <span
            class="status"
            id="runtime-status"
          >
            Python se cargará al ejecutar
            las pruebas (requiere internet).
          </span>

          <div class="actions">
            <button
              type="button"
              class="btn btn-outline"
              data-action="restore-code"
            >
              Restaurar plantilla
            </button>

            <button
              type="button"
              class="btn btn-primary"
              id="run-tests"
              data-action="run-tests"
            >
              ▶ Ejecutar pruebas
            </button>
          </div>
        </div>

        <div
          id="results"
          aria-live="polite"
        ></div>
      </div>

      
<section class="submission-card">
  <div class="card-heading">
    <span class="section-label">
      ENTREGA DE ACTIVIDAD
    </span>
  </div>

  <h3>Envía tu solución</h3>

  <p>
    Comparte tu código y explica brevemente
    cómo resolviste el problema.

    Puedes enviar tu intento incluso si
    todavía tiene errores.
  </p>

  <form id="submission-form">

    <div class="form-field">
      <label for="student-name">
        Nombre completo
      </label>

      <input
        id="student-name"
        name="student_name"
        type="text"
        maxlength="100"
        autocomplete="name"
        required
        placeholder="Tu nombre completo"
      >
    </div>

    <div class="form-field">
      <label for="student-explanation">
        ¿Cómo funcionan tus dos ciclos for?
      </label>

      <textarea
        id="student-explanation"
        name="explanation"
        rows="5"
        maxlength="3000"
        required
        placeholder="Explica con tus palabras cómo construiste el algoritmo..."
      ></textarea>
    </div>

    <div class="submission-summary">
      <strong>Código incluido automáticamente</strong>

      <p>
        Se enviará el contenido actual
        del editor Python y el último
        resultado disponible de las pruebas.
      </p>
    </div>

    <label class="submission-consent">
      <input
        type="checkbox"
        name="consent"
        required
      >

      <span>
        Acepto enviar mi nombre, código y
        explicación para su revisión educativa.
      </span>
    </label>

    <button
      type="submit"
      class="btn btn-primary"
      id="submit-solution"
    >
      Enviar mi solución
    </button>

    <div
      id="submission-status"
      role="status"
      aria-live="polite"
    ></div>

  </form>
</section>

      <div class="practice-card">
        <h3>
          ¿Necesitas una pista adicional?
        </h3>

        <p>
          Intenta razonar cada hueco antes
          de revelar la solución completa.
        </p>

        <button
          type="button"
          class="btn btn-ghost"
          data-action="toggle-solution"
        >
          ${state.revealed
      ? 'Ocultar solución'
      : 'Ver solución explicada'
    }
        </button>

        ${solution}
      </div>
    </div>

    <div class="step-navigation">
      <button
        type="button"
        class="btn btn-outline"
        data-action="previous"
      >
        ← Regresar al simulador
      </button>

      <span class="step-note">
        Prueba arreglos vacíos y con repetidos.
      </span>

      <button
        type="button"
        class="btn btn-ghost"
        data-action="restart-missions"
      >
        ↺ Revisar misiones
      </button>
    </div>
  `;

  elements.view.querySelector('#code-editor').value =
    state.code;
}

// ============================================================
// 11. RENDERIZADO PRINCIPAL
// ============================================================

function render() {
  renderNavigation();

  if (state.stage === MISSIONS.length) {
    renderChallenge();
  } else {
    renderMission();
  }
}

// ============================================================
// 12. NAVEGACIÓN Y RESPUESTAS
// ============================================================

function goToStage(nextStage) {
  if (!canVisitStage(nextStage)) {
    return;
  }

  updateState({
    stage: nextStage
  });

  elements.workspace.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function answerQuestion(optionIndex) {
  const index = state.stage;

  const answers = {
    ...state.answers,
    [index]: optionIndex
  };

  const completed = [...state.completed];

  const isCorrect =
    optionIndex === MISSIONS[index].correct;

  if (
    isCorrect &&
    !completed.includes(index)
  ) {
    completed.push(index);
  }

  updateState({
    answers,
    completed
  });
}

function changeSimulationStep(nextStep) {
  const simulationStep = Math.max(
    0,
    Math.min(
      SIMULATION_STEPS.length - 1,
      nextStep
    )
  );

  updateState({
    simulationStep
  });
}

function invalidateTestResults() {
  latestTestResults = null;
  codeRevision += 1;
}

function restoreStarterCode() {
  const confirmed = window.confirm(
    '¿Restaurar la plantilla? ' +
    'Se reemplazará el código escrito.'
  );

  if (!confirmed) {
    return;
  }

  invalidateTestResults();

  updateState({
    code: STARTER_CODE
  });
}

// ============================================================
// 13. CONTROLADORES DE EVENTOS
// ============================================================

function onNavigationClick(event) {
  const button = event.target.closest(
    'button[data-stage]'
  );

  if (button && !button.disabled) {
    goToStage(Number(button.dataset.stage));
  }
}

function onWorkspaceClick(event) {
  const answer = event.target.closest(
    'button[data-answer]'
  );

  if (answer && !answer.disabled) {
    answerQuestion(
      Number(answer.dataset.answer)
    );

    return;
  }

  const actionButton = event.target.closest(
    'button[data-action]'
  );

  if (
    !actionButton ||
    actionButton.disabled
  ) {
    return;
  }

  const actions = {
    'toggle-hint': () => updateState({
      hints: {
        ...state.hints,
        [state.stage]: !state.hints[state.stage]
      }
    }),

    previous: () => goToStage(
      state.stage - 1
    ),

    next: () => goToStage(
      state.stage + 1
    ),

    'simulation-back': () =>
      changeSimulationStep(
        state.simulationStep - 1
      ),

    'simulation-next': () =>
      changeSimulationStep(
        state.simulationStep + 1
      ),

    'simulation-reset': () =>
      changeSimulationStep(0),

    'restore-code': restoreStarterCode,

    'toggle-solution': () => updateState({
      revealed: !state.revealed
    }),

    'restart-missions': () =>
      goToStage(0),

    'run-tests': () =>
      runPythonTests(state.code)
  };

  actions[actionButton.dataset.action]?.();
}

function onEditorInput(event) {
  if (event.target.id !== 'code-editor') {
    return;
  }

  state.code = event.target.value;
  invalidateTestResults();
  saveState();
}

function onEditorKeyDown(event) {
  if (
    event.target.id !== 'code-editor' ||
    event.key !== 'Tab'
  ) {
    return;
  }

  event.preventDefault();

  const editor = event.target;

  editor.setRangeText(
    '    ',
    editor.selectionStart,
    editor.selectionEnd,
    'end'
  );

  state.code = editor.value;
  invalidateTestResults();
  saveState();
}

// ============================================================
// 14. EJECUCIÓN DE PYTHON
// ============================================================

/**
 * Pyodide se ejecuta dentro de un Web Worker.
 *
 * El Worker evita que la ejecución de Python
 * bloquee el hilo principal de la interfaz.
 *
 * IMPORTANTE:
 * Un Web Worker no es una sandbox de seguridad
 * para ejecutar código arbitrario hostil.
 */

function createWorkerSource() {
  return `
    self.onmessage = async ({ data }) => {
      try {
        importScripts(
          '${PYODIDE_BASE_URL}pyodide.js'
        );

        const python = await loadPyodide({
          indexURL: '${PYODIDE_BASE_URL}'
        });

        python.globals.set(
          'studentSource',
          data.source
        );

        const json = await python.runPythonAsync(
          ${JSON.stringify(`import json

TEST_CASES = [
    [5, 3, 4, 1, 2],
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
    [3, 3, 1, 2, 1],
    [7],
    [],
    [-3, 0, -1, 4],
    [2, 2, 2],
]

results = []
namespace = {}

try:
    exec(
        compile(
            studentSource,
            '<alumno>',
            'exec'
        ),
        namespace
    )

    function = namespace.get('insertion_sort')

    if not callable(function):
        raise ValueError(
            'No se encontró la función insertion_sort(arr).'
        )

    for values in TEST_CASES:
        numbers = values.copy()

        try:
            returned = function(numbers)

            actual = (
                numbers
                if returned is None
                else returned
            )

            results.append({
                'input': values,
                'expected': sorted(values),
                'actual': repr(actual)[:180],
                'passed': actual == sorted(values),
            })

        except Exception as error:
            results.append({
                'input': values,
                'expected': sorted(values),
                'actual': (
                    f'{type(error).__name__}: {error}'
                )[:180],
                'passed': False,
            })

except Exception as error:
    results.append({
        'error': (
            f'{type(error).__name__}: {error}'
        )[:250]
    })

json.dumps(results)`)}
        );

        self.postMessage({
          success: true,
          results: JSON.parse(json)
        });

      } catch (error) {
        self.postMessage({
          success: false,
          error: String(error).slice(0, 350)
        });
      }
    };
  `;
}

// ============================================================
// 15. RESULTADOS DE LAS PRUEBAS
// ============================================================

function renderTestResults(results) {
  const passing = results.filter(
    result => result.passed
  ).length;

  const allPassed =
    passing === results.length &&
    results.length > 0;

  const rows = results.map(result => {
    if (result.error) {
      return `
        <div class="test-row failed">
          ✕ ${escapeHtml(result.error)}
        </div>
      `;
    }

    const input = escapeHtml(
      JSON.stringify(result.input)
    );

    const actual = escapeHtml(
      result.actual
    );

    const expected = escapeHtml(
      JSON.stringify(result.expected)
    );

    const explanation = result.passed
      ? ''
      : ` (esperado: ${expected})`;

    return `
      <div class="test-row ${result.passed ? 'passed' : 'failed'
      }">
        ${result.passed ? '✓' : '✕'}
        ${input}
        →
        ${actual}
        ${explanation}
      </div>
    `;
  }).join('');

  const message = allPassed
    ? `
      <div class="feedback good">
        <strong>
          ¡Todas las pruebas pasaron!
        </strong>

        Ahora explica ambos for
        sin mirar el código.
      </div>
    `
    : `
      <div class="feedback try">
        <strong>
          Aún hay casos por resolver
        </strong>

        Revisa índices, desplazamiento
        y posición final de key.
      </div>
    `;

  return {
    passing,

    html: `
      <div class="test-results">
        ${rows}
      </div>

      ${message}
    `
  };
}

// ============================================================
// 16. EJECUTAR PRUEBAS
// ============================================================

function runPythonTests(source) {
  const output = elements.view.querySelector(
    '#results'
  );

  const status = elements.view.querySelector(
    '#runtime-status'
  );

  const button = elements.view.querySelector(
    '#run-tests'
  );

  if (!output || !status || !button) {
    return;
  }

  latestTestResults = null;
  const testedRevision = codeRevision;

  if (source.includes('____')) {
    output.innerHTML = `
      <div class="feedback try">
        <strong>
          Hay huecos pendientes
        </strong>

        Reemplaza todos los ____
        antes de ejecutar las pruebas.
      </div>
    `;

    return;
  }

  activePythonWorker?.terminate();

  button.disabled = true;
  button.textContent = 'Cargando y ejecutando…';

  status.textContent =
    'Cargando Python en un entorno aislado…';

  output.innerHTML = '';

  const blob = new Blob(
    [createWorkerSource()],
    {
      type: 'application/javascript'
    }
  );

  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  URL.revokeObjectURL(url);

  activePythonWorker = worker;

  let finished = false;

  const finish = () => {
    if (finished) {
      return false;
    }

    finished = true;

    clearTimeout(timeout);

    worker.terminate();

    if (activePythonWorker === worker) {
      activePythonWorker = null;
    }

    button.disabled = false;
    button.textContent = '▶ Ejecutar pruebas';

    return true;
  };

  const timeout = setTimeout(() => {
    if (!finish()) {
      return;
    }

    status.textContent = 'Tiempo excedido.';

    output.innerHTML = `
      <div class="feedback try">
        <strong>
          Se superaron los 25 segundos.
        </strong>

        Puede existir un ciclo infinito
        o la descarga de Python fue
        demasiado lenta.
      </div>
    `;
  }, EXECUTION_TIMEOUT_MS);

  worker.onmessage = ({ data }) => {
    const isCurrentRun = activePythonWorker === worker;

    if (!finish()) {
      return;
    }

    if (!data.success) {
      status.textContent =
        'No se pudo ejecutar Python.';

      output.innerHTML = `
        <div class="feedback try">
          <strong>Error</strong>
          ${escapeHtml(data.error)}.
          Comprueba tu conexión.
        </div>
      `;

      return;
    }

    const { passing, html } =
      renderTestResults(data.results);

    if (
      isCurrentRun &&
      testedRevision === codeRevision &&
      source === state.code
    ) {
      latestTestResults = data.results;
    }

    status.textContent =
      `${passing} de ${data.results.length} ` +
      'pruebas correctas.';

    status.className = `status ${passing === data.results.length
        ? 'good'
        : ''
      }`;

    output.innerHTML = html;
  };

  worker.onerror = error => {
    if (!finish()) {
      return;
    }

    status.textContent =
      'Error al ejecutar Python.';

    output.innerHTML = `
      <div class="feedback try">
        ${escapeHtml(
      error.message ||
      'No pudo iniciarse Python.'
    )}
      </div>
    `;
  };

  worker.postMessage({
    source
  });
}

// ============================================================
// 17. ENTREGA DE ACTIVIDAD
// ============================================================

async function submitStudentSolution(event) {
  const form = event.target;

  if (form.id !== 'submission-form') {
    return;
  }

  event.preventDefault();

  const button = form.querySelector('#submit-solution');
  const status = form.querySelector('#submission-status');

  if (isSubmitting || button.disabled || !form.reportValidity()) {
    return;
  }

  const formData = new FormData(form);
  const studentName = formData.get('student_name').trim();
  const explanation = formData.get('explanation').trim();
  const pythonCode =
    elements.view.querySelector('#code-editor')?.value ?? state.code;

  if (!studentName || !explanation || !pythonCode.trim()) {
    status.textContent =
      'Completa todos los campos y escribe tu código.';
    return;
  }

  const results = pythonCode === state.code ? latestTestResults : null;
  const testsPassed = results
    ? `${results.filter(test => test.passed).length}/${results.length}`
    : 'No ejecutadas';

  formData.set('student_name', studentName);
  formData.set('explanation', explanation);
  formData.set('_subject', `Insertion Sort - ${studentName}`);
  formData.set('algorithm', 'Insertion Sort');
  formData.set('python_code', pythonCode);
  formData.set('tests_passed', testsPassed);
  formData.set(
    'missions_completed',
    `${state.completed.length}/${MISSIONS.length}`
  );
  formData.set('submitted_at', new Date().toISOString());

  isSubmitting = true;
  button.disabled = true;
  button.textContent = 'Enviando solución…';
  status.textContent = 'Enviando…';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    status.innerHTML = `
      <div class="feedback good">
        <strong>¡Entrega enviada correctamente!</strong>
        Tu código ha sido recibido para revisión.
      </div>
    `;
    button.textContent = 'Entrega realizada';
  } catch (error) {
    console.error('Error de envío:', error);

    status.innerHTML = `
      <div class="feedback try">
        No se pudo confirmar la entrega.
        Verifica tu conexión e inténtalo nuevamente.
      </div>
    `;
    button.disabled = false;
    button.textContent = 'Reintentar envío';
  } finally {
    isSubmitting = false;
  }
}

// ============================================================
// 18. INICIALIZACIÓN
// ============================================================

function initializeApp() {
  const requiredElements = Object.values(elements);

  if (
    requiredElements.some(
      element => !element
    )
  ) {
    console.error(
      'Faltan elementos del HTML necesarios ' +
      'para iniciar el laboratorio.'
    );

    return;
  }

  elements.nav.addEventListener(
    'click',
    onNavigationClick
  );

  elements.view.addEventListener(
    'click',
    onWorkspaceClick
  );

  elements.view.addEventListener(
    'input',
    onEditorInput
  );

  elements.view.addEventListener(
    'keydown',
    onEditorKeyDown
  );

  elements.view.addEventListener(
    'submit',
    submitStudentSolution
  );

  elements.resetButton.addEventListener(
    'click',
    () => elements.resetDialog.showModal()
  );

  elements.resetDialog.addEventListener(
    'close',
    () => {
      if (
        elements.resetDialog.returnValue !==
        'confirm'
      ) {
        return;
      }

      activePythonWorker?.terminate();
      activePythonWorker = null;
      invalidateTestResults();

      updateState(
        createInitialState()
      );
    }
  );

  render();
}

initializeApp();
