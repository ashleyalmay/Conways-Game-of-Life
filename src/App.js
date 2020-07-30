import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import './index.css';

const numRows = 20;
const numCols = 20;


const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App= () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  const [i, setI] = useState(100);
  runningRef.current = running;

  const runSimulation = useCallback((i) => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(()=>{runSimulation(i)},i);
  }, []);

  return (
    <>
    <div >
    <h1>Conway's Game of Life</h1>
    </div>
    <div>

    </div>
    <div className = 'grid'
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "#61dafb" : undefined,
                border: "solid 1px black"
              }}
            />
          ))
        )}
      </div>
<h2>
Rules of the game<a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules">Please click here</a>
</h2>
<h2>Directions</h2>
<p>
Start/Stop: Turns on/off the simulation || Random: Puts random cells on the grid || Clear: clears the grid || Step: Manually goes though the game step by step with each click || Speed up: Turns the simulation into a fast boi
</p>

<div className='button1'>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation(i);
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        random
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        clear
      </button>

      <button
        onClick={() => {
          setRunning(false);
          clearTimeout(runSimulation)
          runningRef.current = true;
          runSimulation(i);
        }}
      >
        step
      </button>
      <button
        onClick={() => {
          console.log(i)
          setRunning(false);
          clearTimeout(runSimulation)
            setI(5000);
            console.log(i)
            runningRef.current = true;
            setRunning(true)
            runSimulation(i);
            setRunning(running);
              runningRef.current = true;
              runSimulation(i);
        }}
      >
        speed up
      </button>

      {/* <form class='form' id='form'>
        <div class='theform'>
          <label>Grid Size: X</label>
          <input type='text' placeholder= '20' id='gridsize'></input>
        </div>
        <div class='theform'>
          <label>Grid Size: Y</label>
          <input type='text' placeholder= '20' id='gridsize'></input>
        </div>
        
        <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        Enter
      </button>
      </form>*/}
      </div> 
    </>
  );
};

export default App;