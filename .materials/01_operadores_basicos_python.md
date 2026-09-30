# Operadores básicos en Python

Realiza operaciones como asignación, aritmética y comparación.

Un **operador** es un símbolo o palabra especial que se utiliza para comprobar, modificar o combinar valores.

Por ejemplo, el operador de suma (`+`) suma dos números:

```python
i = 1 + 2
```

También existen operadores lógicos que permiten combinar expresiones booleanas:

```python
entered_door_code = True
passed_retina_scan = True

if entered_door_code and passed_retina_scan:
    print("Acceso permitido")
```

En Python, `and` cumple un propósito similar al operador `&&` de otros lenguajes.

Python incluye muchos de los operadores habituales de otros lenguajes, como suma, resta, multiplicación, división y comparación.

## Terminología

Los operadores pueden clasificarse según la cantidad de valores sobre los que trabajan.

### Operadores unarios

Un operador **unario** trabaja sobre un solo valor.

Por ejemplo:

```python
a = 5
b = -a
```

Aquí `-` es un operador unario.

También existe el operador lógico `not`:

```python
is_active = False

if not is_active:
    print("El usuario no está activo")
```

### Operadores binarios

Los operadores **binarios** trabajan sobre dos valores.

Por ejemplo:

```python
2 + 3
```

El operador `+` recibe dos operandos:

- `2`
- `3`

Por eso se considera un operador binario.

# Operador de asignación

El operador de asignación (`=`) inicializa o actualiza una variable.

```python
b = 10
a = 5

a = b

print(a)
```

Resultado:

```text
10
```

Después de ejecutar:

```python
a = b
```

el valor de `a` pasa a ser `10`.

## Constantes en Python


Python tampoco obliga a declarar explícitamente si una variable será constante o modificable.

Por convención, los nombres escritos completamente en mayúsculas se utilizan para representar constantes:

```python
MAX_ATTEMPTS = 3
```

Sin embargo, esto es una **convención**, no una restricción del lenguaje. Python todavía permite modificar ese valor.

---

## Desempaquetado de valores

Python permite asignar múltiples valores al mismo tiempo.

Por ejemplo:

```python
x, y = 1, 2
```

Después:

```python
print(x)  # 1
print(y)  # 2
```

En Python también podemos escribir explícitamente la tupla:

```python
x, y = (1, 2)
```

Ambas formas son válidas.

Python utiliza esta característica con mucha frecuencia.

Por ejemplo, para intercambiar dos variables:

```python
a = 10
b = 20

a, b = b, a

print(a)  # 20
print(b)  # 10
```

En otros lenguajes podría ser necesaria una variable temporal, pero Python permite hacerlo directamente.

---

## La asignación no es una expresión booleana

Python evita utilizar accidentalmente `=` cuando realmente se quería escribir `==`.

Esto no es válido:

```python
x = 10
y = 10

if x = y:
    print("Son iguales")
```

Python genera un error de sintaxis.

La comparación correcta es:

```python
if x == y:
    print("Son iguales")
```

Esto ayuda a distinguir claramente:

```text
=    asignación
==   comparación de igualdad
```

---

# Operadores aritméticos

Python soporta los operadores aritméticos principales:

- Suma (`+`)
- Resta (`-`)
- Multiplicación (`*`)
- División (`/`)
- División entera (`//`)
- Módulo (`%`)
- Potencia (`**`)

Ejemplos:

```python
1 + 2
```

Resultado:

```text
3
```

```python
5 - 3
```

Resultado:

```text
2
```

```python
2 * 3
```

Resultado:

```text
6
```

```python
10.0 / 2.5
```

Resultado:

```text
4.0
```

---

# División

En Python, el operador `/` realiza una división real y normalmente devuelve un número de punto flotante.

Por ejemplo:

```python
10 / 2
```

Resultado:

```text
5.0
```

Aunque ambos operandos sean enteros, el resultado de `/` es `float`.

En Python:

```python
5 / 2
```

produce:

```text
2.5
```

---

## División entera con `//`

Python proporciona un operador específico para división entera:

```python
//
```

Ejemplo:

```python
5 // 2
```

Resultado:

```text
2
```

Sin embargo, hay un detalle muy importante:

`//` realiza una operación conocida como **floor division**.

Es decir, redondea el resultado hacia abajo, hacia el entero matemáticamente menor.

Por ejemplo:

```python
5 // 2
```

da:

```text
2
```

pero:

```python
-5 // 2
```

da:

```text
-3
```

¿Por qué?

Porque:

```text
-5 / 2 = -2.5
```

