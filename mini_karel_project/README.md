# Mini Karel — práctica de `if / else` en Python

Proyecto didáctico para practicar decisiones en Python con un robot animado dentro de laberintos.

## Estructura

```text
mini_karel_project/
├── karel_engine.py          # Motor compartido. Los alumnos no necesitan modificarlo.
├── requirements.txt        # Dependencias
├── README.md
└── ejercicios/
    ├── 01_primera_decision.ipynb
    ├── 02_if_elif_else.ipynb
    ├── 03_completa_la_logica.ipynb
    └── 04_reto_final.ipynb
```

## Cómo usarlo

1. Mantén la carpeta completa sin cambiar su estructura.
2. Abre uno de los notebooks dentro de `ejercicios/`.
3. Ejecuta la celda **Preparar ejercicio**.
4. El alumno modifica únicamente la celda **TU CÓDIGO**.
5. Al ejecutar esa celda, Karel se anima paso a paso.

## Comandos disponibles

```python
move_forward()
turn_left()
turn_right()
front_is_clear()
left_is_clear()
right_is_clear()
at_goal()
check_result()
```

Las funciones `front_is_clear()`, `left_is_clear()`, `right_is_clear()` y `at_goal()` devuelven valores booleanos (`True` o `False`) y están pensadas para usarse con `if`, `elif` y `else`.

## Instalación

En Jupyter normalmente basta con tener `matplotlib`. Si hace falta:

```bash
pip install -r requirements.txt
```
