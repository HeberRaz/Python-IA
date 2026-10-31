import time
from dataclasses import dataclass
from IPython.display import clear_output
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon


@dataclass(frozen=True)
class Level:
    maze: tuple[str, ...]
    start: tuple[int, int]
    direction: int
    goal: tuple[int, int]
    title: str = "Mini Karel"


LEVELS = {
    "ejercicio_01": Level(
        maze=(
            "#######",
            "#.....#",
            "#.###.#",
            "#...#.#",
            "###.#.#",
            "#.....#",
            "#######",
        ),
        start=(1, 1), direction=1, goal=(5, 5),
        title="Ejercicio 1 — Primera decisión",
    ),
    "ejercicio_02": Level(
        maze=(
            "########",
            "#......#",
            "#.####.#",
            "#....#.#",
            "####.#.#",
            "#......#",
            "########",
        ),
        start=(1, 1), direction=1, goal=(5, 6),
        title="Ejercicio 2 — if / elif / else",
    ),
    "ejercicio_03": Level(
        maze=(
            "#######",
            "#.....#",
            "###.#.#",
            "#...#.#",
            "#.###.#",
            "#.....#",
            "#######",
        ),
        start=(5, 1), direction=0, goal=(1, 5),
        title="Ejercicio 3 — Completa la lógica",
    ),
    "ejercicio_04": Level(
        maze=(
            "#########",
            "#.......#",
            "#.#####.#",
            "#.#.....#",
            "#.#.#####",
            "#.#.....#",
            "#.#####.#",
            "#.......#",
            "#########",
        ),
        start=(7, 1), direction=0, goal=(1, 7),
        title="Ejercicio 4 — Reto final",
    ),
}


class MiniKarel:
    DIRS = [(-1, 0), (0, 1), (1, 0), (0, -1)]  # N, E, S, O

    def __init__(self, level: Level, delay: float = 0.35):
        self.level = level
        self.maze = level.maze
        self.rows = len(self.maze)
        self.cols = len(self.maze[0])
        self.r, self.c = level.start
        self.direction = level.direction
        self.goal = level.goal
        self.delay = delay
        self.steps = 0
        self.turns = 0
        self.crashed = False
        self.finished = False
        self.draw()

    def _cell_clear(self, r, c):
        return 0 <= r < self.rows and 0 <= c < self.cols and self.maze[r][c] != "#"

    def front_is_clear(self):
        dr, dc = self.DIRS[self.direction]
        return self._cell_clear(self.r + dr, self.c + dc)

    def left_is_clear(self):
        d = (self.direction - 1) % 4
        dr, dc = self.DIRS[d]
        return self._cell_clear(self.r + dr, self.c + dc)

    def right_is_clear(self):
        d = (self.direction + 1) % 4
        dr, dc = self.DIRS[d]
        return self._cell_clear(self.r + dr, self.c + dc)

    def at_goal(self):
        return (self.r, self.c) == self.goal

    def move_forward(self):
        if self.finished or self.crashed:
            return
        if not self.front_is_clear():
            self.crashed = True
            self.draw()
            print("💥 Karel chocó contra una pared.")
            return
        dr, dc = self.DIRS[self.direction]
        self.r += dr
        self.c += dc
        self.steps += 1
        self.finished = self.at_goal()
        self.draw()
        if self.finished:
            print(f"✅ ¡Llegaste a la meta en {self.steps} movimientos!")

    def turn_left(self):
        if self.finished or self.crashed:
            return
        self.direction = (self.direction - 1) % 4
        self.turns += 1
        self.draw()

    def turn_right(self):
        if self.finished or self.crashed:
            return
        self.direction = (self.direction + 1) % 4
        self.turns += 1
        self.draw()

    def draw(self):
        clear_output(wait=True)
        fig, ax = plt.subplots(figsize=(6, 6))
        for r in range(self.rows):
            for c in range(self.cols):
                y = self.rows - 1 - r
                if self.maze[r][c] == "#":
                    ax.add_patch(Rectangle((c, y), 1, 1, facecolor="black"))
                else:
                    ax.add_patch(Rectangle((c, y), 1, 1, fill=False, edgecolor="lightgray"))
                if self.goal == (r, c):
                    ax.text(c + 0.5, y + 0.5, "🏁", ha="center", va="center", fontsize=24)

        x = self.c + 0.5
        y = self.rows - 1 - self.r + 0.5
        shapes = {
            0: [(x, y+0.32), (x-0.25, y-0.22), (x+0.25, y-0.22)],
            1: [(x+0.32, y), (x-0.22, y+0.25), (x-0.22, y-0.25)],
            2: [(x, y-0.32), (x-0.25, y+0.22), (x+0.25, y+0.22)],
            3: [(x-0.32, y), (x+0.22, y+0.25), (x+0.22, y-0.25)],
        }
        ax.add_patch(Polygon(shapes[self.direction], closed=True))
        ax.set_title(self.level.title)
        ax.set_xlim(0, self.cols)
        ax.set_ylim(0, self.rows)
        ax.set_aspect("equal")
        ax.axis("off")
        plt.show()
        time.sleep(self.delay)

    def status(self):
        if self.finished:
            print(f"✅ Ejercicio completado. Movimientos: {self.steps} | Giros: {self.turns}")
        elif self.crashed:
            print("❌ El intento terminó porque Karel chocó.")
        else:
            print("🟡 Karel todavía no llega a la meta.")
            print(f"📍 Posición: fila {self.r}, columna {self.c}")


_ACTIVE = None


def setup_level(level_name: str, delay: float = 0.35):
    global _ACTIVE
    if level_name not in LEVELS:
        raise ValueError(f"Nivel desconocido: {level_name}")
    _ACTIVE = MiniKarel(LEVELS[level_name], delay=delay)
    return _ACTIVE


def _karel():
    if _ACTIVE is None:
        raise RuntimeError("Primero ejecuta setup_level(...).")
    return _ACTIVE


def move_forward(): _karel().move_forward()
def turn_left(): _karel().turn_left()
def turn_right(): _karel().turn_right()
def front_is_clear(): return _karel().front_is_clear()
def left_is_clear(): return _karel().left_is_clear()
def right_is_clear(): return _karel().right_is_clear()
def at_goal(): return _karel().at_goal()
def check_result(): _karel().status()