y el entero inmediatamente inferior a `-2.5` es:

```text
-3
```

Esto es importante porque no siempre coincide con simplemente "eliminar los decimales".

---

# Overflow de enteros

Los enteros de Python tienen **precisión arbitraria**.

Por ejemplo:

```python
number = 10 ** 100
print(number)
```

Python puede representar ese número sin overflow de enteros en condiciones normales.

Incluso podemos escribir:

```python
huge_number = 999999999999999999999999999999999999999999999999999999
```

y Python seguirá tratando el valor como un `int`.

## Entonces, ¿Python nunca tiene overflow?

No exactamente.

Los `int` normales de Python pueden crecer mientras exista memoria disponible.

Pero otros tipos sí tienen límites.

Por ejemplo:

- `float`
- tipos numéricos de NumPy como `numpy.int8`
- `numpy.int32`
- `numpy.int64`
Por ejemplo, con NumPy:

```python
import numpy as np

value = np.int8(127)
```

Aquí sí estamos trabajando con un entero de 8 bits y pueden aparecer comportamientos de overflow propios de ese tipo.

---

# Concatenación de cadenas con `+`

El operador `+` también puede utilizarse para concatenar strings.

```python
"hello, " + "world"
```

Resultado:

```text
"hello, world"
```

Ejemplo:

```python
greeting = "Hola, " + "mundo"

print(greeting)
```

Resultado:

```text
Hola, mundo
```

---

## Python también utiliza f-strings

Aunque `+` funciona para concatenar strings, Python moderno suele preferir **f-strings** cuando se combinan textos y valores.

Por ejemplo:

```python
name = "Heber"

message = f"Hola, {name}"
```

Esto suele ser más legible que:

```python
message = "Hola, " + name
```

Python:

```python
message = f"Hola, {name}"
```

---

# Operador módulo `%`

El operador `%` calcula el residuo matemático asociado a una división.

Por ejemplo:

```python
9 % 4
```

Resultado:

```text
1
```

Podemos pensarlo como el residuo de una division
```


# Operador menos unario

El signo de un valor numérico puede invertirse utilizando `-`.

```python
three = 3

minus_three = -three
plus_three = -minus_three

print(minus_three)
print(plus_three)
```

Resultado:

```text
-3
3
```

Aquí:

```python
-three
```

significa:

```text
el negativo de three
```

Y:

```python
-minus_three
```

aplica nuevamente el operador negativo:

```text
-(-3) = 3
```

---

# Operador más unario

Python también soporta el operador `+` unario.

```python
minus_six = -6
also_minus_six = +minus_six
```

El valor sigue siendo:

```text
-6
```

El operador:

```python
+value
```

normalmente conserva el signo y valor numérico.

En código cotidiano se utiliza mucho menos que `-`.

---

# Operadores de asignación compuesta

Python permite combinar una operación aritmética con una asignación.

Por ejemplo:

```python
a = 1
a += 2
```

Después:

```python
print(a)
```

Resultado:

```text
3
```

La expresión:

```python
a += 2
```

es aproximadamente equivalente a:

```python
a = a + 2
```

---

## Operadores compuestos disponibles

Python incluye, entre otros:

```text
+=
-=
*=
/=
//=
%=
**=
```

## Los operadores compuestos tampoco producen un valor utilizable

Esto no es válido:

```python
a = 1
b = (a += 2)
```

Python produce un error de sintaxis.

Debe hacerse por separado:

```python
a = 1
a += 2

b = a
```

---

# Operadores de comparación

Python soporta los siguientes operadores de comparación:

| Operación | Python |
|---|---|
| Igual a | `a == b` |
| Diferente de | `a != b` |
| Mayor que | `a > b` |
| Menor que | `a < b` |
| Mayor o igual que | `a >= b` |
| Menor o igual que | `a <= b` |

Ejemplos:

```python
1 == 1
```

Resultado:

```text
True
```

```python
2 != 1
```

Resultado:

```text
True
```

```python
2 > 1
```

Resultado:

```text
True
```

```python
1 < 2
```

Resultado:

```text
True
```

```python
1 >= 1
```

Resultado:

```text
True
```

```python
2 <= 1
```

Resultado:

```text
False
```

---

# `True` y `False`

En Python, los valores booleanos se escriben con la primera letra en mayúscula:

```python
True
False
```

---

# Comparaciones dentro de `if`

Los operadores de comparación se utilizan con frecuencia en condiciones.

```python
name = "world"

if name == "world":
    print("hello, world")
else:
    print(f"I'm sorry {name}, but I don't recognize you")
```

Resultado:

```text
hello, world
```

Python utiliza indentación para definir los bloques de código.

En Python:

```python
if name == "world":
    print("hello, world")
```

Python utiliza:

```text
:
```

seguido de indentación.

---

# Comparación de tuplas

Python permite comparar tuplas lexicográficamente.

Esto significa que compara sus valores de izquierda a derecha.

Por ejemplo:

```python
(1, "zebra") < (2, "apple")
```

Resultado:

```text
True
```

¿Por qué?

Python primero compara:

```text
1 < 2
```

Como esto ya determina el resultado, `"zebra"` y `"apple"` ni siquiera necesitan compararse.

---

Otro ejemplo:

```python
(3, "apple") < (3, "bird")
```

Primero compara:

```text
3 == 3
```

Como son iguales, continúa con el siguiente elemento:

```text
"apple" < "bird"
```

Eso es verdadero, por lo que toda la comparación devuelve:

```text
True
```

---

También:

```python
(4, "dog") == (4, "dog")
```

Resultado:

```text
True
```

Todos los elementos son iguales.


# Una particularidad de Python: `bool` deriva de `int`

Este comportamiento puede resultar extraño.

En Python:

```python
isinstance(True, int)
```

produce:

```text
True
```

También:

```python
True + True
```

produce:

```text
2
```

porque internamente:

```text
True  → 1
False → 0
```

Esto no significa que sea recomendable tratar booleanos como números en código normal, pero explica por qué ciertas comparaciones son válidas en Python.

---

# Identidad de objetos

Python utiliza:

```python
is
is not
```

Por ejemplo:

```python
a = []
b = []
c = a

print(a == b)
print(a is b)
print(a is c)
```

Resultado:

```text
True
False
True
```

¿Por qué?

`a` y `b` contienen el mismo tipo de información:

```python
[]
```

por lo que:

```python
a == b
```

es verdadero.

Sin embargo, son dos listas diferentes en memoria:

```python
a is b
```

es falso.

En cambio:

```python
c = a
```

hace que `c` se refiera al mismo objeto que `a`.

Por eso:

```python
a is c
```

es verdadero.

---

# `==` no es lo mismo que `is`

Esta diferencia es muy importante.

Utiliza:

```python
==
```

para comparar valores.

Utiliza:

```python
is
```

para comprobar si dos nombres se refieren exactamente al mismo objeto.

Ejemplo:

```python
a = [1, 2, 3]
b = [1, 2, 3]

print(a == b)
```

Resultado:

```text
True
```

Pero:

```python
print(a is b)
```

Resultado:

```text
False
```

---

## Caso especial: `None`

Python suele utilizar `is` para comprobar `None`.

Forma recomendada:

```python
value = None

if value is None:
    print("No existe un valor")
```

No se suele recomendar:

```python
if value == None:
    ...
```

Aunque puede funcionar en muchos casos, la convención de Python es:

```python
is None
```

y:

```python
is not None
```

---
# Operadores lógicos

Otros lenguajes utilizan:

```text
&&
||
!
```

Python utiliza palabras:

```text
and
or
not
```

## AND

```python
has_password = True
has_token = True

if has_password and has_token:
    print("Acceso permitido")
```

## OR

Python:

```python
if is_admin or is_owner:
    print("Puede editar")
```
---

## NOT

Python:

```python
if not is_blocked:
    print("Usuario permitido")
```

---

# Operador de pertenencia

Python tiene operadores que no tienen equivalencia en otros lenguajes.

```text
in
not in
```

Permiten comprobar si un valor está contenido dentro de una colección.

Ejemplo:

```python
numbers = [1, 2, 3, 4]

print(3 in numbers)
```

Resultado:

```text
True
```

También:

```python
print(10 not in numbers)
```

Resultado:

```text
True
```

Con strings:

```python
"Py" in "Python"
```

Resultado:

```text
True
```

En Python:

```python
value in collection
```

es parte del lenguaje.

---

# Rangos en Python

Python no utiliza operadores de ese estilo.

Utiliza la función:

```python
range()
```

Por ejemplo:

```python
range(1, 5)
```

representa conceptualmente:

```text
1, 2, 3, 4
```

El límite superior no se incluye.

---

# Operador de potencia

Python incluye directamente:

```python
**
```

para exponentes.

Ejemplo:

```python
2 ** 3
```

Resultado:

```text
8
```

Porque:

```text
2³ = 8
```

Normalmente se utilizan funciones matemáticas como `pow`.

Python también dispone de:

```python
pow(2, 3)
```

que igualmente produce:

```text
8
```